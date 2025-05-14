"use client";
import React, { useState, useEffect } from "react";
import { Store, fetchStores, DAYS_OF_WEEK, getStoreStatus, formatTimeForDisplay, fetchStoreHours } from "@/app/data/stores";
import type { StoreHours } from "@/app/data/stores";
import StoreHoursEditor from "./components/StoreHoursEditor";
import ProductPriceEditor from "./components/ProductPriceEditor";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useRouter } from 'next/navigation';
import { StarRating } from '@/app/components/StarRating';
import styles from '../stores/[id]/StorePage.module.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';
const MapPreview = dynamic(() => import('../components/MapPreview'), { ssr: false });

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

interface DashboardStore {
    storeID: number;
    ownerID: number;
    store_name: string;
    rating: number;
    rating_count: number; // Add this property
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    email: string;
}

interface DashboardProduct {
    productID: number;
    storeID: number;
    chain_type: string;
    chain_purity: string;
    chain_thickness: number;
    chain_length: number;
    chain_color: string;
    chain_weight: number;
    set_price: number;
}

export default function Dashboard() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [stores, setStores] = useState<DashboardStore[]>([]);
    const [products, setProducts] = useState<DashboardProduct[]>([]);
    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const [hours, setHours] = useState<StoreHours[]>([]);
    const [store, setStore] = useState<DashboardStore | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);

        // If user is not a business, stop here
        if (role && role !== 'business') {
            return;
        }

        const loadDashboard = async () => {
            try {
                const ownerID = localStorage.getItem('ownerID');
                if (!ownerID) {
                    router.replace('/signup');
                    return;
                }

                const stores = await fetchStores();
                const ownerStore = stores.find(store => store.ownerID === parseInt(ownerID));

                if (!ownerStore) {
                    console.log('No store found for owner, redirecting to setup');
                    router.replace('/business-setup');
                    return;
                }

                // If we get here, store exists, set it in state
                setStore(ownerStore);
                setSelectedStore(ownerStore.storeID);
                
                // Update localStorage with confirmed store data
                localStorage.setItem('businessInfo', JSON.stringify(ownerStore));
                localStorage.setItem('completedSetup', 'true');

            } catch (error) {
                console.error('Error loading dashboard:', error);
                router.replace('/business-setup');
            }
        };

        loadDashboard();
    }, [router]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const storesData = await fetchStores();
                const ownerID = localStorage.getItem('ownerID');
                const ownerStore = storesData.find(s => s.ownerID === parseInt(ownerID || ''));
                if (ownerStore) {
                    setStore(ownerStore);
                    const hoursData = await fetchStoreHours(ownerStore.storeID);
                    setHours(hoursData);
                }
            } catch (err) {
                console.error(err);
            }
        };
        
        loadData();
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
            {store && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Store Information Card */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Store Information</h2>
                        <div className="bg-black rounded-lg p-8 shadow-xl">
                            <div className="mb-8">
                                <div>
                                    <h1 className="text-4xl text-[#FFD700] font-bold mb-4 tracking-tight">
                                        {store.store_name}
                                    </h1>
                                    
                                    <div className="mb-6">
                                        <StarRating 
                                            rating={store.rating} 
                                            size="large"
                                            readonly={true}
                                            numReviews={store.rating_count}
                                        />
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-3 mb-8">
                                        {/* Update all references to stores[0] to store */}
                                        <a 
                                            href={`https://maps.google.com/?q=${store.latitude},${store.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {store.address}
                                        </a>
                                        <a 
                                            href={`tel:${store.phone}`}
                                            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {store.phone}
                                        </a>

                                        <a 
                                            href={`mailto:${store.email}`}
                                            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {store.email}
                                        </a>
                                        <a 
                                            href={`/stores/${store.storeID}`}
                                            className="w-full bg-[#FFD700] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#e6c200] transition-colors inline-block text-center"
                                        >
                                            View Store Page
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Map Card */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Store Location</h2>
                        <div className="bg-black rounded-lg p-8 shadow-xl">
                            <div className="rounded-lg overflow-hidden mb-4">
                                <MapPreview 
                                    latitude={store.latitude}
                                    longitude={store.longitude}
                                    height={300}
                                />
                            </div>
                            <div className="flex gap-4 mt-4">
                                <a 
                                    href={`https://maps.google.com/?q=${store.latitude},${store.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-transparent border border-[#FFD700] text-[#FFD700] px-4 py-2 rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors inline-block text-center"
                                >
                                    View On Google Maps
                                </a>
                                <Link 
                                    href={{
                                        pathname: '/map',
                                        query: { storeID: store.storeID }
                                      }}
                                    className="flex-1 bg-[#FFD700] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#e6c200] transition-colors inline-block text-center"
                                >
                                    View Store on Map
                                </Link>
                            </div>
                        </div>

                        {/* Rating Distribution Card */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rating Distribution</h2>
                            <div className="bg-black rounded-lg p-8 shadow-xl">
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <div key={stars} className="flex items-center gap-2">
                                            <span className="text-gray-400 w-16">{stars} Stars</span>
                                            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#FFD700] rounded-full"
                                                    style={{ 
                                                        width: `${20}%` // This should be calculated from actual data
                                                    }}
                                                />
                                            </div>
                                            <span className="text-gray-400 w-8 text-right">
                                                0
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Hours Card */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Store Hours</h2>
                        <div className="bg-black rounded-lg p-8 shadow-xl">
                            {hours && (
                                <>
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className={`${styles.statusDot} ${getStoreStatus(hours).isOpen ? styles.open : styles.closed}`} />
                                        <span className="text-white text-lg font-medium">
                                            {getStoreStatus(hours).isOpen ? 'Open' : 'Closed'}
                                        </span>
                                        <span className="text-gray-400 mx-2 text-lg">•</span>
                                        <span className="text-gray-400 text-lg">{getStoreStatus(hours).nextChange}</span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {DAYS_OF_WEEK.map((day) => {
                                            const hourData = hours.find(h => h.daysOpen === day);
                                            return (
                                                <div key={day} className="flex justify-between">
                                                    <span className="text-gray-400 w-24 text-base font-medium">
                                                        {day}
                                                    </span>
                                                    <span className="text-white text-base">
                                                        {hourData 
                                                            ? hourData.openTime === 'CLOSED' || hourData.closeTime === 'CLOSED'
                                                                ? 'CLOSED'
                                                                : `${formatTimeForDisplay(hourData.openTime)} - ${formatTimeForDisplay(hourData.closeTime)}`
                                                            : 'CLOSED'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-6">
                                        <button
                                            onClick={() => router.push('/store-hours')}
                                            className="w-full bg-[#FFD700] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
                                        >
                                            Edit Store Hours
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
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
                    <div key={product.productID} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {`${product.chain_purity} ${product.chain_color} Gold ${product.chain_type} Chain`}
                            </h3>
                            <div className="space-y-2 text-gray-600">
                                <p>Thickness: {product.chain_thickness}mm</p>
                                <p>Length: {product.chain_length}in</p>
                                <p>Weight: {product.chain_weight}g</p>
                                <p className="text-xl font-bold text-yellow-400 mt-4">
                                    ${product.set_price.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => router.push(`/products/${product.productID}`)}
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
            <main className="min-h-screen bg-white pt-24 pb-12">
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
