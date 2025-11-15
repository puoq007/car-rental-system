
# 🚗 Car Rental System (Student & Admin)

ระบบจองรถสำหรับนักศึกษา พร้อมหลังบ้านสำหรับแอดมินอนุมัติ/ปฏิเสธคำขอ  
ประกอบด้วย **Backend (Node.js + Express + MySQL)** และ **Frontend (React/Vite)**

---

## 🧭 ภาพรวมโปรเจกต์

**ผู้ใช้ (นักศึกษา):**
- เลือกช่วงวันที่ต้องการเช่า
- เลือกแบรนด์ → เลือกรุ่น → กดจอง
- ดูประวัติการเช่าและสถานะ (“รออนุมัติ / อนุมัติ / ปฏิเสธ”)

**ผู้ดูแลระบบ (Admin):**
- ดูคำขอเช่าที่เข้ามา
- อนุมัติ/ปฏิเสธแบบเรียลไทม์ (อัปเดตฐานข้อมูล + ลบแถวออกจากตารางทันทีใน UI)
- ดูประวัติทั้งหมด

---

## 🧩 ฟีเจอร์หลัก

- 🔐 สมัครสมาชิก/เข้าสู่ระบบ (role: student/admin)
- 🏷️ จัดการแบรนด์/รุ่นรถ (เพิ่ม/แก้ไข/ลบ + อัปโหลดรูป)
- 📅 จองรถ (สถานะเริ่ม “รออนุมัติ”)
- ✅ อนุมัติ / ❌ ปฏิเสธคำขอ
- 🧾 ประวัติการเช่าแยกผู้ใช้
- 🖼️ แสดงรูปภาพรถจาก `/uploads`

---

## ⚙️ เทคโนโลยีที่ใช้

| Layer | Technology |
|-------|-------------|
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express |
| Database | MySQL |
| Uploads | Multer |
| Deploy | Vercel (Frontend) / Render (Backend) |

---

## 📁 โครงสร้างโฟลเดอร์

```
car/
├── backend/
│   ├── app.js
│   ├── uploads/
│   │   ├── brands/
│   │   └── models/
│   └── package.json
│   └── car.sql
└── frontend/
    ├── src/
    │   ├── admin/
    │   │   ├── AdminBrandDetail
    │   │   ├── AdminBrands
    │   │   ├── AdminHistory
    │   │   ├── AdminHome
    │   │   └── AdminRequests
    │   ├── components/
    │   │   └── Navbar
    │   ├── pages/
    │   │   ├── Login
    │   │   ├── Profile
    │   │   └── Register
    │   └── student/
    │       ├── BrandPage
    │       ├── History
    │       └── Home
    ├── App
    ├── main
    ├── index.html
    └── package.json

```

---

## 🗄️ Database Schema

```sql
CREATE DATABASE car;

USE car;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('student','admin') DEFAULT 'student'
);

CREATE TABLE brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  image VARCHAR(255)
);

CREATE TABLE models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand_id INT,
  name VARCHAR(255),
  image VARCHAR(255),
  price DECIMAL(10,2),
  FOREIGN KEY (brand_id) REFERENCES brands(id)
);

CREATE TABLE rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  brand VARCHAR(255),
  model VARCHAR(255),
  start_date DATE,
  end_date DATE,
  price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'รออนุมัติ',
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 💻 วิธีติดตั้งและรัน

### 1️⃣ Backend
```bash
cd backend
npm install
node app.js
```

เปิดที่: [http://localhost:3000](http://localhost:3000)

### 2️⃣ Frontend
```bash
cd frontend
npm install
npm run dev
```

เปิดที่: [http://localhost:5173](http://localhost:5173)

## 🧠 แนวทางพัฒนาเพิ่มเติม

- 🔒 เข้ารหัสรหัสผ่านด้วย `bcrypt`
- 🔑 ใช้ JWT Authentication
- ☁️ ย้ายรูปไปเก็บบน Cloud Storage
- 📊 เพิ่ม Dashboard แสดงสถิติ
- 📨 ส่งอีเมลแจ้งสถานะคำขอ
