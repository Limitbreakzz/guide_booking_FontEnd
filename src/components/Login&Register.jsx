import React from "react";
import { useNavigate } from "react-router-dom";

const AuthButtons = ({ onAuthAction = () => { } }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    onAuthAction();
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  if (!token) {
    return (
      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mx-1">
        <button 
          onClick={() => { onAuthAction(); navigate("/login"); }} 
          className="px-5 py-1.5 text-sm text-[#37101A] border-2 border-[#37101A] rounded-xl font-bold hover:bg-[#37101A] hover:text-white transition-all duration-300 active:scale-95"
        >
          เข้าสู่ระบบ
        </button>
        <button 
          onClick={() => { onAuthAction(); navigate("/register"); }} 
          className="px-5 py-1.5 text-sm bg-[#FFC5D3] text-[#37101A] rounded-xl font-bold hover:bg-[#ffb0c2] transition-all duration-300 active:scale-95 shadow-sm"
        >
          สมัครสมาชิก
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
        <div className={`w-2 h-2 rounded-full ${
          role === "ADMIN" ? "bg-purple-500" : 
          role === "GUIDE" ? "bg-emerald-500" : "bg-blue-500"
        }`}></div>
        <span className="text-[12px] font-black uppercase tracking-wider text-gray-600">
          {role}
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-1.5 text-sm bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-bold hover:bg-rose-600 hover:text-white transition-all duration-300 active:scale-95 flex items-center gap-2"
      >
        <i className="fa-solid fa-right-from-bracket text-xs"></i>
        Logout
      </button>
    </div>
  );
};

export default AuthButtons;