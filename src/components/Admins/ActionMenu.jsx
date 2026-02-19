import React, { useState, useRef, useEffect } from "react";
import { Eye, Edit3, Trash2, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ActionMenu = ({ 
  onView, 
  onEdit, 
  onDelete,
  viewLabel = "ดู",
  editLabel = "แก้ไข",
  deleteLabel = "ลบ"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (callback) => {
    callback();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-slate-600 bg-slate-50 hover:bg-slate-200 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37101A]/20"
        title="More actions"
      >
        <MoreVertical size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg shadow-slate-900/10 z-50 overflow-hidden"
          >
            <div className="py-1">
              <button
                onClick={() => handleAction(onView)}
                className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-all group"
              >
                <Eye size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                {viewLabel}
              </button>
              <button
                onClick={() => handleAction(onEdit)}
                className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 flex items-center gap-3 transition-all group"
              >
                <Edit3 size={16} className="text-slate-400 group-hover:text-amber-600 transition-colors" />
                {editLabel}
              </button>
              <div className="border-t border-slate-100"></div>
              <button
                onClick={() => handleAction(onDelete)}
                className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-all group"
              >
                <Trash2 size={16} className="text-slate-400 group-hover:text-red-600 transition-colors" />
                {deleteLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionMenu;
