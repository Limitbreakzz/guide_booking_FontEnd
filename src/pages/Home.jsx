import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Highlights from "../components/Highlights";
import { motion, AnimatePresence } from "framer-motion";
import Description from "../components/Description";
import InterestingTrips from "../components/InterestingTrips";
import InterestingGuides from "../components/InterestingGuides";


const Home = () => {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const hasShownOverlay = sessionStorage.getItem("overlayShown");

    if (!hasShownOverlay) {
      const timer = setTimeout(() => {
        setShowOverlay(false);
        sessionStorage.setItem("overlayShown", "true");
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowOverlay(false);
    }
  }, []);

  return (
    <>
      <div className="bg-[#FFFCF6] min-h-screen">
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://image.makewebeasy.net/makeweb/crop/wvcCMuduF/home/zone1_BG_2x.webp?v=202405291424&x=0&y=0&w=3840&h=1386"
                alt="overlay banner"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50"></div>

              <motion.div
                className="relative text-center text-white px-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  ยินดีต้อนรับสู่ GoWithGuide
                </h1>
                <p className="text-base md:text-xl">
                  ออกแบบการเดินทางอย่างมีความหมาย
                </p>
              </motion.div>

              <button
                onClick={() => setShowOverlay(false)}
                className="absolute top-6 right-6 text-white text-3xl font-bold"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {!showOverlay && <Navbar isOnBanner={false} />}
        <div className="py-20 container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Description />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <InterestingTrips />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <InterestingGuides />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Highlights />
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;