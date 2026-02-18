import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Layout from "./components/Layout";
import Footer from "./components/Footer";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Trips from "./pages/Trips/Trips";
import Guides from "./pages/Guides/Guides";
import GuideDetail from "./pages/Guides/GuideDetail";
import TripDetail from "./pages/Trips/TripDetail";
import Booking from "./pages/Trips/Booking";
import TouristProfile from "./pages/Tourist/TouristProfile";
import EditGuideProfile from "./pages/Guides/EditGuideProfile";
import CreateTrip from "./pages/Guides/CreateTrip";
import EditTrip from "./pages/Trips/EditTrip";
import MyTrips from "./pages/Guides/MyTrips";
import EditTouristProfile from "./pages/Tourist/EditTouristProfile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminTrips from "./pages/Admin/AdminTrips";
import AdminGuides from "./pages/Admin/AdminGuides";
import AdminEditTrip from "./pages/Admin/AdminEditTrip";
import AdminTourists from "./pages/Admin/AdminTourists";
import TouristBookings from "./pages/Tourist/TouristBookings";
import GuideBookings from "./pages/Guides/GuideBookings";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/trips" element={<Trips />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/guides/:id" element={<GuideDetail />} />
                <Route path="/trips/:id" element={<TripDetail />} />
                <Route path="/booking/:tripId" element={<Booking />} />
                <Route path="/tourist/:id" element={<TouristProfile />} />
                <Route path="/guides/:id/edit" element={<EditGuideProfile />} />
                <Route path="/create-trip" element={<CreateTrip />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/trips/:id/edit" element={<EditTrip />} />
                <Route path="/my-trips" element={<MyTrips />} />
                <Route path="/tourist/:id/edit" element={<EditTouristProfile />} />
                <Route path="/admin/trips" element={<AdminTrips />} />
                <Route path="/admin/guides" element={<AdminGuides />} />
                <Route path="/admin/trips/:id/edit" element={<AdminEditTrip />} />
                <Route path="/admin/tourists" element={<AdminTourists />} />
                <Route path="/bookings/my-bookings" element={<TouristBookings />} />
                <Route path="/guide-bookings" element={<GuideBookings />} />
              </Routes>
              <Footer />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
