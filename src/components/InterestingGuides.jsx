import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InterestingGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/guides/top`);
      setGuides(res.data.data || []);
    } catch (err) {
      console.error("Error fetching top guides:", err);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">กำลังโหลดข้อมูล...</div>);
  }

  if (guides.length === 0) {
    return (
      <section className="mt-16 px-4 max-w-7xl mx-auto">
        <div className="py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          ไม่พบข้อมูลไกด์
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-2xl font-bold text-[#37101A]">
            ไกด์ยอดนิยม
          </h2>
          <p className="text-sm md:text-md text-gray-500 mt-1">
            ไกด์ที่นักท่องเที่ยวเลือกมากที่สุด
          </p>
        </div>
        <button
          onClick={() => navigate("/guides")}
          className="px-4 py-1.5 border border-[#FFC5D3] rounded-sm text-[#37101A] hover:bg-[#FFC5D3]/50 transition-all"
        >
          ดูทั้งหมด
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {guides.map((guide, index) => (
          <div
            key={guide.id}
            onClick={() => navigate(`/guides/${guide.id}`)}
            className="group relative rounded-xl overflow-hidden shadow-xl cursor-pointer bg-gray-100"
          >
            {guide.picture ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/images/${guide.picture}`}
                alt={guide.name}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-400">
                <span className="text-sm font-medium">ไม่มีรูปภาพ</span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute top-4 left-4 bg-[#FFC5D3] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              #{index + 1}
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="text-white flex-1 mr-4">
                <h3 className="text-xl font-semibold line-clamp-1">
                  {guide.name}
                </h3>

                <p className="text-sm opacity-80">
                  ภาษา: {guide.language || "ไม่มีข้อมูล"}
                </p>

                <p className="text-[10px] md:text-xs mt-2 inline-block bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                  ถูกจอง {guide?._count?.bookings ?? 0} ครั้ง
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/30 text-white text-xs px-3 py-2 rounded-xl group-hover:bg-[#FFC5D3] group-hover:text-[#37101A] group-hover:border-[#FFC5D3] transition-all duration-300">
                โปรไฟล์
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InterestingGuides;
