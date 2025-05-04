import React, { useEffect, useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import AdminView from "./AdminView";
import { useAdminAuth } from "./AdminAuthContext";
import { useAdminTheme } from "./AdminThemeProvider";
import { API_BASE_URL } from "../../utils/api";

interface AdminUser {
    username: string;
}

interface OrderItem {
    item_name?: string;
    quantity: number;
    price_per_item?: number;
}

interface Order {
    id: number;
    name: string;
    phone: string;
    total_price: number;
    created_at: string;
    items: OrderItem[];
}

const AdminDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const { token, logout } = useAdminAuth();
    const { theme, toggleTheme } = useAdminTheme();

    useEffect(() => {
        if (!token) return;
        fetchOrders();
        fetchAdminUser();
    }, [token]);

    const fetchAdminUser = async () => {
        const response = await fetch(`${API_BASE_URL}/api/orders/profile/`, {
            headers: { Authorization: `Token ${token}` },
        });
        if (response.ok) {
            const data = await response.json();
            setAdminUser(data);
        }
    };

    const fetchOrders = async () => {
        const response = await fetch(`${API_BASE_URL}/api/orders/admin/orders/`, {
            headers: { Authorization: `Token ${token}` },
        });
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    const totalOrders = orders.length;
    const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + Number(order.total_price), 0), [orders]);
    const totalCustomers = useMemo(() => new Set(orders.map(order => order.phone)).size, [orders]);

    const orderSummaryData = useMemo(() => {
        const summary: Record<string, { day: string; orders: number; revenue: number; customers: Set<string> }> = {};
        orders.forEach(order => {
            const day = new Date(order.created_at).toLocaleDateString();
            if (!summary[day]) summary[day] = { day, orders: 0, revenue: 0, customers: new Set() };
            summary[day].orders += 1;
            summary[day].revenue += Number(order.total_price);
            summary[day].customers.add(order.phone);
        });
        return Object.values(summary);
    }, [orders]);

    const barChartData = orderSummaryData.map(item => ({
        day: item.day,
        orders: item.orders,
        customers: item.customers.size,
    }));

    const revenueChartData = orderSummaryData.map(item => ({
        day: item.day,
        revenue: item.revenue,
    }));

    const trendingMenu = useMemo(() => {
        const menuItemMap: Record<string, number> = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.item_name) menuItemMap[item.item_name] = (menuItemMap[item.item_name] || 0) + item.quantity;
            });
        });
        return Object.entries(menuItemMap)
            .map(([name, orders]) => ({ name, orders }))
            .sort((a, b) => b.orders - a.orders)
            .slice(0, 5);
    }, [orders]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
                <p className="text-xl text-gray-500 dark:text-gray-300">Loading Admin Dashboard...</p>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
                <p className="text-xl text-red-500 dark:text-red-400">Unauthorized. Please login as admin.</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-tr from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 min-h-screen p-8 space-y-12">
            {/* Navbar */}
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <img src="/favicon.png" alt="Zemen Logo" className="w-12 h-12 rounded-full shadow-md" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Zemen Admin Dashboard</h1>
                </div>

                {adminUser && (
                    <div className="flex items-center gap-4 bg-white/60 dark:bg-gray-700 backdrop-blur rounded-full px-5 py-2 shadow-md">
                        <img
                            src={`https://ui-avatars.com/api/?name=${adminUser.username}&background=random`}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border"
                        />
                        <button
                            onClick={toggleTheme}
                            className="text-xl text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        >
                            {theme === "light" ? "🌙" : "🌞"}
                        </button>
                        <span className="font-medium text-gray-800 dark:text-white">{adminUser.username}</span>
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded-full"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard title="Total Orders" value={totalOrders} />
                <StatCard title="Total Customers" value={totalCustomers} />
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            </div>

            {/* Charts and Trending */}
            <div className="space-y-12">
                <Section title="Order Summary">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#4ade80" />
                            <Bar dataKey="customers" fill="#fbbf24" />
                        </BarChart>
                    </ResponsiveContainer>
                </Section>

                <Section title="Trending Menu Items">
                    <div className="space-y-4">
                        {trendingMenu.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-white/80 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                <h4 className="font-semibold dark:text-white">{item.name}</h4>
                                <p className="text-gray-500 dark:text-gray-300">{item.orders} Orders</p>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="Total Revenue (Line Chart)">
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={revenueChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#34D399" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </Section>
            </div>

            <AdminView />
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
    <div className="bg-white/80 dark:bg-gray-700 p-6 rounded-lg shadow-sm text-center space-y-2 transition-colors duration-500">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-6">{title}</h2>
        {children}
    </div>
);

export default AdminDashboard;
