import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle, MapPin, Camera } from "lucide-react";
import axios from "axios";

const TripEditModal = ({ trip, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (trip) {
      setFormData(trip);
    }
  }, [trip]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("price", formData.price);
      form.append("description", formData.description);
      form.append("guideId", formData.guideId);
      form.append("provinceId", formData.provinceId);
      if (formData.picture instanceof File) {
        form.append("picture", formData.picture);
      }

      await axios.put(`http://localhost:4000/trips/${trip.id}`, form, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setSuccess("อัปเดตข้อมูลสำเร็จ!");
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  if (!trip) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#37101A]">แก้ไขข้อมูลทริป</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertCircle size={20} className="text-red-600" />
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <CheckCircle size={20} className="text-emerald-600" />
                  <p className="text-sm font-semibold text-emerald-700">{success}</p>
                </div>
              )}

              <div className="flex flex-col items-center gap-4">
                <div 
                  className="relative group cursor-pointer" 
                  onClick={handlePictureClick}
                >
                  {formData.picture instanceof File ? (
                    <img
                      src={URL.createObjectURL(formData.picture)}
                      alt="preview"
                      className="w-48 h-32 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                    />
                  ) : trip.picture ? (
                    <img
                      src={`http://localhost:4000/images/${trip.picture}`}
                      alt={trip.name}
                      className="w-48 h-32 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-48 h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-[#37101A] border-2 border-slate-200">
                      <MapPin size={40} />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 rounded-2xl flex items-center justify-center transition-all">
                    <Camera className="text-white opacity-90 group-hover:scale-110 transition-transform" size={28} />
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  name="picture"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <p className="text-xs text-slate-400 font-medium">คลิกที่รูปเพื่อเปลี่ยนรูปภาพทริป</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ชื่อทริป</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37101A]/20 focus:border-[#37101A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ราคา (บาท)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37101A]/20 focus:border-[#37101A]"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">รายละเอียดทริป</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37101A]/20 focus:border-[#37101A]"
                  placeholder="เพิ่มรายละเอียดทริป เช่น สถานที่ท่องเที่ยว กิจกรรม..."
                />
              </div>
            </form>

            <div className="border-t border-slate-200 px-8 py-4 flex justify-end gap-3 bg-slate-50">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={(e) => handleSubmit(e)}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-[#37101A] text-white font-semibold hover:bg-[#4d1a26] transition-all disabled:opacity-50"
              >
                {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TripEditModal;