import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./AdminHistory.css";

export default function AdminHistory() {
  const [rentals, setRentals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRentals();
  }, []);

  // ✅ โหลดข้อมูลการเช่าทั้งหมด
  const fetchRentals = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/rentals");
      const data = await res.json();
      setRentals(data);
    } catch (err) {
      console.error("❌ โหลดข้อมูลการเช่าไม่สำเร็จ:", err);
    }
  };

  // ✅ แปลงวันที่เป็น DD-MM-YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  // ✅ ฟิลเตอร์ค้นหา
  const filtered = rentals.filter(
    (r) =>
      (r.brand && r.brand.toLowerCase().includes(search.toLowerCase())) ||
      (r.model && r.model.toLowerCase().includes(search.toLowerCase())) ||
      (r.student_name && r.student_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Navbar
        links={[
          { name: "Home", to: "/admin/home" },
          { name: "Request", to: "/admin/Request" },
        ]}
        profile={true}
      />

      <div className="history-container">
        <h2>📜 ประวัติการอนุมัติการเช่ารถ</h2>

        <input
          type="text"
          className="search-bar"
          placeholder="🔍 ค้นหาชื่อรถหรือชื่อนักศึกษา..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>ชื่อผู้เช่า</th>
                <th>แบรนด์</th>
                <th>รุ่น</th>
                <th>วันที่เริ่ม</th>
                <th>วันที่สิ้นสุด</th>
                <th>ราคา</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.student_name || "ไม่ระบุ"}</td>
                    <td>{r.brand}</td>
                    <td>{r.model}</td>
                    <td>{formatDate(r.start_date)}</td>
                    <td>{formatDate(r.end_date)}</td>
                    <td>{parseInt(r.price).toLocaleString()} ฿</td>
                    <td>
                      <span
                        className={`status-badge ${
                          r.status === "อนุมัติ"
                            ? "approved"
                            : r.status === "รออนุมัติ"
                            ? "pending"
                            : "rejected"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "#999" }}>
                    ❌ ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}