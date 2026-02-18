import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "react-feather";
import AuthButtons from "./Login&Register";

const Navbar = ({ isOnBanner = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [menuOpen]);

  const navClass = ({ isActive }) =>
    `text-[#37101A] no-underline pb-1 border-b-2 transition duration-200 font-bold ${
      isActive ? "border-[#37101A]" : "border-transparent hover:border-[#37101A]"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `text-[#37101A] no-underline py-3 px-4 rounded-lg transition-all duration-200 font-bold ${
      isActive ? "bg-red-50 border-l-4 border-[#37101A]" : "hover:bg-gray-50"
    }`;

  const renderMenuByRole = (onLinkClick = () => {}, isMobile = false) => {
    const currentClass = isMobile ? mobileNavClass : navClass;
    
    // 1. เมนูสำหรับผู้ใช้ที่ไม่ได้ล็อกอิน
    if (!token) {
      return (
        <>
          <NavLink to="/" className={currentClass} onClick={onLinkClick}>หน้าแรก</NavLink>
          <NavLink to="/trips" className={currentClass} onClick={onLinkClick}>ทริปต่างๆ</NavLink>
          <NavLink to="/guides" className={currentClass} onClick={onLinkClick}>ไกด์</NavLink>
          <NavLink to="/contact" className={currentClass} onClick={onLinkClick}>ติดต่อ</NavLink>
        </>
      );
    }

    // 2. เมนูสำหรับนักท่องเที่ยว
    if (role === "TOURIST") {
      return (
        <>
          <NavLink to="/" className={currentClass} onClick={onLinkClick}>หน้าแรก</NavLink>
          <NavLink to="/trips" className={currentClass} onClick={onLinkClick}>ทริปต่างๆ</NavLink>
          <NavLink to="/guides" className={currentClass} onClick={onLinkClick}>ไกด์</NavLink>
          <NavLink to="/bookings/my-bookings" className={currentClass} onClick={onLinkClick}>การจองของฉัน</NavLink>
          <NavLink to={`/tourist/${userId}`} className={currentClass} onClick={onLinkClick}>โปรไฟล์</NavLink>
          <NavLink to="/contact" className={currentClass} onClick={onLinkClick}>ติดต่อ</NavLink>
        </>
      );
    }

    // 3. เมนูสำหรับไกด์
    if (role === "GUIDE") {
      return (
        <>
          <NavLink to="/" className={currentClass} onClick={onLinkClick}>หน้าแรก</NavLink>
          <NavLink to="/trips" className={currentClass} onClick={onLinkClick}>ทริปทั้งหมด</NavLink>
          <NavLink to="/my-trips" className={currentClass} onClick={onLinkClick}>ทริปของฉัน</NavLink>
          <NavLink to="/guide-bookings" className={currentClass} onClick={onLinkClick}>งานของฉัน</NavLink>
          {userId && (
            <NavLink to={`/guides/${userId}`} className={currentClass} onClick={onLinkClick}>โปรไฟล์</NavLink>
          )}
          <NavLink to="/contact" className={currentClass} onClick={onLinkClick}>ติดต่อ</NavLink>
        </>
      );
    }

    // 4. เมนูสำหรับแอดมิน (ปรับปรุงแล้ว)
    if (role === "ADMIN") {
      return (
        <>
          <NavLink to="/" className={currentClass} onClick={onLinkClick}>หน้าแรก</NavLink>
          <NavLink to="/admin/dashboard" className={currentClass} onClick={onLinkClick}>Dashboard</NavLink>
          <NavLink to="/admin/trips" className={currentClass} onClick={onLinkClick}>จัดการทริป</NavLink>
          <NavLink to="/admin/guides" className={currentClass} onClick={onLinkClick}>จัดการไกด์</NavLink>
          <NavLink to="/admin/tourists" className={currentClass} onClick={onLinkClick}>จัดการนักท่องเที่ยว</NavLink>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-slide-in { animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
          .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        `}
      </style>

      <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b-2 border-[#37101A]">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-3">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src="/img/logo.png" alt="Logo" className="h-10 w-auto" />
            <span className="font-black text-2xl text-[#37101A] tracking-tighter">GoWithGuide</span>
          </Link>

          <div className="hidden md:flex gap-6 lg:gap-8">
            {renderMenuByRole()}
          </div>

          <div className="hidden md:flex gap-3">
            <AuthButtons />
          </div>

          <div className="md:hidden">
            <button onClick={() => setMenuOpen(true)} className="text-[#37101A]">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col animate-slide-in">
            <div className="flex justify-between items-center p-5 border-b-2 border-[#37101A]">
              <div className="flex items-center gap-2">
                <img src="/img/logo.png" alt="Logo" className="h-8 w-auto" />
                <span className="font-black text-lg text-[#37101A]">GoWithGuide</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-[#37101A]">
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col gap-2 p-4 overflow-y-auto">
              {renderMenuByRole(() => setMenuOpen(false), true)}
            </div>
            <div className="mt-auto p-6 border-t bg-gray-50 text-center">
              <AuthButtons onAuthAction={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;