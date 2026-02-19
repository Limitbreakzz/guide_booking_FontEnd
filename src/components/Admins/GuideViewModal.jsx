import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MapPin, Shield } from "lucide-react";
import axios from "axios";

const GuideViewModal = ({ guide, isOpen, onClose, onUpdate }) => {
  if (!guide) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#37101A]">รายละเอียดไกด์ทัวร์</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-6">
                {guide.picture ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/images/${guide.picture}`}
                    alt={guide.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-[#37101A]/10"
                  />
                ) : (
                  <div className="w-24 h-24 bg-[#37101A]/5 rounded-2xl flex items-center justify-center text-[#37101A] border-2 border-[#37101A]/10">
                    <Shield size={40} />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-black text-[#37101A]">{guide.name}</h3>
                  <p className="text-sm text-slate-500 font-semibold">Certified Tour Guide</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={16} className="text-[#37101A]" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">อีเมล</p>
                  </div>
                  <p className="text-base font-semibold text-[#37101A]">{guide.email}</p>
                </div>

                {/* Phone */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={16} className="text-[#37101A]" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">เบอร์โทร</p>
                  </div>
                  <p className="text-base font-semibold text-[#37101A]">{guide.tel || "—"}</p>
                </div>

                {/* Status */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={16} className="text-[#37101A]" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">สถานะ</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border ${
                      guide.status
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                      {guide.status ? "● พร้อมให้บริการ" : "○ ไม่พร้อม"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {guide.description && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">รายละเอียด</p>
                  <p className="text-base text-slate-700 leading-relaxed">{guide.description}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-8 py-4 flex justify-end gap-3 bg-slate-50">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
              >
                ปิด
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GuideViewModal;
