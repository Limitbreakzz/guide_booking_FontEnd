import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Edit3, Trash2, UserCheck, Search, ChevronLeft, ChevronRight, Mail, ShieldCheck } from "lucide-react";

const AdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/guides`);
      setGuides(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันการลบข้อมูลไกด์? การกระทำนี้ไม่สามารถย้อนกลับได้")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/guides/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGuides();
    } catch (err) {
      alert("ลบไม่สำเร็จ");
    }
  };

  // Logic: Filter
  const filteredGuides = guides.filter(guide => 
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logic: Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGuides.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);

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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#37101A] uppercase tracking-tight">Guide Management</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Verify and manage platform tour guides</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 focus-within:border-[#37101A]/30 transition-all">
        <Search size={20} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="ค้นหาชื่อไกด์ หรืออีเมล..." 
          className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-300"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 w-1/3">ข้อมูลไกด์</th>
                <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 w-1/4">อีเมลติดต่อ</th>
                <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 w-1/6">สถานะการทำงาน</th>
                <th className="py-5 px-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((guide) => (
                <tr key={guide.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#37101A]/5 rounded-xl flex items-center justify-center text-[#37101A] border border-[#37101A]/10 group-hover:bg-white transition-colors">
                        <UserCheck size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[#37101A] text-base mb-0.5">{guide.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                          <ShieldCheck size={10} /> Certified Guide
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={14} className="text-slate-400" />
                      <span className="text-sm font-semibold">{guide.email}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                      guide.status 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                      {guide.status ? "● พร้อมให้บริการ" : "○ ไม่พร้อม"}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => navigate(`/guides/${guide.id}`)} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm"><Eye size={18} /></button>
                      <button onClick={() => navigate(`/guides/${guide.id}/edit`)} className="p-2.5 text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-lg transition-all shadow-sm"><Edit3 size={18} /></button>
                      <button onClick={() => handleDelete(guide.id)} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGuides.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-slate-300">
              <UserCheck size={64} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="font-black uppercase tracking-[0.3em] text-sm">No Guides Found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            Total {filteredGuides.length} Guides
          </span>
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

export default AdminGuides;