import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const renderMenuByRole = () => {

    // ไม่ได้ล็อกอิน
    if (!token) {
      return (
        <>
          <Link to="/">หน้าแรก</Link>
          <Link to="/trips">ทริปต่างๆ</Link>
          <Link to="/guides">ไกด์</Link>
          <Link to="/contact">ติดต่อ</Link>
        </>
      );
    }

    // TOURIST
    if (role === "TOURIST") {
      return (
        <>
          <Link to="/">หน้าแรก</Link>
          <Link to="/trips">ทริปต่างๆ</Link>
          <Link to="/guides">ไกด์</Link>
          <Link to="/tourist-bookings">การจองของฉัน</Link>
          <Link to={`/tourist/${userId}`}>โปรไฟล์</Link>
          <Link to="/contact">ติดต่อ</Link>
        </>
      );
    }

    // GUIDE
    if (role === "GUIDE") {
      return (
        <>
          <Link to="/">หน้าแรก</Link>
          <Link to="/trips">ทริปทั้งหมด</Link>
          <Link to="/my-trips">ทริปของฉัน</Link>
          <Link to="/guide-bookings">งานของฉัน</Link>
          <Link to={`/guides/${userId}`}>โปรไฟล์</Link>
          <Link to="/contact">ติดต่อ</Link>
        </>
      );
    }

    // ADMIN
    if (role === "ADMIN") {
      return (
        <>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/trips">จัดการทริป</Link>
          <Link to="/admin/guides">จัดการไกด์</Link>
          <Link to="/admin/tourists">จัดการนักท่องเที่ยว</Link>
        </>
      );
    }

    return null;
  };

  return (
    <footer className="bg-[#FDF8F9] border-t border-[#37101A]/20 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-[#37101A]">

        {/* Logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src="/img/logo.png" alt="Logo" className="h-12 mb-2" />
          <h2 className="font-bold text-xl">GoWithGuide</h2>
          <p className="text-gray-500 mt-2 text-xs">
            Explore Asia with trusted local guides
          </p>
        </div>

        {/* Dynamic Menu */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <h3 className="font-semibold mb-2">เมนู</h3>
          <div className="flex flex-col gap-2 text-[#37101A]">
            {renderMenuByRole()}
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
          <h3 className="font-semibold mb-2">ติดต่อ</h3>
          <div className="flex items-center gap-2 hover:text-[#FFC5D3] transition">
            <Mail size={16} />
            <span>GoWithGuide@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 hover:text-[#FFC5D3] transition">
            <Phone size={16} />
            <span>034-252-790, 034-241-853</span>
          </div>
        </div>

      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        © {new Date().getFullYear()} GoWithGuide. All rights reserved.
      </div>
    </footer>
  );
}
