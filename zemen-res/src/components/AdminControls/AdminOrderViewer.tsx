import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAdminTheme } from "./AdminThemeProvider";

interface OrderItem {
    item_name?: string;
    name?: string;
    quantity: number;
    price_per_item?: number;
    price?: number;
}

interface Order {
    id: number;
    name: string;
    phone: string;
    order_type: string;
    payment_status: string;
    total_price: string;
    special_request?: string;
    delivery_address?: string;
    created_at: string;
    items: OrderItem[];
}

export const AdminOrderViewer = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const { theme } = useAdminTheme();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            fetchOrders(token);
        } else {
            const enteredToken = prompt("Please enter admin token:");
            if (enteredToken) {
                localStorage.setItem("adminToken", enteredToken);
                fetchOrders(enteredToken);
            }
        }
    }, []);

    const fetchOrders = async (token: string) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/orders/admin/orders/", {
                headers: { Authorization: `Token ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch orders.");
            const data = await response.json();
            setOrders(data);
        } catch (error: any) {
            Swal.fire("Error", error.message || "Unknown error", "error");
        }
    };

    return (
        <section className="px-6 md:px-20 py-12 bg-white dark:bg-gray-900 transition-colors duration-500 min-h-screen">
            <h1 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">📦 Orders</h1>
            <div className="space-y-8">
                {orders.map(order => (
                    <div
                        key={order.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition p-6 space-y-6"
                    >
                        <div className="flex justify-between items-start flex-wrap gap-6">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Order #{order.id}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{order.name} • {order.phone}</p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm">Placed on {new Date(order.created_at).toLocaleString()}</p>
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.order_type === "pickup" ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300"}`}>
                                    {order.order_type.toUpperCase()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.payment_status === "Paid" ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300"}`}>
                                    {order.payment_status}
                                </span>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">${Number(order.total_price).toFixed(2)}</span>
                                <button
                                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                    className="px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium transition"
                                >
                                    {expandedId === order.id ? "Hide Details" : "View Details"}
                                </button>
                            </div>
                        </div>

                        {expandedId === order.id && (
                            <div className="animate-fadeIn bg-gray-50 dark:bg-gray-700 rounded-xl p-5 space-y-4 border dark:border-gray-600 mt-6">
                                <h3 className="font-semibold text-gray-700 dark:text-white">📝 Items Ordered</h3>
                                <ul className="space-y-2 text-gray-800 dark:text-gray-300">
                                    {order.items.map((item, idx) => {
                                        const itemName = item.item_name ?? item.name ?? "Unnamed Item";
                                        const rawPrice = item.price_per_item ?? item.price ?? 0;
                                        const unitPrice = Number(rawPrice) || 0;
                                        const total = unitPrice * item.quantity;

                                        return (
                                            <li key={idx} className="text-sm">
                                                <strong>{item.quantity}x {itemName}</strong> @ ${unitPrice.toFixed(2)} each → <span className="text-green-700 dark:text-green-400 font-semibold">${total.toFixed(2)}</span>
                                            </li>
                                        );
                                    })}
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-3">Total: ${Number(order.total_price).toFixed(2)}</p>
                                </ul>

                                {order.special_request && (
                                    <p className="dark:text-gray-300"><strong>📌 Special Request:</strong> {order.special_request}</p>
                                )}
                                {order.delivery_address && (
                                    <p className="dark:text-gray-300"><strong>🚚 Delivery Address:</strong> {order.delivery_address}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
