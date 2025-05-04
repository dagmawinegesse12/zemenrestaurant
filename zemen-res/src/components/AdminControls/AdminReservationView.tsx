import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAdminTheme } from "./AdminThemeProvider";
import { API_BASE_URL } from "../../utils/api";

interface Reservation {
    id: number;
    name: string;
    phone: string;
    email: string;
    reservation_date: string;
    reservation_time: string;
    people_count: number;
    special_request: string;
    status: "pending" | "confirmed" | "cancelled";
}

const AdminReservationView: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[] | null>(null);
    const { theme } = useAdminTheme();

    const fetchReservations = async () => {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/api/orders/admin/reservations/`, {
            headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) {
            Swal.fire("Error", "Failed to fetch reservations.", "error");
            return;
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            Swal.fire("Error", "Invalid reservation data.", "error");
            return;
        }

        setReservations(data);
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const updateStatus = async (id: number, status: "confirmed" | "cancelled") => {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/api/orders/admin/reservations/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        if (response.ok) {
            Swal.fire("Success", `Reservation ${status}`, "success");
            fetchReservations();
        } else {
            Swal.fire("Error", "Failed to update reservation", "error");
        }
    };

    return (
        <section className="px-6 md:px-20 py-12 bg-white dark:bg-gray-900 transition-colors duration-500 min-h-screen">
            <h1 className="text-4xl font-bold mb-12 text-gray-900 dark:text-white text-center">📅 Reservations</h1>

            {!reservations ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Loading reservations...</p>
            ) : reservations.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No reservations found.</p>
            ) : (
                <div className="space-y-8">
                    {reservations.map((res) => (
                        <div
                            key={res.id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition p-6 space-y-6"
                        >
                            <div className="flex justify-between flex-wrap gap-4 items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reservation #{res.id}</h2>
                                    <p className="text-gray-600 dark:text-gray-400">{res.name} • {res.phone}</p>
                                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                                        For {res.people_count} people on {res.reservation_date} @ {res.reservation_time}
                                    </p>
                                </div>

                                <div>
                                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                                        res.status === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300" :
                                        res.status === "cancelled" ? "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300" :
                                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300"
                                    }`}>
                                        {res.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 text-gray-800 dark:text-gray-300">
                                <p><strong>Email:</strong> {res.email}</p>
                                <p><strong>Special Request:</strong> {res.special_request || "None"}</p>
                            </div>

                            {res.status === "pending" && (
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => updateStatus(res.id, "confirmed")}
                                        className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => updateStatus(res.id, "cancelled")}
                                        className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default AdminReservationView;
