// ✅ Backend ระบบเช่ารถ (Node.js + Express + MySQL)
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
const uploadBase = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadBase)) fs.mkdirSync(uploadBase);
if (!fs.existsSync(`${uploadBase}/brands`)) fs.mkdirSync(`${uploadBase}/brands`);
if (!fs.existsSync(`${uploadBase}/models`)) fs.mkdirSync(`${uploadBase}/models`);

// ✅ ให้เข้าถึงไฟล์อัปโหลดผ่าน URL
app.use("/uploads", express.static(uploadBase));

// ✅ เชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "car",
});

// ✅ ตั้งค่า multer สำหรับแบรนด์
const brandStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, `${uploadBase}/brands`),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const uploadBrand = multer({ storage: brandStorage });

// ✅ ตั้งค่า multer สำหรับรุ่นรถ
const modelStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, `${uploadBase}/models`),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const uploadModel = multer({ storage: modelStorage });

/* ======================================================================
 🧍 USER API
====================================================================== */

// ✅ สมัครสมาชิก
app.post("/api/register", async (req, res) => {
  const { fullname, email, password, role } = req.body;
  if (!fullname || !email || !password)
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });

  try {
    const [exists] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (exists.length > 0)
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });

    await db.execute(
      "INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)",
      [fullname, email, password, role || "student"]
    );

    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
  } catch (err) {
    console.error("❌ Error Register:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ เข้าสู่ระบบ
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    const user = rows[0];
    res.json({ message: "เข้าสู่ระบบสำเร็จ", user });
  } catch (err) {
    console.error("❌ Error Login:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ อัปเดตข้อมูลผู้ใช้
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { fullname, email, password, age } = req.body;

  if (!fullname || !email)
    return res.status(400).json({ message: "กรุณากรอกชื่อและอีเมลให้ครบ" });

  try {
    if (password && password.trim() !== "") {
      await db.execute(
        "UPDATE users SET fullname = ?, email = ?, password = ?, age = ? WHERE id = ?",
        [fullname, email, password, age, id]
      );
    } else {
      await db.execute(
        "UPDATE users SET fullname = ?, email = ?, age = ? WHERE id = ?",
        [fullname, email, age, id]
      );
    }

    res.json({ message: "✅ อัปเดตข้อมูลผู้ใช้สำเร็จ" });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ message: "อัปเดตข้อมูลไม่สำเร็จ" });
  }
});

// ✅ ดึงประวัติการอนุมัติทั้งหมด
app.get("/api/history", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        approvals.id,
        users.fullname AS student_name,
        models.name AS car_name,
        models.image AS car_image,
        approvals.approved_date
      FROM approvals
      JOIN users ON approvals.user_id = users.id
      JOIN models ON approvals.model_id = models.id
      WHERE approvals.status = 'approved'
      ORDER BY approvals.approved_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).json({ message: "โหลดประวัติไม่สำเร็จ" });
  }
});


/* ======================================================================
 🚗 BRAND API
====================================================================== */

// ✅ ดึงข้อมูลแบรนด์ทั้งหมด
app.get("/api/brands", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM brands ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching brands:", err);
    res.status(500).json({ message: "โหลดข้อมูลแบรนด์ไม่สำเร็จ" });
  }
});

// ✅ เพิ่มแบรนด์
app.post("/api/brands", uploadBrand.single("image"), async (req, res) => {
  const { name } = req.body;
  const image = req.file ? `/uploads/brands/${req.file.filename}` : null;

  if (!name)
    return res.status(400).json({ message: "กรุณากรอกชื่อแบรนด์" });

  try {
    await db.execute("INSERT INTO brands (name, image) VALUES (?, ?)", [name, image]);
    res.json({ message: "เพิ่มแบรนด์สำเร็จ" });
  } catch (err) {
    console.error("❌ Error adding brand:", err);
    res.status(500).json({ message: "เพิ่มแบรนด์ไม่สำเร็จ" });
  }
});

// ✅ แก้ไขแบรนด์
app.put("/api/brands/:id", uploadBrand.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const image = req.file ? `/uploads/brands/${req.file.filename}` : null;

  if (!name)
    return res.status(400).json({ message: "กรุณากรอกชื่อแบรนด์" });

  try {
    const [result] = await db.execute(
      "UPDATE brands SET name = ?, image = COALESCE(?, image) WHERE id = ?",
      [name, image, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "ไม่พบแบรนด์นี้" });

    res.json({ message: "แก้ไขข้อมูลแบรนด์สำเร็จ" });
  } catch (err) {
    console.error("❌ Error updating brand:", err);
    res.status(500).json({ message: "แก้ไขข้อมูลแบรนด์ไม่สำเร็จ" });
  }
});

// ✅ ลบแบรนด์
app.delete("/api/brands/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("DELETE FROM brands WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "ไม่พบแบรนด์นี้" });
    res.json({ message: "ลบแบรนด์สำเร็จ" });
  } catch (err) {
    console.error("❌ Error deleting brand:", err);
    res.status(500).json({ message: "ลบแบรนด์ไม่สำเร็จ" });
  }
});

/* ======================================================================
 🚙 MODEL API
====================================================================== */

// ✅ ดึงข้อมูลรุ่นรถตามแบรนด์
app.get("/api/models/:brandId", async (req, res) => {
  const { brandId } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM models WHERE brand_id = ?", [brandId]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching models:", err);
    res.status(500).json({ message: "โหลดข้อมูลรุ่นไม่สำเร็จ" });
  }
});

