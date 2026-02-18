import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Info,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
} from "react-feather";
import axios from "axios";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 100 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const Contact = () => {
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    message: "",
    error: false,
  });
  const [activeTab, setActiveTab] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!token) {
      setFormStatus({
        submitted: true,
        message: "กรุณาเข้าสู่ระบบก่อนส่งข้อความ",
        error: true,
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
        error: true,
      });
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitted: true,
        message: "รูปแบบอีเมลไม่ถูกต้อง",
        error: true,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:4000/contact",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFormStatus({
        submitted: true,
        message: response.data.message,
        error: false,
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setFormStatus({
          submitted: false,
          message: "",
          error: false,
        });
      }, 3000);
    } catch (error) {
      setFormStatus({
        submitted: true,
        message: error.response?.data?.message || "เกิดข้อผิดพลาด",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      id: "address",
      icon: MapPin,
      title: "ที่อยู่",
      content: "90 ถนน เทศา ต.พระปฐมเจดีย์ อ.เมือง นครปฐม 73000",
    },
    {
      id: "phone",
      icon: Phone,
      title: "โทรศัพท์",
      content: "034-252-790, 034-241-853",
    },
    { id: "email", icon: Mail, title: "อีเมล", content: "companygowithguide@gmail.com" },
    {
      id: "hours",
      icon: Clock,
      title: "เวลาทำการ",
      content: "จันทร์ - ศุกร์: 9:00 - 18:00 น.",
    },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen w-full px-6 py-20 flex flex-col items-center pt-32 text-[#37101A]">
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#FFC1CC] blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#37101A] blur-[100px]"
        />
      </div>

      <div className="max-w-5xl w-full mx-auto">
        <div className="text-center mb-16">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="inline-block px-4 py-1.5 bg-[#FFC1CC]/20 rounded-lg text-[10px] font-bold uppercase tracking-[0.3em] text-[#37101A] mb-4"
          >
            ติดต่อเรา
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold tracking-tight mb-6"
          >
            ร่วมเดินทางไปกับเรา
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-normal text-lg max-w-xl mx-auto"
          >
            มีคำถามหรือข้อสงสัยเกี่ยวกับทริป?
            ทีมงานของเราพร้อมดูแลคุณอย่างใกล้ชิด
          </motion.p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-white/50 backdrop-blur-md rounded-lg border border-gray-100 shadow-sm relative">
            {["form", "info"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-[#37101A]"
                }`}
              >
                {tab === "form" ? <Send size={14} /> : <Info size={14} />}
                {tab === "form" ? "ส่งข้อความ" : "ข้อมูลติดต่อ"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#37101A] rounded-lg -z-10 shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[550px]">
          <AnimatePresence mode="wait">
            {activeTab === "form" ? (
              <motion.div
                key="form-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <motion.div
                  layout
                  className="lg:col-span-7 bg-white/80 backdrop-blur-xl rounded-lg p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white"
                >
                  <h2 className="text-2xl font-bold mb-8">ส่งข้อความหาเรา</h2>
                  <AnimatePresence>
                    {formStatus.submitted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-lg mb-8 flex items-center gap-3 text-sm font-bold overflow-hidden ${
                          formStatus.error
                            ? "bg-red-50 text-red-600"
                            : "bg-[#FFC1CC]/20 text-[#37101A]"
                        }`}
                      >
                        {!formStatus.error && <CheckCircle size={18} />}
                        {formStatus.message}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="ชื่อ"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="ชื่อ-นามสกุล"
                      />
                      <InputField
                        label="อีเมล"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@mail.com"
                      />
                    </div>
                    <InputField
                      label="หัวข้อ"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="หัวข้อติดต่อ"
                    />
                    <div className="space-y-2">
                      <label className="text-[14px] text-gray-400 uppercase tracking-[0.2em] font-bold pl-1">
                        ข้อความ
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-5 py-4 bg-[#FAF9F6] border border-gray-100 rounded-lg focus:border-[#FFC1CC] focus:bg-white outline-none transition-all duration-300 font-medium resize-none shadow-sm text-sm"
                        placeholder="รายละเอียดที่ต้องการสอบถาม..."
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.03, y: -2 } : {}}
                      whileTap={!loading ? { scale: 0.97 } : {}}
                      className={`w-full py-4 text-white font-medium rounded-lg mt-6 transition-all text-sm uppercase tracking-widest
                                  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#37101A] hover:bg-[#2A0C14]"}`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          กำลังส่ง...
                        </span>
                      ) : (
                        "ส่งข้อความ"
                      )}
                    </motion.button>
                  </form>
                </motion.div>

                <motion.div
                  layout
                  className="lg:col-span-5 bg-white/80 backdrop-blur-xl rounded-lg p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white h-fit transition-all hover:shadow-[0_30px_60px_rgba(55,16,26,0.08)]"
                >
                  <h2 className="text-xl font-bold mb-2">ตำแหน่งที่ตั้ง</h2>
                  <p className="text-gray-400 text-sm mb-6 font-normal tracking-wide">
                    แวะเข้ามาทักทายเราได้ที่ออฟฟิศ
                  </p>
                  <div className="w-full h-[320px] rounded-lg overflow-hidden border border-gray-50 shadow-inner group relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5615748896013!2d100.0592!3d13.8197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2e5e1c0c0c0c0%3A0xc0c0c0c0c0c0c0c!2z4Lie4Lij4Liw4Lib4Li04LiU4LiI4Lij4Li14Lii4LmMIOC4reC4reC4o-C4reC4p-C4seC4leC4nuC4o-C4seC4hA!5e0!3m2!1sth!2sth!4v1700000000000"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      title="แผนที่"
                    />
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="info-tab"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  animate: { transition: { staggerChildren: 0.1 } },
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {contactInfo.map((info) => (
                  <motion.div
                    key={info.id}
                    variants={fadeInUp}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="p-8 bg-white/80 backdrop-blur-xl rounded-lg border border-white hover:border-[#FFC1CC] shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all group"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-[#FAF9F6] rounded-lg flex items-center justify-center text-[#37101A] group-hover:bg-[#37101A] group-hover:text-white transition-all duration-500 shadow-sm">
                        <info.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                          {info.title}
                        </h3>
                        <p className="text-lg font-bold leading-relaxed">
                          {info.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold pl-1 group-focus-within:text-[#37101A] transition-colors duration-300">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-5 py-4 bg-[#FAF9F6] border border-gray-100 rounded-lg focus:border-[#FFC1CC] focus:bg-white outline-none transition-all duration-300 font-medium shadow-sm text-sm text-[#37101A]"
    />
  </div>
);

export default Contact;
