import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import BackButton from "../../components/BackButton";

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/trips/${id}`);
      setTrip(res.data.data);
    } catch (err) {
      console.error("Error fetching trip:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-gray-400">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center text-gray-500">ไม่พบข้อมูลทริป</div>
      </div>
    );
  }

  const isOwner = role === "GUIDE" && Number(userId) === trip.guideId;

  return (
    <div className="bg-[#F5F5F5] min-h-screen py-24 px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-[350px] bg-gray-100 relative">
          {trip.picture ? (
            <img
              src={`${import.meta.env.VITE_API_URL}/images/${trip.picture}`}
              alt={trip.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x400";
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300">
              <i className="fa-solid fa-image text-5xl"></i>
            </div>
          )}

          <div
            className={`absolute top-5 right-5 px-4 py-1.5 rounded-full text-[11px] font-black shadow-sm ${
              trip.isActive
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <i
              className={`fa-solid ${trip.isActive ? "fa-circle-check" : "fa-circle-xmark"} mr-1`}
            ></i>
            {trip.isActive ? "เปิดให้จอง" : "ปิดการจอง"}
          </div>
        </div>

        <motion.div
          className="p-8 md:p-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-black text-[#37101A] mb-2">
                {trip.name}
              </h1>
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <i className="fa-solid fa-location-dot mr-2 text-[#FFC1CC]"></i>
                <span>จังหวัด{trip.province?.name}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl text-right min-w-[150px]">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                ราคาประมาน
              </p>
              <p className="text-2xl font-black text-[#37101A]">
                {trip.price ? trip.price.toLocaleString() : "0"}{" "}
                <span className="text-sm font-normal ml-1 text-gray-500">
                  ฿
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-align-left text-gray-400 text-sm"></i>
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#37101A] text-sm">รายละเอียด</p>
                <p className="text-gray-600 leading-relaxed mt-1 text-[15px]">
                  {trip.description || "—"}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-user-tie text-gray-400 text-sm"></i>
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#37101A] text-sm">ผู้นำทริป</p>
                <div
                  onClick={() => navigate(`/guides/${trip.guide?.id}`)}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 
                 bg-[#F8F3F4] border border-[#37101A]/20 
                 rounded-xl cursor-pointer 
                 hover:bg-[#37101A] hover:text-white 
                 transition-all duration-300 group"
                >
                  <i className="fa-solid fa-user text-[#37101A] group-hover:text-white transition"></i>

                  <span className="font-semibold text-[#37101A] group-hover:text-white transition">
                    {trip.guide?.name}
                  </span>

                  <i
                    className="fa-solid fa-arrow-right text-xs 
                    text-gray-400 group-hover:text-white 
                    group-hover:translate-x-1 transition"
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {trip.isActive && role === "TOURIST" && (
              <button
                onClick={() => navigate(`/booking/${trip.id}`)}
                className="w-full py-4 rounded-2xl bg-[#37101A] text-white font-bold hover:bg-[#2A0C14] transition-all shadow-lg shadow-[#37101A]/10 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-calendar-check"></i>
                จองทริปนี้
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => navigate(`/trips/${trip.id}/edit`)}
                className="w-full py-4 rounded-2xl border-2 border-[#37101A] text-[#37101A] font-bold hover:bg-[#37101A] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-pen-to-square"></i>
                แก้ไขข้อมูลทริป
              </button>
            )}

            <div className="mt-6 flex justify-center">
              <BackButton label="ย้อนกลับ" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TripDetail;
