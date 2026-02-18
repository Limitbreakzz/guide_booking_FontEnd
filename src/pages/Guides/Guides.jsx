import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const navigate = useNavigate();

  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true);

      const url = keyword.trim()
        ? `http://localhost:4000/guides/q/${encodeURIComponent(keyword)}`
        : `http://localhost:4000/guides`;

      const res = await axios.get(url);
      setGuides(res.data.data);
      setVisibleCount(4);
    } catch (error) {
      console.error(error);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <section className="mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex gap-4 items-center">
            <div className="flex-1 relative">
              <label className="absolute -top-3 left-6 bg-white px-2 text-[12px] font-medium text-gray-400 uppercase">
                ค้นหาไกด์
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="ชื่อไกด์ / ภาษา"
                className="w-full px-6 py-4 border rounded-lg outline-none focus:border-[#FFC1CC] transition-all text-[#37101A] font-medium placeholder:text-gray-300"
              />
            </div>

            <button
              onClick={fetchGuides}
              className="w-14 h-14 bg-[#FFC1CC] text-[#37101A] rounded-xl hover:bg-[#ffabbb] transition-all flex items-center justify-center shadow-lg shadow-[#FFC1CC]/20"
            >
              <i className="fa-solid fa-magnifying-glass text-xl"></i>
            </button>
          </div>
        </section>

        {/* COUNT */}
        <div className="flex justify-between items-center mb-8 px-2">
          <h2 className="text-base font-medium text-gray-600">
            แสดง{" "}
            <span className="text-[#37101A] font-bold">
              {Math.min(visibleCount, guides.length)}
            </span>{" "}
            จาก{" "}
            <span className="text-[#FFC1CC] font-bold">
              {guides.length} ไกด์
            </span>
          </h2>
        </div>

        {/* LIST */}
        <section className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-gray-400 animate-pulse font-bold">
              กำลังดึงข้อมูล...
            </div>
          ) : (
            <>
              {guides.slice(0, visibleCount).map((guide, idx) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row h-auto md:h-[220px] group transition-all hover:shadow-xl"
                >
                  {/* IMAGE */}
                  <div className="w-full md:w-[30%] h-56 md:h-full relative overflow-hidden bg-gray-100 flex-shrink-0">
                    {guide.picture ? (
                      <img
                        src={`http://localhost:4000/images/${guide.picture}`}
                        alt={guide.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-[#37101A] mb-2">
                          {guide.name}
                        </h3>

                        <div className="flex flex-col gap-2 text-gray-500 text-sm">
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-language text-[#37101A]"></i>
                            <span>{guide.language || "ไม่ระบุภาษา"}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-briefcase text-[#37101A]"></i>
                            <span>
                              {guide.experience || "ไม่ระบุประสบการณ์"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-phone text-[#37101A]"></i>
                            <span>{guide.tel || "-"}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-bold ${
                            guide.status
                              ? "bg-green-500/80 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {guide.status
                            ? "พร้อมให้บริการ"
                            : "ไม่พร้อมให้บริการ"}
                        </span>
                      </div>
                    </div>

                    {/*  BUTTON  */}
                    <div className="mt-4">
                      <button
                        onClick={() => navigate(`/guides/${guide.id}`)}
                        className="w-full py-3 font-medium rounded-lg transition-all text-md bg-[#FFC1CC]/40 text-[#37101A] hover:bg-[#FFC1CC]"
                      >
                        ดูโปรไฟล์ไกด์
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {visibleCount < guides.length && (
                <button
                  onClick={handleLoadMore}
                  className="w-full py-4 bg-[#37101A] text-white font-medium rounded-lg mt-6 hover:opacity-90 transition-all text-sm uppercase tracking-widest"
                >
                  แสดงเพิ่มเติม
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Guides;
