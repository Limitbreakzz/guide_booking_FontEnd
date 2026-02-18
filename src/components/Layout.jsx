import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen">
        {children}
      </div>
    </>
  );
};

export default Layout;
