import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/brands");
        const data = await res.json();
        const updated = data.map((b) => ({
          ...b,
          image: b.image ? `http://localhost:3000${b.image}` : "/placeholder.png",
        }));
        setBrands(updated);
      } catch (err) {
        console.error("❌ โหลดแบรนด์ล้มเหลว:", err);
      }
    };
    fetchBrands();
  }, []);

  const handleRentCar = (brand) => {
    if (!startDate || !endDate) {
      return alert("⚠️ กรุณาเลือกวันที่เช่าก่อน!");
    }

    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);

    navigate("/brand", {
      state: { brand, startDate, endDate },
    });
  };

  return (
    <>
      <Navbar
        links={[
          { name: "Home", to: "/home" },
          { name: "History", to: "/history" },
        ]}
        profile={true}
      />

      <div className="home-container">
        <div className="date-picker-card">
          <h2>เลือกวันที่เช่ารถ</h2>
          <h5>*** เลือกวันที่เช่าได้สูงสุด 3 วัน ***</h5>
          <div className="date-inputs">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="cars-container">
          {brands.map((brand) => (
            <div key={brand.id} className="car-card">
              <img src={brand.image} alt={brand.name} className="car-img" />
              <h4>{brand.name}</h4>
              <button className="rent-btn" onClick={() => handleRentCar(brand)}>
                ดูรุ่นรถ
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}