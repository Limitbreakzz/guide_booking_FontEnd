import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { Map, Users, Calendar, UserCheck, TrendingUp, Clock } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    trips: 0,
    guides: 0,
    tourists: 0,
    bookings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard`);
        setStats({
          trips: res.data.totalTrips || 0,
          guides: res.data.totalGuides || 0,
          tourists: res.data.totalTourists || 0,
          bookings: res.data.totalBookings || 0,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    fetchData();
  }, []);

  const chartData = [
    { name: "ทริป", value: stats.trips, color: "#1890FF" },
    { name: "ไกด์", value: stats.guides, color: "#37101A" },
    { name: "นักท่องเที่ยว", value: stats.tourists, color: "#DF98A9" },
    { name: "การจอง", value: stats.bookings, color: "#FFC5D3" },
  ];

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#37101A] tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">สรุปข้อมูลสถิติสำคัญของระบบ GoWithGuide</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Clock size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-500">อัปเดตล่าสุด: วันนี้, 10:00 น.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="ทริปทั้งหมด" value={stats.trips} icon={<Map size={24} />} color="text-blue-600" bgColor="bg-blue-50" />
        <StatCard label="ไกด์ทั้งหมด" value={stats.guides} icon={<UserCheck size={24} />} color="text-[#37101A]" bgColor="bg-[#37101A]/10" />
        <StatCard label="นักท่องเที่ยว" value={stats.tourists} icon={<Users size={24} />} color="text-pink-600" bgColor="bg-pink-50" />
        <StatCard label="การจองทั้งหมด" value={stats.bookings} icon={<Calendar size={24} />} color="text-emerald-600" bgColor="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg text-[#37101A]">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-xl font-bold text-[#37101A]">สถิติภาพรวม</h2>
            </div>
            <select className="bg-gray-50 border-none text-sm font-bold rounded-lg px-3 py-1 text-gray-500 focus:ring-0">
              <option>รายปี 2026</option>
              <option>รายเดือน</option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#37101A] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-[#37101A]/20">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold opacity-90">Quick Summary</h3>
              <p className="text-white/60 text-sm mt-2 font-light">การเติบโตของแพลตฟอร์มในเดือนที่ผ่านมา</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm text-white/70">การจองใหม่</span>
                <span className="text-lg font-bold">+ 12.5%</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm text-white/70">ไกด์สมัครใหม่</span>
                <span className="text-lg font-bold">+ 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">ยอดเข้าชม</span>
                <span className="text-lg font-bold">2.4k</span>
              </div>
            </div>

            <button className="w-full py-3 bg-white text-[#37101A] font-bold rounded-xl hover:bg-[#FFC1CC] transition-colors">
              ดูรายงานละเอียด
            </button>
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, bgColor }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm flex items-center gap-5"
  >
    <div className={`w-14 h-14 ${bgColor} ${color} rounded-2xl flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <h2 className="text-2xl font-bold text-[#37101A] mt-0.5">{value.toLocaleString()}</h2>
    </div>
  </motion.div>
);

export default AdminDashboard;