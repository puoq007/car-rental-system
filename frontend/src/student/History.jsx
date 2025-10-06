import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./History.css";

export default function History() {
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;
    fetchHistory(user.id);
  }, [user]);

  const fetchHistory = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/rentals/${userId}`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("❌ โหลดประวัติไม่สำเร็จ:", err);
    }
  };

  // ✅ แปลงวันที่ให้อยู่ในรูปแบบ "วัน-เดือน-ปี"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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

      <div className="history-container">
        <h2>📜 ประวัติการเช่ารถของคุณ</h2>

        {history.length === 0 ? (
          <p className="text-muted">ยังไม่มีประวัติการเช่ารถ</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-card">
                <div className="history-info">
                  <h4>{item.model}</h4>
                  <p>🏷️ ยี่ห้อ: {item.brand}</p>
                  <p>
                    📅 {formatDate(item.start_date)} → {formatDate(item.end_date)}
                  </p>
                  <p>💰 {Number(item.price).toLocaleString()} บาท</p>
                  <p className={`status ${item.status}`}>
                    {item.status === "รออนุมัติ" ? "🕒 รออนุมัติ" : "✅ อนุมัติแล้ว"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}