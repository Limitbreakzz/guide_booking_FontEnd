import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Eye, Edit3, Trash2, MapPin, Search, ChevronLeft, ChevronRight } from "lucide-react";

const AdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get("http://localhost:4000/trips");
      setTrips(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบทริปนี้?")) return;
    try {
      await axios.delete(`http://localhost:4000/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrips();
    } catch (err) {
      alert("ลบไม่สำเร็จ");
    }
  };

  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.guide?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-10 px-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#37101A] uppercase tracking-tight">Trip Management</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage all available travel packages</p>
        </div>
        <button
          onClick={() => navigate("/create-trip")}
          className="flex items-center justify-center gap-2 bg-[#37101A] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#37101A]/20 hover:bg-[#4d1a26] transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> เพิ่มทริปใหม่
        </button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search size={20} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="ค้นหาชื่อทริป หรือชื่อไกด์..." 
          className="flex-1 bg-transparent border-none outline-none text-base font-medium text-slate-600 placeholder:text-slate-300"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="py-5 px-8 text-[14px] font-medium uppercase text-slate-400 w-2/5">ชื่อทริป</th>
                <th className="py-5 px-8 text-[14px] font-medium uppercase text-slate-400 w-1/5">ไกด์ผู้ดูแล</th>
                <th className="py-5 px-8 text-[14px] font-medium uppercase text-slate-400 w-1/5 text-right">ราคา</th>
                <th className="py-5 px-8 text-[14px] font-medium uppercase text-slate-400 w-1/5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#37101A] transition-colors group-hover:bg-white border border-transparent group-hover:border-slate-200">
                        <MapPin size={22} />
                      </div>
                      <span className="font-extrabold text-[#37101A] text-base truncate max-w-md">{trip.name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-600">{trip.guide?.name || "ไม่ระบุ"}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-tighter">Verified Guide</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right font-black text-lg text-[#37101A]">
                    {Number(trip.price).toLocaleString()}
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => navigate(`/trips/${trip.id}`)} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm"><Eye size={18} /></button>
                      <button onClick={() => navigate(`/admin/trips/${trip.id}/edit`)} className="p-2.5 text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-lg transition-all shadow-sm"><Edit3 size={18} /></button>
                      <button onClick={() => handleDelete(trip.id)} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTrips.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-300">
              <MapPin size={48} className="mb-4 opacity-20" />
              <p className="font-black uppercase tracking-[0.2em] text-xs">ไม่พบข้อมูลทริปที่คุณกำลังค้นหา</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent text-[#37101A] text-xs font-black outline-none cursor-pointer"
            >
              {[10, 20, 50, 100].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTrips.length)} of {filteredTrips.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1.5 px-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 text-xs font-black rounded-lg transition-all border ${
                      currentPage === pageNum 
                        ? "bg-[#37101A] border-[#37101A] text-white shadow-lg shadow-[#37101A]/20" 
                        : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-20 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminTrips;