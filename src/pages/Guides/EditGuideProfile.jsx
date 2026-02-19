import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import BackButton from "../../components/BackButton";

const EditGuideProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/guides/${id}`,
        );
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

        if (data.picture) {
          setPreview(`${import.meta.env.VITE_API_URL}/images/${data.picture}`);
        }
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

    const trimmedName = form.name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      alert("ชื่อควรมีความยาวระหว่าง 2 - 100 ตัวอักษร");
      return;
    }

    if (!/^[A-Za-zก-ฮะ-์\s]+$/.test(trimmedName)) {
      alert("ชื่อห้ามมีตัวเลขหรืออักขระพิเศษ");
      return;
    }

    if (!/^0[0-9]{9}$/.test(form.tel)) {
      alert("กรุณากรอกเบอร์โทรให้ถูกต้อง (10 หลัก และขึ้นต้นด้วย 0)");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("email", form.email);
      formData.append("tel", form.tel);
      formData.append("language", form.language);
      formData.append("experience", form.experience);
      formData.append("status", form.status);

      if (form.picture) {
        formData.append("picture", form.picture);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/guides/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate(`/guides/${id}`);
    } catch {
      alert("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-10 h-10 border-4 border-[#37101A]/20 border-t-[#37101A] rounded-lg animate-spin"></div>
      </div>
    );

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-6 px-4 font-medium text-[#37101A]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="flex justify-between items-center mb-4 px-1">
          <BackButton label="ย้อนกลับ" />
          <h1 className="text-xl font-black tracking-tighter">
            แก้ไขข้อมูลไกด์
          </h1>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="relative h-20 bg-[#37101A]">
            <div
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 group cursor-pointer z-10"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={
                  preview ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                className="w-24 h-24 rounded-2xl object-cover border-[4px] border-white shadow-md bg-white"
                alt="Profile"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          <div className="pt-12 pb-8 px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputGroup
                label="ชื่อ-นามสกุล"
                icon="fa-user"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="ชื่อ-นามสกุล"
                maxLength={100}
              />

              <InputGroup
                label="อีเมล"
                icon="fa-envelope"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="email@example.com"
              />

              <InputGroup
                label="ภาษาที่ถนัด"
                icon="fa-language"
                value={form.language}
                onChange={(v) => setForm({ ...form, language: v })}
                placeholder="เช่น ไทย, อังกฤษ"
              />

              <InputGroup
                label="ประสบการณ์"
                icon="fa-briefcase"
                value={form.experience}
                onChange={(v) => setForm({ ...form, experience: v })}
                placeholder="เช่น 3 ปี"
              />
              
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <span className="text-sm font-bold">สถานะการให้บริการ</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: !form.status })}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    form.status
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {form.status ? "พร้อมให้บริการ" : "ไม่พร้อม"}
                </button>
              </div>

              <InputGroup
                label="เบอร์โทรศัพท์"
                icon="fa-phone"
                value={form.tel}
                onChange={(v) => setForm({ ...form, tel: v })}
                placeholder="08XXXXXXXX"
              />

              <button
                disabled={saving}
                className="w-full py-3.5 bg-[#37101A] text-white rounded-xl font-black text-base shadow-md hover:bg-[#2A0C14] transition-all"
              >
                {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InputGroup = ({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
}) => {
  const isTel = label === "เบอร์โทรศัพท์";
  const isName = label === "ชื่อ-นามสกุล";

  const handleChange = (e) => {
    let val = e.target.value;

    if (isTel) {
      val = val.replace(/[^0-9]/g, "");
      if (val.length > 10) return;
    }

    if (isName && val.length > 100) return;

    onChange(val);
  };

  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="text-sm font-bold px-1">{label}</label>

      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#37101A]/20">
          <i className={`fa-solid ${icon} text-sm`}></i>
        </div>

        <input
          type={isTel ? "tel" : type}
          inputMode={isTel ? "numeric" : undefined}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (isTel && ["e", "E", "+", "-", "."].includes(e.key)) {
              e.preventDefault();
            }
          }}
          className="w-full border border-gray-100 rounded-xl bg-gray-50/50 pl-10 pr-4 py-2.5 focus:border-[#37101A] focus:bg-white outline-none transition-all text-sm font-bold"
        />
      </div>

      {isTel && value.length > 0 && value.length !== 10 && (
        <p className="text-xs text-rose-500 px-1">เบอร์โทรต้องมี 10 หลัก</p>
      )}

      {isName && value.trim().length > 0 && value.trim().length < 2 && (
        <p className="text-xs text-rose-500 px-1">
          ชื่อต้องมีอย่างน้อย 2 ตัวอักษร
        </p>
      )}
    </div>
  );
};

export default EditGuideProfile;
