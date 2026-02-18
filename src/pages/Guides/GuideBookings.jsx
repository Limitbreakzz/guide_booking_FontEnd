import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

const GuideBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [token, navigate]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("เซสชันหมดอายุหรือคุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const actionText = status === "confirmed" ? "รับงาน" : "ปฏิเสธ";
    if (!window.confirm(`ต้องการ${actionText} ใช่หรือไม่?`)) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("อัปเดตไม่สำเร็จ: " + (err.response?.data?.message || "กรุณาลองใหม่"));
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return "รอการยืนยัน";
      case "confirmed": return "ยืนยันแล้ว";
      case "rejected": return "ปฏิเสธแล้ว";
      default: return status;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
      case "confirmed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "rejected": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 md:px-8 font-medium">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#37101A] rounded-xl flex items-center justify-center shadow-md">
              <i className="fa-solid fa-calendar-check text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#37101A]">งานที่มีคนจอง</h1>
              <p className="text-gray-400 text-xs mt-1">จัดการรายการจองทริปของคุณ</p>
            </div>
          </div>
          <BackButton label="กลับ" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#37101A]/20 border-t-[#37101A] rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
            <i className="fa-solid fa-inbox text-5xl text-gray-200 mb-4"></i>
            <p className="text-gray-400 font-bold text-sm">ยังไม่มีรายการจองในขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row gap-5 md:items-center flex-grow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-[#37101A]">
                       <i className="fa-solid fa-map-location-dot text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#37101A] mb-0.5">{booking.trip?.name}</h3>
                      <div className="flex items-center gap-2 text-gray-400">
                        <i className="fa-solid fa-circle-user text-lg"></i>
                        <span className="text-sm">{booking.tourist?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:ml-auto">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                </div>

                {booking.status === "pending" && (
                  <div className="flex gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                    <button
                      onClick={() => updateStatus(booking.id, "confirmed")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition-all active:scale-95 text-sm"
                    >
                      <i className="fa-solid fa-check"></i>
                      <span>รับงาน</span>
                    </button>

                    <button
                      onClick={() => updateStatus(booking.id, "rejected")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-rose-600 border border-rose-200 px-5 py-2.5 rounded-lg font-bold hover:bg-rose-50 transition-all active:scale-95 text-sm"
                    >
                      <i className="fa-solid fa-xmark"></i>
                      <span>ปฏิเสธ</span>
                    </button>
                  </div>
                )}

                {booking.status !== "pending" && (
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-300 border border-gray-100">
                     <i className="fa-solid fa-check text-lg"></i>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GuideBookings;