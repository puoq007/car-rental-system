import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./AdminRequests.css";

export default function AdminRequest() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/rentals");
    const data = await res.json();

    // ✅ แสดงเฉพาะสถานะ "รออนุมัติ"
    const pendingOnly = data.filter((r) => r.status === "รออนุมัติ");
    setRequests(pendingOnly);
  } catch (err) {
    console.error("❌ โหลดข้อมูลคำขอไม่สำเร็จ:", err);
  }
};

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

 const updateStatus = async (id, status) => {
  try {
    const res = await fetch(`http://localhost:3000/api/rentals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`✅ ${data.message}`);
      
      // ✅ ลบออกจาก state ทันที (แก้ bug type ไม่ตรง)
      setRequests((prev) => prev.filter((r) => String(r.id) !== String(id)));
    } else {
      alert(`⚠️ ${data.message}`);
    }
  } catch (err) {
    console.error("❌ อัปเดตสถานะไม่สำเร็จ:", err);
  }
};

  const handleApprove = (id) => {
    if (!window.confirm("✅ ต้องการอนุมัติคำขอนี้หรือไม่?")) return;
    updateStatus(id, "อนุมัติ");
  };

  const handleReject = (id) => {
    if (!window.confirm("❌ ต้องการปฏิเสธคำขอนี้หรือไม่?")) return;
    updateStatus(id, "ปฏิเสธ");
  };

  const filtered = requests.filter(
    (r) =>
      r.brand?.toLowerCase().includes(search.toLowerCase()) ||
      r.model?.toLowerCase().includes(search.toLowerCase()) ||
      r.student_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar
        links={[
          { name: "Home", to: "/admin/home" },
          { name: "Request", to: "/admin/request" },
          { name: "History", to: "/admin/history" },
        ]}
        profile={true}
      />

      <div className="request-container">
        <h2>📩 รายการคำขอเช่ารถ</h2>

        <input
          type="text"
          className="search-bar"
          placeholder="🔍 ค้นหาชื่อรถหรือชื่อนักศึกษา..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="request-table">
          <table>
            <thead>
              <tr>
                <th>ผู้ขอเช่า</th>
                <th>แบรนด์</th>
                <th>รุ่น</th>
                <th>วันที่เริ่ม</th>
                <th>วันที่สิ้นสุด</th>
                <th>ราคา</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
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
                    <td>
                      {r.status === "รออนุมัติ" ? (
                        <div className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleApprove(r.id)}
                          >
                            ✅ อนุมัติ
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleReject(r.id)}
                          >
                            ❌ ปฏิเสธ
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: "#888" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", color: "#999" }}>
                    ❌ ไม่พบคำขอในระบบ
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