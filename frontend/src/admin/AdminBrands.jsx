import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./AdminBrands.css";

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", image: null });
  const [editBrand, setEditBrand] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", image: null });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/brands");
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.error("❌ โหลดข้อมูลแบรนด์ล้มเหลว:", err);
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!form.name || !form.image) return alert("⚠️ กรุณากรอกข้อมูลให้ครบ");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("image", form.image);

    const res = await fetch("http://localhost:3000/api/brands", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ เพิ่มแบรนด์สำเร็จ");
      setShowForm(false);
      setForm({ name: "", image: null });
      fetchBrands();
    } else {
      alert(`⚠️ ${data.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบแบรนด์นี้หรือไม่?")) return;
    const res = await fetch(`http://localhost:3000/api/brands/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      alert("🗑️ ลบสำเร็จ");
      fetchBrands();
    } else {
      alert(`⚠️ ${data.message}`);
    }
  };

  const handleEdit = (brand) => {
    setEditBrand(brand);
    setEditForm({ name: brand.name, image: null });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", editForm.name);
    if (editForm.image) formData.append("image", editForm.image);

    const res = await fetch(`http://localhost:3000/api/brands/${editBrand.id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ แก้ไขข้อมูลสำเร็จ!");
      setEditBrand(null);
      fetchBrands();
    } else {
      alert(`⚠️ ${data.message}`);
    }
  };

  return (
    <>
      <Navbar links={[{ name: "Home", to: "/admin/home" }]} profile={true} />

      <div className="brand-detail-container">
        <h2>🚗 แบรนด์รถทั้งหมด</h2>
        <button
          className="add-model-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "❌ ปิดฟอร์ม" : "➕ เพิ่มแบรนด์รถ"}
        </button>

        {showForm && (
          <form onSubmit={handleAddBrand} className="model-form">
            <label>ชื่อแบรนด์:</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label>เลือกรูปภาพ:</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            />

            <button type="submit" className="btn btn-success mt-3">
              ✅ บันทึกแบรนด์
            </button>
          </form>
        )}

        <div className="models-container">
          {brands.map((b) => (
            <div key={b.id} className="model-card">
              <img
                src={`http://localhost:3000${b.image}`}
                alt={b.name}
                className="model-img"
              />
              <h4>{b.name}</h4>

              {/* ✅ ปุ่มแก้ไข/ลบ */}
              <div className="brand-buttons">
                <button className="btn btn-warning" onClick={() => handleEdit(b)}>
                  ✏️ แก้ไข
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(b.id)}>
                  🗑️ ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Modal แก้ไข */}
      {editBrand && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>✏️ แก้ไขแบรนด์: {editBrand.name}</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                className="form-control"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                className="form-control mt-2"
                onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
              />

              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-success w-50">
                  💾 บันทึก
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-50"
                  onClick={() => setEditBrand(null)}
                >
                  ❌ ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}