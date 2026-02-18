import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TripsDescription = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/trips`);
      setTrips(res.data.data.slice(0, 6));
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-[#37101A] text-center text-2xl font-bold mb-3">
        แนะนำทริปท่องเที่ยว
      </h2>
      <p className="text-center text-gray-600 mb-8">
        คัดสรรทริปคุณภาพ พร้อมไกด์มืออาชีพ
      </p>
    </section>
  );
};

export default TripsDescription;
