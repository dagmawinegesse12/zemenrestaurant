import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Toaster } from "react-hot-toast";

import "./index.css";
import {AboutSection} from "./components/AboutSection";
import { CoffeeCeremony } from "./components/CoffeeCeremony";
import { InteractiveMenuOrder, StaticMenuPreview } from "./components/InteractiveMenuOrder";
import { Reviews } from "./components/Reviews";
import Reservation from "./components/Reservation";
import ThankYouPage from "./components/ThankyouPage";
import AdminLoginPage from "./components/AdminControls/AdminLoginPage";
import ProtectedRoute from "./components/AdminControls/ProtectedRoute";
import AdminView from "./components/AdminControls/AdminView";
import {AdminOrderViewer} from "./components/AdminControls/AdminOrderViewer";
import AdminReservationView from "./components/AdminControls/AdminReservationView";
import AdminDashboard from "./components/AdminControls/AdminDashboard";
import Navbar from "./components/Navbar";
const stripePromise = loadStripe("pk_test_RCPiaZZTfz00jOjiLvgD");

function App() {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route
            path="/"
            element={
              <div id="top" className="font-serif text-gray-900">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <section
                    className="h-screen bg-cover bg-center flex items-center justify-center text-white text-center"
                    style={{ backgroundImage: "url('/bg.png')" }}
                  >

                    <Navbar  />
                    {/* <a
                      href="#top"
                      className="fixed top-4 left-4 z-50 flex items-center space-x-3 bg-white bg-opacity-90 rounded-full p-2 shadow-lg cursor-pointer"
                    >
                      <img src="/favicon.png" alt="Zemen Logo" className="w-12 h-12 rounded-full" />
                      <span className="text-lg font-bold text-gray-900 hidden md:inline">
                        Zemen Bar & Restaurant
                      </span>
                    </a> */}

                    <div className="bg-black bg-opacity-60 p-10 rounded">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Zemen Bar and Restaurant</h1>
                      <p className="text-xl">Experience the warmth of Ethiopian hospitality</p>
                      <a href="#reserve">
                        <button className="mt-6 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-3 px-6 rounded transition">
                          Reserve a Table
                        </button>
                      </a>
                    </div>
                  </section>
                </motion.div>

                {/* <div className="fixed top-4 right-4 z-50 flex flex-col md:flex-row items-center gap-2 md:gap-4">
                  <a href="#menu" className="flex items-center space-x-2 bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-lg cursor-pointer">
                    <span className="text-lg font-semibold text-gray-900">📖 Menu</span>
                  </a>
                  <a href="#order-online" className="flex items-center space-x-2 bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-lg cursor-pointer">
                    <span className="text-lg font-semibold text-gray-900 hidden md:inline">Order Online</span>
                    <div className="relative">
                      <span className="text-2xl">🛒</span>
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                          {totalItems}
                        </span>
                      )}
                    </div>
                  </a>
                </div> */}

                <AboutSection />
                <section id="menu" className="bg-[#5c2f13]">
                  <StaticMenuPreview />
                </section>
                {/* <section className="px-6 md:px-24 py-16 bg-[#5c2f13] text-white font-serif"> */}

                <section id="order-online" className="px-6 md:px-24 py-16 bg-[#5c2f13] text-white font-serif">
                  <Toaster />
                  <InteractiveMenuOrder quantities={quantities} setQuantities={setQuantities} />
                </section>
                <CoffeeCeremony />
                <Reviews />
                <div id="reserve"><Reservation /></div>

                <footer className="bg-black text-white text-center py-6">
                  <p>© 2025 Zemen Restaurant. All rights reserved.</p>
                  <p className="text-sm mt-2">
                    <a
                      href="https://www.google.com/maps?q=2148+E+Belt+Line+Rd,+Richardson,+TX+75081-3930"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-yellow-500"
                    >
                      2148 E Belt Line Rd, Richardson, TX 75081-3930
                    </a>
                  </p>
                </footer>
              </div>
            }
          />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/admin-view" element={<AdminView />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin-orders" element={<AdminOrderViewer />} />
          <Route path="/admin-reservations" element={<AdminReservationView />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Elements>
    </Router>
  );
}

export default App;
