import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("name", user.name);

      if (user.role === "ADMIN") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
    } catch (err) {
      alert(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FAF9F6] px-4 font-medium">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-white"
      >
        <div className="text-left mb-12">
          <h2 className="text-3xl font-medium text-[#37101A] tracking-tight">
            Sign In
          </h2>
          <p className="text-gray-400 text-sm mt-3 font-normal">
            ยินดีต้อนรับกลับมา เลือกการเดินทางครั้งใหม่ของคุณ
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] text-gray-400 uppercase tracking-widest pl-1">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-1 focus:ring-[#FFC1CC] transition-all text-[#37101A] placeholder:text-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] text-gray-400 uppercase tracking-widest">Password</label>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-lg outline-none focus:border-[#FFC1CC] focus:ring-1 focus:ring-[#FFC1CC] transition-all text-[#37101A] placeholder:text-gray-300 shadow-sm"
              required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#37101A] text-white py-4 rounded-lg font-medium text-[14px] uppercase tracking-widest hover:bg-[#2A0C14] transition-all shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>

          <div className="pt-2 text-center">
            <p className="text-[13px] text-gray-400 font-medium">
              ยังไม่มีบัญชีสมาชิก?{" "}
              <Link
                to="/register"
                className="text-[#37101A] hover:text-[#FFC1CC] transition-colors ml-1 underline underline-offset-4"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;