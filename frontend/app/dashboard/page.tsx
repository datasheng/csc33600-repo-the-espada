"use client";
import React, { useState, useEffect } from "react";
import { Store, fetchStores } from "@/app/data/stores";
import StoreHoursEditor from "./components/StoreHoursEditor";
import ProductPriceEditor from "./components/ProductPriceEditor";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function DashboardPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  useEffect(() => {
    fetchStores()
      .then((data) => setStores(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Business Dashboard</h1>
                <p className="mt-2 text-lg text-gray-600">Manage your store hours and product prices</p>
              </div>
              <div className="mt-4 md:mt-0">
                <select
                  className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  value={selectedStore ?? ""}
                  onChange={(e) => setSelectedStore(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">-- Choose store --</option>
                  {stores.map((s) => (
                    <option key={s.storeID} value={s.storeID}>
                      {s.store_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedStore !== null ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-900">Store Hours</h2>
                    <p className="mt-1 text-sm text-gray-500">Set your business operating hours</p>
                  </div>
                  <StoreHoursEditor storeID={selectedStore} />
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-900">Product Prices</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage your product catalog and pricing</p>
                  </div>
                  <ProductPriceEditor storeID={selectedStore} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Select a Store</h3>
                <p className="mt-2 text-sm text-gray-500">Choose a store from the dropdown above to manage its settings</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
