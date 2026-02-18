import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Select from "react-select";
import BackButton from "../../components/BackButton";

const CreateTrip = () => {
  const [form, setForm] = useState({
    name: "",
    provinceId: "",
    price: "",
    description: "",
    picture: null,
  });

  const [preview, setPreview] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/provinces`);
      setProvinces(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("โหลดข้อมูลจังหวัดไม่สำเร็จ", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, picture: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("provinceId", form.provinceId);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("guideId", localStorage.getItem("userId"));
      if (form.picture) formData.append("picture", form.picture);

      await axios.post("http://localhost:4000/trips", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("สร้างทริปใหม่เรียบร้อยแล้ว!");
      navigate("/trips");
    } catch (err) {
      console.error(err);
      alert("เพิ่มไม่สำเร็จ: " + (err.response?.data?.message || "กรุณาลองใหม่"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 px-4 font-medium">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-10">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#37101A] rounded-xl flex items-center justify-center shadow-md">
                <i className="fa-solid fa-map-location-dot  text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-[#37101A]">สร้างทริปใหม่</h2>
            </div>
            <BackButton label="กลับ" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group w-full aspect-video rounded-xl overflow-hidden bg-gray-50 border border-dashed border-gray-200 transition-all cursor-pointer">
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <i className="fa-solid fa-camera-rotate text-white text-3xl"></i>
                        <span className="text-white text-sm font-medium">เปลี่ยนรูปภาพ</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                  <i className="fa-solid fa-image text-5xl text-gray-200"></i>
                  <span className="text-xs font-medium uppercase tracking-wider">คลิกเพิ่มรูปภาพหน้าปก</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-widest flex items-center gap-3">
                  <i className="fa-solid fa-pen text-[#37101A] text-lg"></i>
                  ชื่อทริป
                </label>
                <input
                  required
                  placeholder="ระบุชื่อทริป..."
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg outline-none focus:border-[#37101A] transition-all text-[#37101A]"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-widest flex items-center gap-3">
                    <i className="fa-solid fa-location-dot text-[#37101A] text-lg"></i>
                    จังหวัด
                  </label>
                  <Select
                    options={provinces.map((p) => ({ value: p.id, label: p.name }))}
                    placeholder="เลือกจังหวัด..."
                    onChange={(selected) => setForm({ ...form, provinceId: selected.value })}
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '0.5rem',
                        borderColor: '#E5E7EB',
                        padding: '2px',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#37101A' }
                      }),
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-widest flex items-center gap-3">
                    <i className="fa-solid fa-baht-sign text-[#37101A] text-lg"></i>
                    ราคา
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    className="w-full bg-white border border-gray-200 px-4 py-[9px] rounded-lg outline-none focus:border-[#37101A] transition-all text-[#37101A] font-bold"
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-widest flex items-center gap-3">
                  <i className="fa-solid fa-align-left text-[#37101A] text-lg"></i>
                  รายละเอียด
                </label>
                <textarea
                  rows="5"
                  required
                  placeholder="เขียนบรรยายทริปสั้นๆ..."
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg outline-none focus:border-[#37101A] transition-all text-[#37101A] text-sm leading-relaxed"
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                disabled={loading}
                className="w-full bg-[#37101A] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#2A0C14] transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <i className="fa-solid fa-check text-xl transition-transform group-hover:scale-125"></i>
                    <span>บันทึกข้อมูลทริป</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateTrip;