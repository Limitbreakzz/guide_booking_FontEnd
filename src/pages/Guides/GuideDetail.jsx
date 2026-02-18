import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../../components/BackButton";

const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [guide, setGuide] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const isOwner = role === "GUIDE" && String(userId) === String(id);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      if (!id) return;
      const guideRes = await axios.get(`${import.meta.env.VITE_API_URL}/guides/${id}`);
      setGuide(guideRes.data.data);
      if (!token) return;
      const bookingRes = await axios.get(
        `http://localhost:4000/bookings?guideId=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const activeJobs = bookingRes.data.data.filter((b) =>
        ["pending", "confirmed", "ongoing"].includes(b.status)
      );
      
      setJobs(activeJobs);
    } catch (error) {
      console.error("Error:", error);
      setGuide(null);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-10 h-10 border-4 border-[#37101A]/20 border-t-[#37101A] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-gray-400">
        <i className="fa-solid fa-user-slash text-5xl mb-4"></i>
        <p className="font-bold">ไม่พบข้อมูลไกด์</p>
        <div className="mt-6"><BackButton label="กลับ" /></div>
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
              onClick={() => navigate(`/guides/${id}/edit`)}
              className="flex items-center gap-2 bg-[#37101A] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-[#2A0C14] transition-all"
            >
              <i className="fa-solid fa-user-pen text-base"></i>
              <span>แก้ไขโปรไฟล์</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="relative h-28 bg-[#37101A]">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <img
                src={guide.picture ? `http://localhost:4000/images/${guide.picture}` : "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                alt={guide.name}
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
              />
            </div>
          </div>

          <div className="pt-16 pb-10 px-6 md:px-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black">{guide.name}</h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border ${guide.status ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                  {guide.status ? "พร้อมให้บริการ" : "งดรับงาน"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              <InfoItem icon="fa-briefcase" label="ประสบการณ์" value={guide.experience} />
              <InfoItem icon="fa-language" label="ภาษาที่ถนัด" value={guide.language} />
              <InfoItem icon="fa-envelope" label="อีเมลติดต่อ" value={guide.email} />
              <InfoItem icon="fa-phone" label="เบอร์โทรศัพท์" value={guide.tel} />
            </div>

            <div className="border-t border-gray-50 pt-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                   <i className="fa-solid fa-person-walking-luggage text-lg"></i>
                </div>
                <h2 className="text-lg font-bold">งานที่รับอยู่ ({jobs.length})</h2>
              </div>

              {jobs.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400 text-md border border-dashed border-gray-200">
                  ขณะนี้ยังไม่มีงานที่กำลังดำเนินการอยู่
                </div>
              ) : (
                <>
                  <div className="space-y-3 min-h-[400px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-3"
                      >
                        {currentJobs.map((job) => (
                          <div key={job.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-center transition-all hover:border-[#37101A]/20 shadow-sm">
                            <div>
                              <p className="font-bold text-sm">{job.trip?.name}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">นักท่องเที่ยว: {job.tourist?.name}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-lg border ${job.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                              {job.status === "pending" ? "รอยืนยัน" : "ยืนยันแล้ว"}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                      >
                        <i className="fa-solid fa-chevron-left text-xs"></i>
                      </button>

                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                            currentPage === index + 1
                              ? "bg-[#37101A] text-white shadow-md shadow-[#37101A]/20"
                              : "text-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                      >
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
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
      <p className="text-[14px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold">{value || "-"}</p>
    </div>
  </div>
);

export default GuideDetail;