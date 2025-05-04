import React, { useState } from "react";
import { AdminOrderViewer } from "./AdminOrderViewer";
import AdminReservationView from "./AdminReservationView";
import { AnimatePresence, motion } from "framer-motion";

const AdminView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"orders" | "reservations">("orders");

    return (
        <div className="bg-white rounded-xl shadow-md mt-10 p-6 space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🛠️ Admin Management</h2>

            {/* Tabs */}
            <div className="flex justify-center gap-6">
                <button
                    onClick={() => setActiveTab("orders")}
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                        activeTab === "orders"
                            ? "bg-gray-900 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    📦 Orders
                </button>
                <button
                    onClick={() => setActiveTab("reservations")}
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                        activeTab === "reservations"
                            ? "bg-gray-900 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    📅 Reservations
                </button>
            </div>

            {/* Animated Content */}
            <div className="relative min-h-[200px]">
                <AnimatePresence mode="wait">
                    {activeTab === "orders" ? (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.3 }}
                            className="absolute w-full"
                        >
                            <AdminOrderViewer />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reservations"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                            className="absolute w-full"
                        >
                            <AdminReservationView />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminView;
