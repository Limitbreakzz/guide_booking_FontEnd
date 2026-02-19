import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    provinceId: "",
    guideId: "",
    price: "",
    description: "",
    isActive: true,
  });

  const [picture, setPicture] = useState(null);

  useEffect(() => {
    fetchTrip();
  }, []);

  const fetchTrip = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/trips/${id}`,
      );
      const trip = res.data.data;

      setForm({
        name: trip.name || "",
        provinceId: trip.provinceId || "",
        guideId: trip.guideId || "",
        price: trip.price || "",
        description: trip.description || "",
        isActive: trip.isActive ?? true,
      });
    } catch (err) {
      console.error(err);
      alert("โหลดข้อมูลไม่สำเร็จ");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("provinceId", form.provinceId);
      formData.append("guideId", form.guideId);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("isActive", form.isActive);

      if (picture) {
        formData.append("picture", picture);
      }

      await axios.put(`${import.meta.env.VITE_API_URL}/trips/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("แก้ไขสำเร็จ");
      navigate("/admin/trips");
    } catch (err) {
      console.error(err);
      alert("แก้ไขไม่สำเร็จ");
    }
  };

  return (
    <div className="w-full px-6 py-10 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-[#37101A] uppercase tracking-tight">
            Edit Trip
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            Update travel package details
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="ชื่อทริป"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#37101A] outline-none"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="provinceId"
                placeholder="Province ID"
                value={form.provinceId}
                onChange={handleChange}
                className="border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#37101A] outline-none"
                required
              />

              <input
                type="number"
                name="guideId"
                placeholder="Guide ID"
                value={form.guideId}
                onChange={handleChange}
                className="border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#37101A] outline-none"
                required
              />
            </div>

            <input
              type="number"
              name="price"
              placeholder="ราคา"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#37101A] outline-none"
            />

            <textarea
              name="description"
              placeholder="รายละเอียด"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-[#37101A] outline-none"
            />

            <div className="relative">
              <label className="absolute -top-3 left-6 bg-white px-2 text-[14px] font-medium text-gray-400 uppercase z-10">
                รูปภาพใหม่ (ถ้ามี)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setTrip({ ...trip, picture: e.target.files[0] })
                }
                className="w-full px-6 py-4 border border-gray-100 rounded-lg outline-none focus:border-[#FFC1CC] transition-all text-[#37101A] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[14px] file:font-medium file:bg-[#37101A] file:text-white hover:file:bg-black file:cursor-pointer file:uppercase"
              />
            </div>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-4 h-4 accent-[#37101A]"
              />
              <span className="text-sm font-semibold text-slate-600">
                เปิดใช้งาน
              </span>
            </label>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#37101A] text-white py-3 rounded-xl font-bold hover:bg-[#4d1a26] transition-all active:scale-95 shadow-lg shadow-[#37101A]/20"
              >
                บันทึกการแก้ไข
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/trips")}
                className="flex-1 border border-slate-200 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditTrip;
