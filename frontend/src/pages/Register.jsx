import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Register() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบรหัสผ่านตรงกัน
    if (form.password !== form.confirmPassword) {
      alert('❌ รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: form.fullname,
          email: form.email,
          password: form.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ สมัครสมาชิกสำเร็จ!');
        navigate('/'); // กลับไปหน้า Login
      } else {
        alert(`⚠️ ${data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก'}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('⚠️ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <>
      <Navbar links={[]} profile={false} />
      <div className="d-flex justify-content-center mt-5">
        <div className="card-simple">
          <h3 className="text-center mb-4">Register</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                className="form-control"
                value={form.fullname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </form>
          <p className="text-center mt-3">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}