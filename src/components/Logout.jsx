import { useEffect } from "react";

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/");
  }
}, []);
