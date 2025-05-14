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
    const [userRole, setUserRole] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        activeListings: 0
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<number | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);

        // If user is not a business, stop here
        if (role && role !== 'business') {
            return;
        }

        // Check if in signup flow
        const signupData = localStorage.getItem('signupData');
        if (signupData) {
            router.push('/subscription');
            return;
        }

        // Check if business info exists
        const businessInfo = localStorage.getItem('businessInfo');
        if (!businessInfo) {
            router.push('/business-setup');
            return;
        }

        // Changed from completedSubscription to completedSetup
        const completedSetup = localStorage.getItem('completedSetup');
        if (!completedSetup) {
            router.push('/business-setup');
            return;
        }

        // When business setup completes successfully
        localStorage.setItem('completedSetup', 'true');

        // Rest of your dashboard initialization code...
    }, [router]);

    useEffect(() => {
        fetchStores()
            .then((data) => setStores(data))
            .catch((err) => console.error(err));
    }, []);

    // Render error page for non-business users
    if (userRole && userRole !== 'business') {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-black rounded-lg p-8 shadow-xl">
                            <h1 className="text-2xl text-[#FFD700] font-bold mb-4">
                                Business Account Required
                            </h1>
                            <p className="text-white mb-6">
                                You need a business account to access the dashboard. If you're a business owner, 
                                please sign up for a business account.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-6 py-3 bg-transparent border border-[#FFD700] text-[#FFD700] rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors"
                                >
                                    Return Home
                                </button>
                                <button
                                    onClick={() => router.push('/signup')}
                                    className="px-6 py-3 bg-[#FFD700] text-black rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
                                >
                                    Create Business Account
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Products</h3>
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                        <p className="text-sm text-gray-500">{stats.activeListings} active listings</p>
                    </div>
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

    const renderTabs = () => (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`${
                        activeTab === 'overview'
                            ? 'border-yellow-400 text-yellow-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`${
                        activeTab === 'products'
                            ? 'border-yellow-400 text-yellow-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                >
                    Products
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`${
                        activeTab === 'settings'
                            ? 'border-yellow-400 text-yellow-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                >
                    Settings
                </button>
            </nav>
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
                        {renderTabs()}
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
