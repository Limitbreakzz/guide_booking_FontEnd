import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie, Legend
} from "recharts";
import { Map, Users, Calendar, UserCheck, TrendingUp, Clock, PieChart as PieIcon } from "lucide-react";

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
        const res = await axios.get("http://localhost:4000/admin/dashboard");
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

  const barData = [
    { name: "TRIPS", value: stats.trips, color: "#37101A" },
    { name: "GUIDES", value: stats.guides, color: "#DF98A9" },
    { name: "TOURISTS", value: stats.tourists, color: "#FFC5D3" },
    { name: "BOOKINGS", value: stats.bookings, color: "#FFB0C2" },
  ];

  const pieData = [
    { name: "Guides", value: stats.guides, color: "#37101A" },
    { name: "Tourists", value: stats.tourists, color: "#DF98A9" },
  ];

  return (
    <div className="w-full space-y-6 pb-10 px-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#37101A] tracking-tight uppercase">Admin Dashboard</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Platform Global Metrics</p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-[#37101A]">
          <Clock size={14} className="text-[#DF98A9]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">System update: {new Date().toLocaleDateString('th-TH')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Trips" value={stats.trips} icon={<Map size={20} />} />
        <StatCard label="Active Guides" value={stats.guides} icon={<UserCheck size={20} />} />
        <StatCard label="Total Tourists" value={stats.tourists} icon={<Users size={20} />} />
        <StatCard label="Total Bookings" value={stats.bookings} icon={<Calendar size={20} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-slate-50 rounded-lg text-[#37101A] border border-slate-100">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#37101A] tracking-tight">กราฟแสดงข้อมูลสถิติรวม</h2>
          </div>

          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }} 
                   contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={65}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-slate-50 rounded-lg text-[#37101A] border border-slate-100">
              <PieIcon size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#37101A] tracking-tight">สัดส่วนผู้ใช้ระบบ</h2>
          </div>

          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={10}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  iconType="circle" 
                  verticalAlign="bottom" 
                  formatter={(value) => <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{value}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total System Population</p>
             <h3 className="text-3xl font-black text-[#37101A]">{(stats.guides + stats.tourists).toLocaleString()}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between"
  >
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-slate-50 text-[#37101A] rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
        <h2 className="text-2xl font-black text-[#37101A] tracking-tighter">
          {value.toLocaleString()}
        </h2>
      </div>
    </div>
    <div className="text-[#DF98A9]/20">
      <TrendingUp size={32} />
    </div>
  </motion.div>
);

export default AdminDashboard;