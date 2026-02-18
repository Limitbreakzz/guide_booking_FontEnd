import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InterestingGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopGuides();
  }, []);

  const fetchTopGuides = async () => {
    try {
      setLoading(true);
      // เรียงลำดับจาก rating มากไปน้อย (desc)
      const res = await axios.get("http://localhost:4000/guides", {
        params: { sort: "rating:desc", limit: 3 }
      });
      if (res.data && res.data.data) {
        setGuides(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching guides from DB:", err);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="flex flex-col items-center mb-12">
      <div className="w-14 h-14 bg-[#FFC1CC]/20 rounded-2xl flex items-center justify-center mb-4 shadow-inner relative">
        <i className="fa-solid fa-crown text-[#37101A] text-2xl"></i>
      </div>
      <h2 className="text-3xl font-bold text-[#37101A]">การจัดอันดับไกด์ที่ดีที่สุด</h2>

    </div>
  );

  if (loading) {
    return <div className="py-20 text-center text-gray-400">กำลังจัดอันดับไกด์...</div>;
  }

  return (
    <section className="mt-20 px-4 max-w-7xl mx-auto mb-20">
      {renderHeader()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide, index) => (
          <div
            key={guide.id}
            onClick={() => navigate(`/guides/${guide.id}`)}
            className="group flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-[220px] cursor-pointer relative"
          >

            <div className="w-[40%] h-full bg-gray-100 overflow-hidden flex-shrink-0">
              {guide.picture ? (
                <img
                  src={`http://localhost:4000/images/${guide.picture}`}
                  alt={guide.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <i className="fa-solid fa-user-tie text-gray-300 text-2xl"></i>
                </div>
              )}
            </div>

            <div className="w-[60%] p-4 flex flex-col min-w-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {index === 0}
                  <h3 className="font-bold text-lg text-[#37101A] leading-tight line-clamp-1 break-words">
                    {guide.name}
                  </h3>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-[12px] text-gray-500">
                    <div className="w-5 flex-shrink-0 flex justify-center mr-2">
                      <i className="fa-solid fa-earth-americas text-[#FFC1CC]"></i>
                    </div>
                    <span className="truncate block">{guide.language || "ไม่มีข้อมูล"}</span>
                  </div>

                  <div className="flex items-center text-[12px] text-gray-500">
                    <div className="w-5 flex-shrink-0 flex justify-center mr-2">
                      <i className="fa-solid fa-briefcase text-[#FFC1CC]"></i>
                    </div>
                    <span className="truncate block">ประสบการณ์ {guide.experience || "ไม่มีข้อมูล"}</span>
                  </div>
                </div>
              </div>

              <div className="w-full py-2 bg-[#FFC1CC]/30 group-hover:bg-[#FFC1CC] text-[#37101A] text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                ดูโปรไฟล์ไกด์
                <i className="fa-solid fa-circle-arrow-right"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InterestingGuides;