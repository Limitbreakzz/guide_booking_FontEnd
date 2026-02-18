import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { motion } from "framer-motion";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchMyTrips();
  }, []);

  const fetchMyTrips = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/trips`);
      const myTrips = res.data.data.filter(
        (trip) => trip.guideId === Number(userId)
      );
      setTrips(myTrips);
    } catch (err) {
      console.error("Error fetching trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบทริปนี้?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/trips/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setTrips(trips.filter(t => t.id !== id));
        alert("ลบทริปเรียบร้อย");
      } catch (err) {
        alert("ลบไม่สำเร็จ");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-gray-400 animate-pulse font-bold tracking-widest uppercase">กำลังโหลดทริปของคุณ...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#37101A] uppercase tracking-tight">ทริปของฉัน</h1>
            <p className="text-gray-400 text-xs font-bold uppercase mt-1 tracking-widest">รายการนำเที่ยวทั้งหมดที่คุณดูแล</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/create-trip')}
              className="flex items-center gap-2 bg-[#37101A] text-white px-6 py-3 rounded-xl font-medium text-sm uppercase tracking-[0.15em] hover:bg-[#2A0C14] transition-all shadow-lg shadow-[#37101A]/20 group"
            >
              <i className="fa-solid fa-plus text-sm group-hover:scale-110 transition-transform"></i>
              <span>เพิ่มทริปใหม่</span>
            </button>
            <BackButton label="กลับ" />
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
            <div className="text-gray-400 font-bold uppercase tracking-widest">ไม่มีข้อมูลทริป</div>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={trip.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl hover:shadow-gray-200/50 transition-all group shadow-sm"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">

                  <div className="w-full md:w-40 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {trip.picture ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/images/${trip.picture}`}
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-300 italic text-xs">No Image</div>
                    )}
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                      <h2 className="text-lg font-bold text-[#37101A] leading-tight">{trip.name}</h2>
                      <span className={`w-2 h-2 rounded-full ${trip.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-400'}`}></span>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                      {trip.price ? `${trip.price.toLocaleString()} THB` : "0 THB"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-center">
                    <button
                      onClick={() => navigate(`/trips/${trip.id}/edit`)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 text-gray-600 font-bold text-[11px] uppercase tracking-widest hover:bg-[#FFC1CC] hover:text-[#37101A] transition-all"
                    >
                      <i className="fa-solid fa-pen-to-square text-[13px]"></i>
                      แก้ไข
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(trip.id); }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-500 font-bold text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                      <i className="fa-solid fa-trash-can text-[13px]"></i>
                      ลบ
                    </button>
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

export default MyTrips;