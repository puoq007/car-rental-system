import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./BrandPage.css";

export default function BrandPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const brand = location.state?.brand || {};
  const brandId = brand.id;

  const startDate = location.state?.startDate || localStorage.getItem("startDate");
  const endDate = location.state?.endDate || localStorage.getItem("endDate");

  const [models, setModels] = useState([]);

  useEffect(() => {
    if (!brandId) {
      alert("⚠️ ไม่พบข้อมูลแบรนด์");
      navigate("/home");
      return;
    }
    fetchModels(brandId);
  }, [brandId]);

  const fetchModels = async (brandId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/models/${brandId}`);
      const data = await res.json();
      const updated = data.map((m) => ({
        ...m,
        image: m.image
          ? m.image.startsWith("/uploads")
            ? `http://localhost:3000${m.image}`
            : `http://localhost:3000/uploads/models/${m.image}`
          : "/placeholder.png",
      }));
      setModels(updated);
    } catch (err) {
      console.error("❌ โหลดรุ่นรถล้มเหลว:", err);
    }
  };

  const handleRent = async (model) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !startDate || !endDate) {
      alert("⚠️ กรุณาเลือกวันที่เช่าก่อนจากหน้า Home");
      navigate("/home");
      return;
    }

    const diffDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
    const totalPrice = diffDays * Number(model.price);

    try {
      const res = await fetch("http://localhost:3000/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          brand: brand.name,
          model: model.name,
          start_date: startDate,
          end_date: endDate,
          price: totalPrice,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ จองรถสำเร็จ! กรุณารอการอนุมัติจากผู้ดูแลระบบ");
        navigate("/history");
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Error booking:", err);
      alert("เกิดข้อผิดพลาดในการจอง");
    }
  };

  return (
    <>
      <Navbar
        links={[
          { name: "Home", to: "/home" },
          { name: "History", to: "/history" },
          { name: "Profile", to: "/profile" },
        ]}
        profile={true}
      />

      <div className="brand-page-container">
        <h2>🚗 รุ่นรถของ {brand.name}</h2>

        {models.length === 0 ? (
          <p className="text-muted">ไม่มีข้อมูลรุ่นของแบรนด์นี้</p>
        ) : (
          <div className="models-container">
            {models.map((model) => (
              <div key={model.id} className="model-card">
                <div className="model-img-wrapper">
                  <img src={model.image} alt={model.name} className="model-img" />
                </div>
                <h4>{model.name}</h4>
                <p className="price-tag">💰 ราคาเช่า: {Number(model.price).toLocaleString()} บาท / วัน</p>
                <button className="btn-rent" onClick={() => handleRent(model)}>
                  จองรุ่นนี้
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}