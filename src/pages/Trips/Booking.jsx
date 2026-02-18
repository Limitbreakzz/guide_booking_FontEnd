import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import BackButton from "../../components/BackButton";

const Booking = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [datetime, setDatetime] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/trips/${tripId}`)
      .then((res) => setTrip(res.data.data))
      .catch(() => alert("โหลดข้อมูลทริปไม่สำเร็จ"));
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datetime) {
      alert("กรุณาเลือกวันและเวลา");
      return;
    }

    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนจอง");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:4000/bookings",
        {
          tripId: Number(tripId),
          datetime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("จองทริปสำเร็จ");
      navigate("/trips");
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการจอง");
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return (
      <div className="py-20 text-center">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-[#37101A]"></i>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#F8F3F4] to-[#EFE6E8] min-h-screen py-24 px-6">

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-[#37101A] mb-6 text-center flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-calendar-check"></i>
          จองทริป
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#F9F9F9] rounded-xl p-5 mb-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-map-location-dot text-[#37101A]"></i>
            <p>
              <span className="font-semibold text-[#37101A]">ทริป:</span>{" "}
              {trip.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <i className="fa-solid fa-user-tie text-[#37101A]"></i>
            <p>
              <span className="font-semibold text-[#37101A]">ไกด์:</span>{" "}
              {trip.guide?.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <i className="fa-solid fa-baht-sign text-[#37101A]"></i>
            <p>
              <span className="font-semibold text-[#37101A]">ราคา:</span>{" "}
              {trip.price?.toLocaleString()} บาท
            </p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-clock text-[#37101A]"></i>
              เลือกวันและเวลา
            </label>

            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 
                         focus:outline-none focus:ring-2 focus:ring-[#37101A]
                         focus:border-[#37101A] transition"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full py-3 bg-[#37101A] text-white rounded-xl 
                       hover:bg-[#2A0C14] transition duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                กำลังจอง...
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i>
                ยืนยันการจอง
              </>
            )}
          </motion.button>

          <div className="pt-4">
            <BackButton label="ย้อนกลับ" />
          </div>

        </motion.form>

      </motion.div>
    </div>
  );
};

export default Booking;
