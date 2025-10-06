import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';

export default function AdminHome() {
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', to: '/admin/home' },
    { name: 'History', to: '/admin/history' },
    { name: 'Request', to: '/admin/Request' },
  ];

  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [brandImage, setBrandImage] = useState(null);

  // ✅ โหลดข้อมูลแบรนด์ทั้งหมด
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/brands');
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      console.error('❌ โหลดข้อมูลแบรนด์ล้มเหลว:', error);
    }
  };

  // ✅ เพิ่มแบรนด์ใหม่ (อัปโหลดจากเครื่อง)
  const handleAddBrand = async (e) => {
    e.preventDefault();

    if (!brandName || !brandImage) {
      return alert('⚠️ กรุณากรอกชื่อแบรนด์และเลือกรูปภาพ');
    }

    const formData = new FormData();
    formData.append('name', brandName);
    formData.append('image', brandImage);

    try {
      const res = await fetch('http://localhost:3000/api/brands', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ เพิ่มแบรนด์สำเร็จ!');
        setShowForm(false);
        setBrandName('');
        setBrandImage(null);
        fetchBrands();
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (error) {
      console.error('❌ เพิ่มแบรนด์ล้มเหลว:', error);
      alert('เกิดข้อผิดพลาดระหว่างเพิ่มแบรนด์');
    }
  };

  const handleBrandClick = (brand) => {
    navigate(`/admin/brand/${brand.id}`, { state: { brand } });
  };

  return (
    <>
      <Navbar links={navLinks} profile={true} />

      <div className="admin-home-container">
        <h2>🚗 แบรนด์รถทั้งหมด</h2>

        <button className="add-brand-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '❌ ปิดฟอร์ม' : '➕ เพิ่มแบรนด์รถ'}
        </button>

        {showForm && (
          <form onSubmit={handleAddBrand} className="brand-form mt-3">
            <div className="mb-2">
              <label>ชื่อแบรนด์:</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="mb-2">
              <label>เลือกรูปภาพ:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBrandImage(e.target.files[0])}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              ✅ บันทึกแบรนด์
            </button>
          </form>
        )}

        <div className="brands-container mt-4">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div
                key={brand.id}
                className="brand-card"
                onClick={() => handleBrandClick(brand)}
              >
                <img
                  src={`http://localhost:3000${brand.image}`}
                  alt={brand.name}
                  className="brand-img"
                />
                <h3>{brand.name}</h3>
              </div>
            ))
          ) : (
            <p>ยังไม่มีแบรนด์ในระบบ</p>
          )}
        </div>
      </div>
    </>
  );
}