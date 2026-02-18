import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminGuides = () => {
  const [guides, setGuides] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const res = await axios.get("http://localhost:4000/guides");
      setGuides(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันการลบไกด์นี้?")) return;

    try {
      await axios.delete(`http://localhost:4000/guides/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGuides();
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
            จัดการไกด์
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3">ชื่อ</th>
                <th className="py-3">อีเมล</th>
                <th className="py-3">สถานะ</th>
                <th className="py-3 text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {guides.map((guide) => (
                <tr
                  key={guide.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-4 font-medium">{guide.name}</td>
                  <td className="py-4">{guide.email}</td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        guide.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {guide.status ? "พร้อมให้บริการ" : "ไม่พร้อม"}
                    </span>
                  </td>

                  <td className="py-4 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/guides/${guide.id}`)}
                      className="px-3 py-1 bg-gray-600 text-white rounded-lg"
                    >
                      ดู
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/guides/${guide.id}/edit`)
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                    >
                      แก้ไข
                    </button>

                    <button
                      onClick={() => handleDelete(guide.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {guides.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              ยังไม่มีข้อมูลไกด์
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminGuides;
