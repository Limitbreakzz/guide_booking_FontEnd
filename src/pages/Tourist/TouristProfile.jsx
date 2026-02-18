import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import BackButton from "../../components/BackButton";

const TouristProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tourist, setTourist] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const isOwner =
    role === "TOURIST" && String(userId) === String(id);

  useEffect(() => {
    fetchTourist();
  }, [id]);

  const fetchTourist = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tourists/${id}`
      );
      setTourist(res.data.data);
    } catch (error) {
      console.error("Error:", error);
      setTourist(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-10 h-10 border-4 border-[#37101A]/20 border-t-[#37101A] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tourist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-gray-400">
        <i className="fa-solid fa-user-slash text-5xl mb-4"></i>
        <p className="font-bold">ไม่พบข้อมูลนักท่องเที่ยว</p>
        <div className="mt-6">
          <BackButton label="กลับ" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 px-4 font-medium text-[#37101A]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <BackButton label="ย้อนกลับ" />
          {isOwner && (
            <button
              onClick={() => navigate(`/tourist/${id}/edit`)}
              className="flex items-center gap-2 bg-[#37101A] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-[#2A0C14] transition-all"
            >
              <i className="fa-solid fa-user-pen text-base"></i>
              <span>แก้ไขโปรไฟล์</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* HEADER */}
          <div className="relative h-28 bg-[#37101A]">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <img
                src={
                  tourist.picture
                    ? `${import.meta.env.VITE_API_URL}/images/${tourist.picture}`
                    : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                alt={tourist.name}
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
              />
            </div>
          </div>

          <div className="pt-16 pb-10 px-6 md:px-10">
            {/* NAME */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black">{tourist.name}</h1>

              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border bg-[#FFC1CC]/30 text-[#37101A] border-[#FFC1CC]/40">
                  นักท่องเที่ยว
                </span>
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <InfoItem
                icon="fa-envelope"
                label="อีเมล"
                value={tourist.email}
              />

              <InfoItem
                icon="fa-phone"
                label="เบอร์โทรศัพท์"
                value={tourist.tel}
              />

              <InfoItem
                icon="fa-calendar"
                label="วันที่สมัคร"
                value={
                  tourist.createdAt
                    ? new Date(tourist.createdAt).toLocaleDateString()
                    : "-"
                }
              />

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 rounded-2xl border border-gray-50 hover:bg-[#FAF9F6] transition-colors">
    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
      <i className={`fa-solid ${icon} text-lg`}></i>
    </div>
    <div>
      <p className="text-[14px] text-gray-400 font-bold uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-bold">{value || "-"}</p>
    </div>
  </div>
);

export default TouristProfile;
