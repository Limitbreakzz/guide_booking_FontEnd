import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminTourists = () => {
  const [tourists, setTourists] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTourists();
  }, []);

  const fetchTourists = async () => {
    try {
      const res = await axios.get("http://localhost:4000/tourists");
      setTourists(res.data.data);
    } catch (err) {
      console.error("Error fetching tourists:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันการลบนักท่องเที่ยวนี้?")) return;

    try {
      await axios.delete(`http://localhost:4000/tourists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTourists();
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
          <h1 className="text-2xl font-bold text-gray-800">
            จัดการนักท่องเที่ยว
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">ชื่อ</th>
                <th className="py-3">อีเมล</th>
                <th className="py-3">เบอร์โทร</th>
                <th className="py-3 text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {tourists.map((tourist) => (
                <tr
                  key={tourist.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-4 font-medium text-gray-800">
                    {tourist.name}
                  </td>

                  <td className="py-4 text-gray-600">
                    {tourist.email}
                  </td>

                  <td className="py-4 text-gray-600">
                    {tourist.tel || "-"}
                  </td>

                  <td className="py-4 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/tourist/${tourist.id}`)}
                      className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                      ดู
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/tourist/${tourist.id}/edit`)
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      แก้ไข
                    </button>

                    <button
                      onClick={() => handleDelete(tourist.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tourists.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              ยังไม่มีข้อมูลนักท่องเที่ยว
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminTourists;
