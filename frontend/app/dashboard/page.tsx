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
      <main className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-900">Business Dashboard</h1>
            <div className="flex items-center space-x-4">
              <label className="text-lg font-medium text-gray-700">Select Store:</label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            {selectedStore !== null && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StoreHoursEditor storeID={selectedStore} />
                <ProductPriceEditor storeID={selectedStore} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
