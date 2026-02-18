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
      const res = await axios.get(`http://localhost:4000/trips/${id}`);
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

      await axios.put(
        `http://localhost:4000/trips/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("แก้ไขสำเร็จ");
      navigate("/admin/trips");
    } catch (err) {
      console.error(err);
      alert("แก้ไขไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow">

        <h1 className="text-2xl font-bold mb-6">แก้ไขทริป</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="ชื่อทริป"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="number"
            name="provinceId"
            placeholder="Province ID"
            value={form.provinceId}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="number"
            name="guideId"
            placeholder="Guide ID"
            value={form.guideId}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="ราคา"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <textarea
            name="description"
            placeholder="รายละเอียด"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <div>
            <label className="block mb-2">รูปภาพใหม่ (ถ้ามี)</label>
            <input
              type="file"
              onChange={(e) => setPicture(e.target.files[0])}
            />
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <span>เปิดใช้งาน</span>
          </label>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            บันทึกการแก้ไข
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminEditTrip;
