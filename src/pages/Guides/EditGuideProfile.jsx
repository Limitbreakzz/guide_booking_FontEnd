import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import BackButton from "../../components/BackButton";

const EditGuideProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    tel: "",
    language: "",
    experience: "",
    picture: null,
    status: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/guides/${id}`);
        const data = res.data.data;
        setForm({
          name: data.name || "",
          email: data.email || "",
          tel: data.tel || "",
          language: data.language || "",
          experience: data.experience || "",
          picture: null,
          status: Boolean(data.status),
        });
        if (data.picture) setPreview(`http://localhost:4000/images/${data.picture}`);
      } catch {
        alert("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, picture: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'picture' && !form[key]) return;
        formData.append(key, form[key]);
      });

      await axios.put(`http://localhost:4000/guides/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/guides/${id}`);
    } catch {
      alert("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="w-10 h-10 border-4 border-[#37101A]/20 border-t-[#37101A] rounded-lg animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-6 px-4 font-medium text-[#37101A]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto" // ลดขนาดจาก xl เป็น md
      >
        <div className="flex justify-between items-center mb-4 px-1">
          <BackButton label="ย้อนกลับ" />
          <h1 className="text-xl font-black tracking-tighter">แก้ไขข้อมูลไกด์</h1>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          {/* Header & Photo (Compact Height) */}
          <div className="relative h-20 bg-[#37101A]">
            <div 
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 group cursor-pointer z-10"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="relative">
                <img
                  src={preview || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                  className="w-24 h-24 rounded-2xl object-cover border-[4px] border-white shadow-md bg-white transition-all group-hover:scale-105"
                  alt="Profile"
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fa-solid fa-camera text-white text-lg"></i>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="pt-12 pb-8 px-6">
            <form onSubmit={handleSubmit} className="space-y-4"> {/* ลดระยะห่างระหว่างช่อง */}
              
              {/* Dropdown เปลี่ยนสถานะ (Compact) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold tracking-tight px-1 flex items-center gap-2">
                  <i className="fa-solid fa-circle-dot text-[10px] opacity-30"></i>
                  สถานะการรับงาน
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <div className={`w-2.5 h-2.5 rounded-full ${form.status ? "bg-emerald-500 shadow-sm" : "bg-rose-500"}`}></div>
                  </div>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value === "true" })}
                    className="w-full border border-gray-100 rounded-xl bg-gray-50/50 pl-9 pr-4 py-2 focus:border-[#37101A] focus:bg-white outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="true">พร้อมรับงาน</option>
                    <option value="false">งดรับงาน</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-xs">
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                </div>
              </div>

              <InputGroup 
                label="ชื่อ-นามสกุล" 
                icon="fa-user" 
                value={form.name} 
                onChange={(v) => setForm({...form, name: v})} 
                placeholder="ชื่อ-นามสกุล"
              />

              <InputGroup 
                label="อีเมล" 
                icon="fa-envelope" 
                type="email" 
                value={form.email} 
                onChange={(v) => setForm({...form, email: v})} 
                placeholder="email@example.com"
              />

              {/* Grid แบบกะทัดรัด */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup 
                  label="เบอร์โทรศัพท์" 
                  icon="fa-phone" 
                  value={form.tel} 
                  onChange={(v) => setForm({...form, tel: v})} 
                  placeholder="08X-XXX-XXXX"
                />
                <InputGroup 
                  label="ภาษา" 
                  icon="fa-language" 
                  value={form.language} 
                  onChange={(v) => setForm({...form, language: v})} 
                  placeholder="ไทย, อังกฤษ..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold tracking-tight px-1">ประวัติและประสบการณ์</label>
                <textarea
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="อธิบายประสบการณ์..."
                  className="w-full border border-gray-100 bg-gray-50/50 rounded-xl px-4 py-2.5 min-h-[100px] focus:border-[#37101A] focus:bg-white outline-none transition-all text-sm font-bold resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  disabled={saving}
                  className="w-full py-3.5 bg-[#37101A] text-white rounded-xl font-black text-base shadow-md hover:bg-[#2A0C14] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                  ) : (
                    <i className="fa-solid fa-check text-sm"></i>
                  )}
                  <span>{saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InputGroup = ({ label, icon, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1.5 group">
    <label className="text-sm font-bold tracking-tight px-1 group-focus-within:text-[#37101A] transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#37101A]/20 group-focus-within:text-[#37101A] transition-colors">
        <i className={`fa-solid ${icon} text-sm`}></i>
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-100 rounded-xl bg-gray-50/50 pl-10 pr-4 py-2.5 focus:border-[#37101A] focus:bg-white outline-none transition-all text-sm font-bold"
      />
    </div>
  </div>
);

export default EditGuideProfile;