"use client";
import React, { useState, useEffect } from "react";
import { Store, fetchStores } from "@/app/data/stores";
import StoreHoursEditor from "./components/StoreHoursEditor";
import ProductPriceEditor from "./components/ProductPriceEditor";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useRouter } from 'next/navigation';

interface DashboardStats {
    totalProducts: number;
    activeListings: number;
    totalOrders: number;
    pendingOrders: number;
    revenue: number;
    views: number;
}

interface RecentOrder {
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    date: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    status: 'active' | 'draft' | 'sold';
    image: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        activeListings: 0,
        totalOrders: 0,
        pendingOrders: 0,
        revenue: 0,
        views: 0
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<number | null>(null);

    useEffect(() => {
        // Check if user is logged in and has completed setup
        const businessInfo = localStorage.getItem('businessInfo');
        if (!businessInfo) {
            router.push('/business-setup');
            return;
        }

        // Parse the business info
        try {
            const parsedInfo = JSON.parse(businessInfo);
            if (!parsedInfo || !parsedInfo.storeName) {
                router.push('/business-setup');
                return;
            }
        } catch (error) {
            router.push('/business-setup');
            return;
        }

        // Here you would typically fetch dashboard data from your backend
        // For now, we'll use mock data
        setStats({
            totalProducts: 45,
            activeListings: 38,
            totalOrders: 156,
            pendingOrders: 12,
            revenue: 45678.90,
            views: 1234
        });

        setRecentOrders([
            {
                id: '1',
                customer: 'John Doe',
                product: 'Diamond Engagement Ring',
                amount: 4999.99,
                status: 'pending',
                date: '2024-03-15'
            },
            {
                id: '2',
                customer: 'Jane Smith',
                product: 'Gold Necklace',
                amount: 1299.99,
                status: 'completed',
                date: '2024-03-14'
            }
        ]);

        setProducts([
            {
                id: '1',
                name: 'Diamond Engagement Ring',
                price: 4999.99,
                category: 'Wedding Rings',
                status: 'active',
                image: '/placeholder.jpg'
            },
            {
                id: '2',
                name: 'Gold Necklace',
                price: 1299.99,
                category: 'Fine Jewelry',
                status: 'active',
                image: '/placeholder.jpg'
            }
        ]);
    }, [router]);

    useEffect(() => {
        fetchStores()
            .then((data) => setStores(data))
            .catch((err) => console.error(err));
    }, []);

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Products</h3>
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                        <p className="text-sm text-gray-500">{stats.activeListings} active listings</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                        <p className="text-sm text-gray-500">{stats.pendingOrders} pending orders</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue</h3>
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{stats.views} profile views</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderProducts = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <button
                    onClick={() => router.push('/products/new')}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
                >
                    Add New Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-gray-500">{product.category}</p>
                            <p className="text-xl font-bold text-gray-900 mt-2">${product.price.toLocaleString()}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    product.status === 'active' ? 'bg-green-100 text-green-800' :
                                    product.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {product.status}
                                </span>
                                <button
                                    onClick={() => router.push(`/products/${product.id}`)}
                                    className="text-yellow-400 hover:text-yellow-500"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Settings</h3>
                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/profile-edit-business')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                        Edit Business Profile
                    </button>
                    <button
                        onClick={() => router.push('/subscription')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                        Manage Subscription
                    </button>
                    <button
                        onClick={() => router.push('/analytics')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                        View Analytics
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    </div>

                    <div className="mb-8">
                        <nav className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 rounded-lg ${
                                    activeTab === 'overview'
                                        ? 'bg-yellow-400 text-black'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`px-4 py-2 rounded-lg ${
                                    activeTab === 'products'
                                        ? 'bg-yellow-400 text-black'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Products
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`px-4 py-2 rounded-lg ${
                                    activeTab === 'settings'
                                        ? 'bg-yellow-400 text-black'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Settings
                            </button>
                        </nav>
                    </div>

                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'products' && renderProducts()}
                    {activeTab === 'settings' && renderSettings()}
                </div>
            </main>
            <Footer />
        </>
    );
}
