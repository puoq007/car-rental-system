import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fullname: "", email: "", password: "", age: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return navigate("/");
    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setForm({
        fullname: parsed.fullname || "",
        email: parsed.email || "",
        password: "",
        age: parsed.age || "",
      });
    } catch {
      localStorage.removeItem("user");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:3000/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ อัปเดตข้อมูลสำเร็จ!");
        const updatedUser = { ...user, fullname: form.fullname, email: form.email, age: form.age };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditMode(false);
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Error updating user:", err);
    }
  };

  if (loading) return <div className="text-center mt-5">⏳ กำลังโหลด...</div>;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <img src="https://cdn-icons-png.flaticon.com/512/194/194938.png" alt="profile" />
            <h2>{user.fullname}</h2>
            <span className={`badge ${user.role}`}>{user.role.toUpperCase()}</span>
          </div>

          {!editMode ? (
            <div className="profile-info">
              <p><b>📧 อีเมล:</b> {user.email}</p>
              <p><b>🎂 อายุ:</b> {user.age ? `${user.age} ปี` : "ยังไม่ได้ระบุ"}</p>
              <p><b>👤 บทบาท:</b> {user.role === "admin" ? "ผู้ดูแลระบบ" : "นักศึกษา"}</p>
              <button onClick={() => setEditMode(true)}>✏️ แก้ไขข้อมูล</button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="edit-form">
              <label>ชื่อ-นามสกุล</label>
              <input value={form.fullname} onChange={e => setForm({ ...form, fullname: e.target.value })} required />

              <label>อีเมล</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

              <label>อายุ</label>
              <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} min="1" max="120" />

              <label>เปลี่ยนรหัสผ่าน (ถ้าต้องการ)</label>
              <input type="password" placeholder="••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

              <div className="btn-group">
                <button type="submit" className="save">💾 บันทึก</button>
                <button type="button" onClick={() => setEditMode(false)} className="cancel">❌ ยกเลิก</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}