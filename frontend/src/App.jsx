import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🔹 Student Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './student/Home';
import History from './student/History';
import Profile from './pages/Profile';
import BrandPage from './student/BrandPage';


// 🔹 Admin Pages
import AdminHome from './admin/AdminHome';
import AdminBrands from './admin/AdminBrands';
import AdminBrandsDetail from './admin/AdminBrandDetail'; 
import AdminHistory from './admin/AdminHistory';
import AdminRequests from './admin/AdminRequests';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔹 Student Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />


        {/* 🔹 Admin Routes */}
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/brands" element={<AdminBrands />} />
        <Route path="/admin/brand/:brandId" element={<AdminBrandsDetail />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/history" element={<AdminHistory />} />
        <Route path="/admin/request" element={<AdminRequests />} />
      </Routes>
    </Router>
  );
}

export default App;