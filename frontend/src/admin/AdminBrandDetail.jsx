import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AdminBrandDetail.css';

export default function BrandDetail() {
  const { brandId } = useParams();
  const location = useLocation();
  const brand = location.state?.brand;
  const [models, setModels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', image: null });

  // ✅ Modal แก้ไข
  const [editModel, setEditModel] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', image: null });

  useEffect(() => {
    fetchModels();
  }, [brandId]);

  const fetchModels = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/models/${brandId}`);
      const data = await res.json();
      setModels(data);
    } catch (error) {
      console.error('❌ โหลดข้อมูลรุ่นรถล้มเหลว:', error);
    }
  };

  // ✅ เพิ่มรุ่นรถใหม่
  const handleAddModel = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.image)
      return alert('⚠️ กรุณากรอกข้อมูลให้ครบ');

    const formData = new FormData();
    formData.append('brand_id', brandId);
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('image', form.image);

    try {
      const res = await fetch('http://localhost:3000/api/models', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ เพิ่มรุ่นรถสำเร็จ!');
        setShowForm(false);
        setForm({ name: '', price: '', image: null });
        fetchModels();
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (error) {
      console.error('❌ เพิ่มรุ่นรถล้มเหลว:', error);
    }
  };

  // ✅ เปิดฟอร์มแก้ไข
  const handleEditClick = (model) => {
    setEditModel(model);
    setEditForm({ name: model.name, price: model.price, image: null });
  };

  // ✅ บันทึกการแก้ไข
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editForm.name || !editForm.price)
      return alert('⚠️ กรอกข้อมูลให้ครบ');

    const formData = new FormData();
    formData.append('name', editForm.name);
    formData.append('price', editForm.price);
    if (editForm.image) formData.append('image', editForm.image);

    try {
      const res = await fetch(`http://localhost:3000/api/models/${editModel.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ แก้ไขข้อมูลสำเร็จ!');
        setEditModel(null);
        fetchModels();
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (error) {
      console.error('❌ แก้ไขล้มเหลว:', error);
    }
  };

  // ✅ ลบรุ่นรถ
  const handleDelete = async (id) => {
    if (!window.confirm('คุณต้องการลบรุ่นนี้หรือไม่?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/models/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        alert('🗑️ ลบสำเร็จ');
        fetchModels();
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.error('❌ ลบไม่สำเร็จ:', err);
    }
  };

  return (
    <>
      <Navbar
        links={[
          { name: 'Home', to: '/admin/home' },
          { name: 'Brands', to: '/admin/home' },
        ]}
        profile={true}
      />

      <div className="brand-detail-container">
        <h2>🚗 {brand?.name || 'แบรนด์รถ'}</h2>
        <button className="add-model-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '❌ ปิดฟอร์ม' : '➕ เพิ่มรุ่นรถ'}
        </button>

        {showForm && (
          <form onSubmit={handleAddModel} className="model-form mt-3">
            <div className="mb-2">
              <label>ชื่อรุ่นรถ:</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-2">
              <label>ราคา (บาท):</label>
              <input
                type="number"
                className="form-control"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="mb-2">
              <label>เลือกรูปภาพ:</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              ✅ เพิ่มรุ่นรถ
            </button>
          </form>
        )}

        <div className="models-container mt-4">
          {models.length > 0 ? (
            models.map((m) => (
              <div key={m.id} className="model-card">
                <img
                  src={`http://localhost:3000${m.image}`}
                  alt={m.name}
                  className="model-img"
                />
                <h4>{m.name}</h4>
                <p>💰 {parseInt(m.price).toLocaleString()} บาท</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEditClick(m)}
                  >
                    ✏️ แก้ไข
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(m.id)}
                  >
                    🗑️ ลบ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>🚙 ยังไม่มีรุ่นรถในแบรนด์นี้</p>
          )}
        </div>
      </div>

      {/* ✅ Modal แก้ไขข้อมูล */}
      {editModel && (
        <div className="edit-modal">
          <div className="edit-modal-content shadow">
            <h3>✏️ แก้ไขรุ่น: {editModel.name}</h3>
            <form onSubmit={handleUpdate}>
              <label>ชื่อรุ่น:</label>
              <input
                type="text"
                className="form-control mb-2"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />

              <label>ราคา (บาท):</label>
              <input
                type="number"
                className="form-control mb-2"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              />

              <label>เปลี่ยนรูป (ถ้าต้องการ):</label>
              <input
                type="file"
                accept="image/*"
                className="form-control mb-3"
                onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
              />

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success w-50 me-2">
                  💾 บันทึก
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-50"
                  onClick={() => setEditModel(null)}
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