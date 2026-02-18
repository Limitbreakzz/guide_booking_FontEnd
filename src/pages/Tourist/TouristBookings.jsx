import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";
import { motion } from "framer-motion";

const TouristBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:4000/bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
      alert("โหลดข้อมูลการจองไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-[#FFC1CC]/10 text-amber-600 border-amber-100";
      case "confirmed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "rejected": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return "รอการยืนยัน";
      case "confirmed": return "ยืนยันแล้ว";
      case "rejected": return "ปฏิเสธการจอง";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-gray-400 animate-pulse font-medium tracking-widest uppercase">
          กำลังโหลด...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-medium text-[#37101A] tracking-tight">การจองของฉัน</h1>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-[0.2em] mt-1">
              ติดตามประวัติการเดินทางของคุณ
            </p>
          </div>
          <BackButton label="ย้อนกลับ" />
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg p-16 text-center border border-gray-100 shadow-sm text-gray-400 font-medium">
            ไม่พบรายการจอง
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg p-6 border border-gray-50 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-5">
                  <h2 className="text-lg font-medium text-[#37101A] leading-snug group-hover:text-[#FFC1CC] transition-colors">
                    {booking.trip?.name}
                  </h2>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-medium border shrink-0 ml-4 uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-[13px] text-gray-500 gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] flex items-center justify-center text-[#37101A]">
                      <i className="fa-solid fa-user-tie text-[10px]"></i>
                    </div>
                    <span className="font-medium">ไกด์: {booking.guide?.name}</span>
                  </div>
                  
                  <div className="flex items-center text-[13px] text-gray-500 gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] flex items-center justify-center text-[#37101A]">
                      <i className="fa-solid fa-calendar text-[10px]"></i>
                    </div>
                    <span className="font-medium lowercase">
                      {new Date(booking.datetime).toLocaleDateString("th-TH", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })} น.
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristBookings;