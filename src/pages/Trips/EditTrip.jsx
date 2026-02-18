import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../components/BackButton";
import { motion } from "framer-motion";

const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/trips/${id}`);
      const data = res.data.data;

      if (role !== "GUIDE" || Number(userId) !== data.guideId) {
        alert("คุณไม่มีสิทธิ์แก้ไขทริปนี้");
        navigate("/trips");
        return;
      }

      setTrip({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        provinceId: data.provinceId || "",
        isActive: data.isActive,
        picture: null,
        pictureUrl: data.picture || "",
      });
    } catch (err) {
      console.error(err);
      alert("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", trip.name);
      formData.append("description", trip.description);
      formData.append("price", trip.price);
      formData.append("provinceId", trip.provinceId);
      formData.append("isActive", trip.isActive);

      if (trip.picture) {
        formData.append("picture", trip.picture);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/trips/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("แก้ไขทริปเรียบร้อย");
      navigate(`/trips/${id}`);
    } catch (err) {
      console.error(err);
      alert("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-gray-400 animate-pulse font-bold text-lg">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 md:px-6 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="p-8 pb-6 flex items-center relative">
            <div className="absolute left-8">
              <BackButton label="ย้อนกลับ" />
            </div>
            <h1 className="text-xl font-black text-[#37101A] w-full text-center uppercase tracking-tight">
              แก้ไขข้อมูลทริป
            </h1>
          </div>

          <div className="px-8 md:px-12 pb-12">
            <form onSubmit={handleSubmit} className="space-y-7">

              <div className="flex flex-col items-center">
                <div className="relative group w-full aspect-video overflow-hidden rounded-2xl bg-gray-100 border-4 border-white shadow-xl">
                  <img
                    src={
                      trip.picture
                        ? URL.createObjectURL(trip.picture)
                        : trip.pictureUrl
                          ? `${import.meta.env.VITE_API_URL}/images/${trip.pictureUrl}`
                          : "https://via.placeholder.com/600x400"
                    }
                    alt="trip preview"
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white font-bold text-xs bg-black/40 px-5 py-2 rounded-full backdrop-blur-md border border-white/20">
                      พรีวิวรูปภาพ
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[14px] font-medium text-gray-400 uppercase">
                  ภาพหน้าปกทริปของคุณ
                </p>
              </div>

              <div className="grid grid-cols-1 gap-7">
                <div className="relative">
                  <label className="absolute -top-3 left-6 bg-white px-2 text-[14px] font-medium text-gray-400 uppercase z-10">
                    ชื่อทริป
                  </label>
                  <input
                    required
                    value={trip.name}
                    onChange={(e) => setTrip({ ...trip, name: e.target.value })}
                    className="w-full px-6 py-4 border border-gray-100 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-4 focus:ring-[#FFC1CC]/10 transition-all text-[#37101A] font-medium"
                  />
                </div>

                <div className="relative">
                  <label className="absolute -top-3 left-6 bg-white px-2 text-[14px] font-medium text-gray-400 uppercase z-10">
                    คำอธิบายทริป
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={trip.description}
                    onChange={(e) => setTrip({ ...trip, description: e.target.value })}
                    placeholder="บอกเล่ารายละเอียดความสนุกของทริปนี้..."
                    className="w-full px-6 py-4 border border-gray-100 rounded-2xl outline-none focus:border-[#FFC1CC] focus:ring-4 focus:ring-[#FFC1CC]/10 transition-all text-[#37101A] font-medium resize-y min-h-[120px] leading-relaxed"
                  />
                  <div className="absolute bottom-2 right-2 pointer-events-none opacity-20">
                    <i className="fa-solid fa-grip-lines-vertical rotate-45 text-[10px]"></i>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="relative">
                    <label className="absolute -top-3 left-6 bg-white px-2 text-[14px] font-medium text-gray-400 uppercase z-10">
                      ราคา (บาท)
                    </label>
                    <input
                      required
                      type="number"
                      value={trip.price}
                      onChange={(e) => setTrip({ ...trip, price: e.target.value })}
                      className="w-full px-6 py-4 border border-gray-100 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-4 focus:ring-[#FFC1CC]/10 transition-all text-[#37101A] font-bold"
                    />
                  </div>

                  <div className="relative">
                    <label className="absolute -top-3 left-6 bg-white px-2 text-[14px] font-medium text-gray-400 uppercase z-10">
                      สถานะการจอง
                    </label>

                    <div className="relative flex items-center">
                      <div className="absolute left-5 z-10 flex items-center">
                        <div className={`w-2 h-2 rounded-full ${trip.isActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                      </div>

                      <select
                        value={trip.isActive}
                        onChange={(e) => setTrip({ ...trip, isActive: e.target.value === "true" })}
                        className="w-full pl-10 pr-10 py-4 border border-gray-100 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-4 focus:ring-[#FFC1CC]/10 transition-all text-[#37101A] font-bold appearance-none bg-white cursor-pointer shadow-sm hover:border-gray-200"
                      >
                        <option
                          value="true"
                          className="text-green-600 bg-white font-medium py-2"
                        >
                          เปิดให้บริการ
                        </option>
                        <option
                          value="false"
                          className="text-red-500 bg-white font-medium py-2"
                        >
                          ปิดให้บริการชั่วคราว
                        </option>
                      </select>

                      <div className="absolute right-6 pointer-events-none text-gray-400 text-[10px]">
                        <i className="fa-solid fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="absolute -top-3 left-6 bg-white px-2 text-[14px] font-medium text-gray-400 uppercase z-10">
                    เปลี่ยนรูปภาพใหม่
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTrip({ ...trip, picture: e.target.files[0] })}
                    className="w-full px-6 py-4 border border-gray-100 rounded-lg outline-none focus:border-[#FFC1CC] transition-all text-[#37101A] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[14px] file:font-medium file:bg-[#37101A] file:text-white hover:file:bg-black file:cursor-pointer file:uppercase"
                  />
                </div>
              </div>

              <button
                disabled={saving}
                className={`w-full py-5 rounded-lg font-bold text-sm uppercase tracking-[0.25em] transition-all shadow-lg ${saving
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#37101A] text-white hover:shadow-2xl hover:shadow-[#37101A]/20"
                  }`}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-3">

                    กำลังบันทึกข้อมูล
                  </span>
                ) : (
                  "บันทึกการแก้ไข"
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditTrip;