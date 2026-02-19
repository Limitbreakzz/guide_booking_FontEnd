import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Briefcase, DollarSign } from "lucide-react";

const TripViewModal = ({ trip, isOpen, onClose }) => {
  if (!trip) return null;

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
              <h2 className="text-2xl font-black text-[#37101A]">รายละเอียดทริป</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-6">
              {/* Title Section */}
              <div className="flex items-center gap-6">
                {trip.picture ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/images/${trip.picture}`}
                    alt={trip.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-[#37101A] border-2 border-slate-200">
                    <MapPin size={40} />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-black text-[#37101A]">{trip.name}</h3>
                  <p className="text-sm text-slate-500 font-semibold">Tour Package</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guide */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={16} className="text-[#37101A]" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ไกด์ผู้ดูแล</p>
                  </div>
                  <p className="text-base font-semibold text-[#37101A]">{trip.guide?.name || "—"}</p>
                </div>

                {/* Price */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} className="text-[#37101A]" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ราคา</p>
                  </div>
                  <p className="text-xl font-black text-[#37101A]">฿{Number(trip.price).toLocaleString()}</p>
                </div>
              </div>

              {/* Description */}
              {trip.description && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">รายละเอียด</p>
                  <p className="text-base text-slate-700 leading-relaxed">{trip.description}</p>
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

export default TripViewModal;
