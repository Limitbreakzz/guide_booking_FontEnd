import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchProvince, setSearchProvince] = useState("");
  const [searchTrip, setSearchTrip] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const navigate = useNavigate();

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const keyword = searchTrip.trim() || searchProvince.trim();
      const url = keyword
        ? `${import.meta.env.VITE_API_URL}/trips/q/${encodeURIComponent(keyword)}`
        : `${import.meta.env.VITE_API_URL}/trips`;

      const res = await axios.get(url);
      setTrips(res.data.data);
      setVisibleCount(4);
    } catch (err) {
      console.error(err);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [searchTrip, searchProvince]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <section className="mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <label className="absolute -top-3 left-6 bg-white px-2 text-[12px] font-medium text-gray-400 uppercase">
                จังหวัด
              </label>
              <input
                type="text"
                value={searchProvince}
                onChange={(e) => setSearchProvince(e.target.value)}
                placeholder="ชื่อจังหวัด"
                className="w-full px-6 py-4 border rounded-lg outline-none focus:border-[#FFC1CC] transition-all text-[#37101A] font-medium placeholder:text-gray-300"
              />
            </div>
            <div className="flex-1 w-full relative">
              <label className="absolute -top-3 left-6 bg-white px-2 text-[12px] font-medium text-gray-400 uppercase">
                ทริป
              </label>
              <input
                type="text"
                value={searchTrip}
                onChange={(e) => setSearchTrip(e.target.value)}
                placeholder="ชื่อทริป"
                className="w-full px-6 py-4 border rounded-lg outline-none focus:border-[#FFC1CC] transition-all text-[#37101A] font-medium placeholder:text-gray-300"
              />
            </div>
            <button
              onClick={fetchTrips}
              className="w-full md:w-14 h-14 bg-[#FFC1CC] text-[#37101A] rounded-xl hover:bg-[#ffabbb] transition-all flex items-center justify-center shadow-lg shadow-[#FFC1CC]/20 flex-shrink-0"
            >
              <i className="fa-solid fa-magnifying-glass text-xl"></i>
            </button>
          </div>
        </section>

        <div className="flex justify-between items-center mb-8 px-2">
          <h2 className="text-base font-medium text-gray-600">
            แสดง{" "}
            <span className="text-[#37101A] font-bold">
              {Math.min(visibleCount, trips.length)}
            </span>{" "}
            จาก{" "}
            <span className="text-[#FFC1CC] font-bold">
              {trips.length} สถานที่
            </span>
          </h2>
        </div>

        <section className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-gray-400 animate-pulse font-bold">
              กำลังดึงข้อมูล...
            </div>
          ) : (
            <>
              {trips.slice(0, visibleCount).map((trip, idx) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row h-auto md:h-[250px] group transition-all hover:shadow-xl"
                >
                  <div className="w-full md:w-[30%] h-56 md:h-full relative overflow-hidden bg-gray-100 flex-shrink-0">
                    {trip.picture ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/images/${trip.picture}`}
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-[#37101A] shadow-sm">
                      {trip.province?.name}
                    </div>
                    <div
                      className={`absolute top-4 right-4 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1.5 ${trip.isActive !== false ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full bg-white ${trip.isActive !== false ? "animate-pulse" : ""}`}
                      ></span>
                      {trip.isActive !== false ? "เปิดจอง" : "ปิดการจอง"}
                    </div>
                  </div>

                  <div className="flex-1 p-6 md:p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start min-w-0">
                      <div className="min-w-0 pr-4">
                        <h3 className="text-2xl font-bold text-[#37101A] truncate mb-1">
                          {trip.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500 text-[14px] mb-3">
                          <i className="fa-solid fa-newspaper text-[#37101A] flex-shrink-0"></i>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[14px] text-gray-400 font-base uppercase">
                          ราคาประมาณ
                        </p>
                        <p className="text-2xl font-black text-[#FFC1CC] whitespace-nowrap">
                          {trip.price ? trip.price.toLocaleString() : "0"}{" "}
                          <span className="text-md font-bold">บาท</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-3 pt-4">
                      <button
                        onClick={() => navigate(`/trips/${trip.id}`)}
                        disabled={trip.isActive === false}
                        className={`flex-1 py-4 font-medium rounded-lg transition-all text-md ${
                          trip.isActive !== false
                            ? "bg-[#FFC1CC]/40 text-[#37101A] hover:bg-[#FFC1CC]"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {trip.isActive !== false
                          ? "รายละเอียด / จองทริป"
                          : "ไม่สามารถจองได้"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {visibleCount < trips.length && (
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

export default Trips;
