import React, { useEffect, useState } from "react";
import axios from "axios";

const TopDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopDestinations();
    }, []);

    const fetchTopDestinations = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:4000/trips/top-destinations");
            if (res.data && res.data.data) {
                setDestinations(res.data.data);
            } else {
                setDestinations([]);
            }
        } catch (err) {
            console.error("Error fetching top destinations:", err);
            setDestinations([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mt-12 px-4">
            <h2 className="text-2xl font-bold text-[#37101A] mb-8">
                จังหวัดที่น่าสนใจ
            </h2>
            {loading ? (
                <div className="py-10 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
            ) : destinations.length === 0 ? (
                <div className="py-10 text-center text-gray-400 border border-dashed rounded-xl">
                    ไม่พบข้อมูลจังหวัดที่น่าสนใจ
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {destinations.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center space-x-4 group cursor-pointer hover:opacity-80 transition-all"
                        >
                            <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-xl shadow-sm bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-lg text-gray-800 leading-tight">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {item.totalTrips} ทริปทั้งหมด
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default TopDestinations;