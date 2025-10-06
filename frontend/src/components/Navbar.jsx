import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ links = [], profile = true }) {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setRole(userData.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("🚪 ออกจากระบบสำเร็จ");
    navigate("/");
  };

  const profileLink = role === "admin" ? "/admin/profile" : "/profile";
  const homeLink = role === "admin" ? "/admin/home" : "/home";

  return (
    <nav className="navbar-custom shadow-sm">
      <div className="navbar-container">
        {/* โลโก้ทางซ้าย */}
        <Link to={homeLink} className="navbar-logo">
          {role === "admin" ? "ADMIN CARS" : "CARS"}
        </Link>

        {/* เมนูกลาง (จัดให้อยู่ตรงกลางจริง) */}
        <div className="navbar-links">
          {links.map((link) => (
            <Link key={link.name} to={link.to} className="nav-link">
              {link.name}
            </Link>
          ))}
        </div>

        {/* โปรไฟล์ทางขวา */}
        {profile && (
          <div className="navbar-profile">
            <img
              src="https://cdn-icons-png.flaticon.com/512/194/194938.png"
              alt="Profile"
              className="profile-img"
              onClick={() =>
                document.querySelector(".dropdown-menu")?.classList.toggle("show")
              }
            />
            <div className="dropdown-menu">
              <Link to={profileLink} className="dropdown-item">👤 โปรไฟล์</Link>
              <button onClick={handleLogout} className="dropdown-item logout">
                🚪 ออกจากระบบ
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}