// ✅ เพิ่มรุ่นรถ (อัปโหลดรูป)
app.post("/api/models", uploadModel.single("image"), async (req, res) => {
  try {
    console.log("📦 BODY:", req.body);
    console.log("📷 FILE:", req.file);

    const { brand_id, name, price } = req.body;
    const image = req.file ? `/uploads/models/${req.file.filename}` : null;

    if (!brand_id || !name || !price)
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });

    await db.execute(
      "INSERT INTO models (brand_id, name, image, price) VALUES (?, ?, ?, ?)",
      [brand_id, name, image, price]
    );

    res.json({ message: "✅ เพิ่มรุ่นรถสำเร็จ!" });
  } catch (err) {
    console.error("❌ Error adding model:", err);
    res.status(500).json({ message: "เพิ่มรุ่นรถไม่สำเร็จ" });
  }
});

// ✅ ลบรุ่นรถ
app.delete("/api/models/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute("DELETE FROM models WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "ไม่พบรุ่นนี้" });
    res.json({ message: "ลบรุ่นรถสำเร็จ" });
  } catch (err) {
    console.error("❌ Error deleting model:", err);
    res.status(500).json({ message: "ลบรุ่นรถไม่สำเร็จ" });
  }
});

// ✅ แก้ไขรุ่นรถ
app.put("/api/models/:id", uploadModel.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const image = req.file ? `/uploads/models/${req.file.filename}` : null;

  if (!name || !price) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
  }

  try {
    const [result] = await db.execute(
      "UPDATE models SET name = ?, price = ?, image = COALESCE(?, image) WHERE id = ?",
      [name, price, image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบรุ่นรถนี้" });
    }

    res.json({ message: "✅ แก้ไขรุ่นรถสำเร็จ!" });
  } catch (err) {
    console.error("❌ Error updating model:", err);
    res.status(500).json({ message: "แก้ไขรุ่นรถไม่สำเร็จ" });
  }
});

/* ======================================================================
 📅 RENTAL API
====================================================================== */

// ✅ เพิ่มการจองรถ
app.post("/api/rentals", async (req, res) => {
  console.log("\n🟢 [RENTAL API] POST /api/rentals ถูกเรียก");
  const { user_id, brand, model, start_date, end_date, price } = req.body;

  if (!user_id || !brand || !model || !start_date || !end_date || !price) {
    console.log("⚠️ ข้อมูลไม่ครบ:", req.body);
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO rentals (user_id, brand, model, start_date, end_date, price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, brand, model, start_date, end_date, price, "รออนุมัติ"]
    );

    console.log("✅ เพิ่มการจองสำเร็จ ID:", result.insertId);
    res.json({ message: "✅ จองรถสำเร็จ!", rental_id: result.insertId });
  } catch (err) {
    console.error("❌ ERROR ADDING RENTAL:", err);
    res.status(500).json({ message: "บันทึกข้อมูลการเช่าไม่สำเร็จ" });
  }
});

// ✅ ดึงรายการเช่าทั้งหมด (admin ดู)
app.get("/api/rentals", async (req, res) => {
  console.log("\n🟢 [RENTAL API] GET /api/rentals");
  try {
    const [rows] = await db.execute(`
      SELECT 
        r.*, 
        u.fullname AS student_name
      FROM rentals r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.id DESC
    `);
    console.log("✅ โหลดรายการเช่าทั้งหมด:", rows.length, "รายการ");
    res.json(rows);
  } catch (err) {
    console.error("❌ ERROR FETCHING RENTALS:", err);
    res.status(500).json({ message: "โหลดข้อมูลการเช่าไม่สำเร็จ" });
  }
});

// ✅ ดึงเฉพาะประวัติการเช่าของ user (หน้า History)
app.get("/api/rentals/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(`\n🟢 [RENTAL API] GET /api/rentals/${userId}`);
  try {
    const [rows] = await db.execute(
      `SELECT * FROM rentals WHERE user_id = ? ORDER BY id DESC`,
      [userId]
    );
    console.log("✅ โหลดประวัติของ user:", rows.length, "รายการ");
    res.json(rows);
  } catch (err) {
    console.error("❌ ERROR FETCHING USER RENTALS:", err);
    res.status(500).json({ message: "โหลดประวัติไม่สำเร็จ" });
  }
});

// ✅ อัปเดตสถานะการเช่ารถ (อนุมัติ / ปฏิเสธ)
app.put("/api/rentals/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`\n🟢 [RENTAL API] PUT /api/rentals/${id} => ${status}`);

  if (!status) {
    return res.status(400).json({ message: "❌ ต้องระบุสถานะใหม่" });
  }

  try {
    const [result] = await db.execute(
      "UPDATE rentals SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      console.log("⚠️ ไม่พบรายการเช่าที่ต้องการอัปเดต");
      return res.status(404).json({ message: "ไม่พบรายการเช่านี้" });
    }

    console.log(`✅ อัปเดตสถานะสำเร็จ -> ID: ${id}, Status: ${status}`);
    res.json({ message: `อัปเดตสถานะสำเร็จ: ${status}` });
  } catch (err) {
    console.error("❌ ERROR UPDATING RENTAL STATUS:", err);
    res.status(500).json({ message: "ไม่สามารถอัปเดตสถานะได้" });
  }
});


/* ======================================================================
 ✅ เริ่มต้นเซิร์ฟเวอร์
====================================================================== */

app.listen(3000, () => console.log("✅ Server running on port 3000"));