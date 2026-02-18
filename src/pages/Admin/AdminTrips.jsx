import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";


const AdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get("http://localhost:4000/trips");
      setTrips(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันการลบทริปนี้?")) return;

    try {
      await axios.delete(`http://localhost:4000/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrips();
    } catch (err) {
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 py-12 px-6"
    >
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">จัดการทริป</h1>

          <button
            onClick={() => navigate("/create-trip")}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            + เพิ่มทริป
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">ชื่อทริป</th>
                <th className="py-3">ไกด์</th>
                <th className="py-3">ราคา</th>
                <th className="py-3 text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {trips.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-4 font-medium">{trip.name}</td>
                  <td className="py-4">{trip.guide?.name || "-"}</td>
                  <td className="py-4 font-semibold">
                    {Number(trip.price).toLocaleString()} บาท
                  </td>

                  <td className="py-4 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/trips/${trip.id}`)}
                      className="px-3 py-1 bg-gray-600 text-white rounded-lg"
                    >
                      ดู
                    </button>

                    <button
                      onClick={() => navigate(`/admin/trips/${trip.id}/edit`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                    >
                      แก้ไข
                    </button>

                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {trips.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              ยังไม่มีข้อมูลทริป
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminTrips;
