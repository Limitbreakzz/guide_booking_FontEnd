import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    tel: "",
    language: "",
    experience: "",
    role: "TOURIST",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = form.name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      alert("ชื่อควรมีความยาวระหว่าง 2 - 100 ตัวอักษร");
      return;
    }

    if (form.tel) {
      if (!/^0[0-9]{9}$/.test(form.tel)) {
        alert("กรุณากรอกเบอร์โทรให้ถูกต้อง (10 หลัก และขึ้นต้นด้วย 0)");
        return;
      }
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        ...form,
        name: trimmedName,
      });
      alert("สมัครสมาชิกสำเร็จ");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "สมัครไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FAF9F6] px-4 py-12 font-medium">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[500px] bg-white/80 backdrop-blur-xl p-10 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-white"
      >
        <div className="text-left mb-10">
          <h2 className="text-3xl font-medium text-[#37101A] tracking-tight">
            Register
          </h2>
          <p className="text-gray-400 text-sm mt-3 font-normal">
            สร้างบัญชีเพื่อเริ่มต้นประสบการณ์การเดินทางใหม่
          </p>
        </div>

        {/* Role Selector ในสไตล์พรีเมียม */}
        <div className="flex p-1 bg-[#FAF9F6] rounded-2xl mb-8 border border-gray-100">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "TOURIST" })}
            className={`flex-1 py-3 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all ${
              form.role === "TOURIST"
                ? "bg-white text-[#37101A] shadow-sm"
                : "text-gray-400"
            }`}
          >
            Tourist
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "GUIDE" })}
            className={`flex-1 py-3 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all ${
              form.role === "GUIDE"
                ? "bg-white text-[#37101A] shadow-sm"
                : "text-gray-400"
            }`}
          >
            Guide
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] text-gray-400 uppercase tracking-widest pl-1">
              Full Name
            </label>
            <input
              placeholder="ชื่อ-นามสกุลของคุณ"
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-1 focus:ring-[#FFC1CC] transition-all text-[#37101A] placeholder:text-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-gray-400 uppercase tracking-widest pl-1">
              Email
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-1 focus:ring-[#FFC1CC] transition-all text-[#37101A] placeholder:text-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] text-gray-400 uppercase tracking-widest pl-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                minLength={6}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-1 focus:ring-[#FFC1CC] transition-all text-[#37101A] placeholder:text-gray-300 shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] text-gray-400 uppercase tracking-widest pl-1">
                Tel
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="08XXXXXXXX"
                value={form.tel}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "");
                  if (onlyNumbers.length <= 10) {
                    setForm({ ...form, tel: onlyNumbers });
                  }
                }}
                className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-1 focus:ring-[#FFC1CC] transition-all text-[#37101A] placeholder:text-gray-300 shadow-sm"
                required
              />
            </div>
          </div>
          <AnimatePresence>
            {form.role === "GUIDE" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 overflow-hidden pt-2"
              >
                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest pl-1">
                    Language
                  </label>
                  <input
                    placeholder="ภาษาที่เชี่ยวชาญ (เช่น ไทย, English)"
                    onChange={(e) =>
                      setForm({ ...form, language: e.target.value })
                    }
                    className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-1 focus:ring-[#FFC1CC] transition-all text-[#37101A] shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 uppercase tracking-widest pl-1">
                    Experience
                  </label>
                  <textarea
                    placeholder="เล่าประสบการณ์ของคุณ..."
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-1 focus:ring-[#FFC1CC] transition-all text-[#37101A] shadow-sm resize-none"
                    rows="3"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            disabled={loading}
            className="w-full bg-[#37101A] text-white py-4 rounded-lg font-medium text-[14px] uppercase tracking-widest hover:bg-[#2A0C14] transition-all shadow-md mt-6 disabled:opacity-50"
          >
            {loading ? "กำลังบันทึกข้อมูล..." : "สร้างบัญชีสมาชิก"}
          </button>

          <div className="pt-4 text-center">
            <p className="text-[13px] text-gray-400 font-medium">
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                to="/login"
                className="text-[#37101A] hover:text-[#FFC1CC] transition-colors ml-1 underline underline-offset-4"
              >
                เข้าสู่ระบบที่นี่
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
