import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "ย้อนกลับ" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-100 text-[#37101A] font-bold text-xs uppercase tracking-widest hover:border-[#FFC1CC] hover:bg-[#FFC1CC]/5 transition-all shadow-sm group"
    >
      <i className="fa-solid fa-chevron-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
      {label || "ย้อนกลับ"}
    </button>
  );
};

export default BackButton;
