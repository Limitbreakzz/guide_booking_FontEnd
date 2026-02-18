import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "ADMIN") {
      navigate("/login");
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", icon: "fa-solid fa-chart-pie", path: "/admin/dashboard" },
    { label: "ทริปทั้งหมด", icon: "fa-solid fa-map-location-dot", path: "/admin/trips" },
    { label: "จัดการไกด์", icon: "fa-solid fa-user-tie", path: "/admin/guides" },
    { label: "รายชื่อนักท่องเที่ยว", icon: "fa-solid fa-users-gear", path: "/admin/tourists" },
  ];

  if (role !== "ADMIN") return null;

  return (
    <div className="flex bg-slate-50">
      <aside className="hidden md:flex flex-col w-72 bg-white fixed h-full z-40 border-r border-slate-200">
        <div className="p-8 mb-4">
          <Link to="/admin/dashboard" className="flex items-center gap-3 no-underline group">
            <div className="bg-[#37101A] p-2 rounded-xl transition-transform duration-300 shadow-lg shadow-[#37101A]/20">
              <img src="/img/logo.png" alt="Logo" className="h-7 w-auto brightness-0 invert" />
            </div>
            <span className="font-black text-xl tracking-tight text-[#37101A]">GoWithGuide</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl no-underline transition-all duration-200 group ${
                  isActive 
                    ? "bg-[#37101A] text-white shadow-lg shadow-[#37101A]/20" 
                    : "text-slate-500 hover:text-[#37101A] hover:bg-slate-50"
                }`}
              >
                <i className={`${item.icon} text-lg ${isActive ? "text-white" : "text-slate-400 group-hover:text-[#37101A]"}`}></i>
                <span className="font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-100 text-red-500 font-bold hover:bg-red-50 hover:border-red-100 transition-all active:scale-95"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- Mobile Header (White Style) --- */}
      <div className="md:hidden fixed top-0 w-full bg-white p-4 flex justify-between items-center z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/img/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-bold text-[#37101A]">GoWithGuide</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-[#37101A] bg-slate-50 rounded-lg active:bg-slate-100"
        >
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={() => setMenuOpen(false)} />
      )}

      {/* --- Mobile Sidebar (White Style) --- */}
      <aside className={`md:hidden fixed top-0 left-0 w-72 h-screen bg-white shadow-2xl z-50 transition-transform duration-300 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8 pt-20 border-b border-slate-50">
           <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Admin Menu</span>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl no-underline font-bold transition-colors ${
                  isActive ? "bg-[#37101A] text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <i className={`${item.icon} w-6 text-center`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 md:ml-72 min-h-screen pt-20 md:pt-0">
        <header className="hidden md:flex h-20 items-center justify-end px-10 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">Administrator</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Main Control Panel</p>
              </div>
              <div className="h-10 w-10 bg-[#37101A] rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                <i className="fa-solid fa-user-gear text-xs"></i>
              </div>
           </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;