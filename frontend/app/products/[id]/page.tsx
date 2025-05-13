"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Store, 
  Product,
  PriceHistory,
  fetchStores,
  fetchProducts,
  fetchPriceHistory,
  getStoreStatus, 
  getFormattedProductName,
  fetchStoreHours,
  StoreHours
} from '../../data/stores';
import styles from './ProductPage.module.css';
import { StarRating } from '@/app/components/StarRating';
import { motion } from 'framer-motion';

const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'just now';
  }
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const hours = Math.floor(diffInMinutes / 60);
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
};

const ProductPage = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [hours, setHours] = useState<StoreHours[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const params = useParams();
  const productID = parseInt(params.id as string, 10);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, priceHistoryData] = await Promise.all([
          fetchProducts(),
          fetchPriceHistory(productID)
        ]);
        
        const productData = products.find(p => p.productID === productID);
        if (!productData) {
          setError('Product not found');
          return;
        }

        const stores = await fetchStores();
        const storeData = stores.find(s => s.storeID === productData.storeID);

        if (!storeData) {
          setError('Store not found');
          return;
        }

        const hoursData = await fetchStoreHours(storeData.storeID);

        setProduct(productData);
        setStore(storeData);
        setHours(hoursData);
        setPriceHistory(priceHistoryData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error loading data');
      }
    };

    loadData();
  }, [productID]);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[80px] pb-[60px] px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!store || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[80px] pb-[60px] px-4">
          <div className="max-w-6xl mx-auto text-center">
            Loading...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { isOpen, nextChange } = getStoreStatus(hours);

  const handlePriceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const price = parseFloat((form.elements[0] as HTMLInputElement).value);
    const timeInput = (form.elements[1] as HTMLInputElement).value;
    
    // Combine current date with selected time
    const today = new Date();
    const [hours, minutes] = timeInput.split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not logged in');
  
      const response = await fetch(`http://localhost:5000/api/products/${productID}/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: parseInt(userId),
          productID: productID,
          storeID: store?.storeID,
          latest_price: price,
          purchase_date: today.toISOString()
        })
      });
  
      if (!response.ok) throw new Error('Failed to submit price');
  
      const newPriceHistory = await fetchPriceHistory(productID);
      setPriceHistory(newPriceHistory);
      setShowPriceModal(false);
    } catch (error) {
      console.error('Error submitting price:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[80px] pb-[60px] px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-black rounded-lg p-8 shadow-xl">
            <div className="mb-8">
              <h1 className="text-4xl text-[#FFD700] font-bold mb-4 tracking-tight">
                {getFormattedProductName(product)}
              </h1>
              <h2 className="text-2xl text-white mb-2 opacity-90">
                {store.store_name}
              </h2>
              <div className="mb-2">
                <StarRating 
                  rating={store.rating} 
                  size="medium"
                  numReviews={store.rating_count}
                />
              </div>
              <p className="text-gray-400">
                {store.address}
              </p>
              
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <span className={`${styles.statusDot} ${isOpen ? styles.open : styles.closed}`} />
                  <span className="text-white">
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-400">{nextChange}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                  Retail Price: ${product.set_price.toLocaleString()}
                </h2>
                <h3 className="text-gray-400 mb-2">Specifications</h3>
                <ul className="space-y-2">
                  <li className="text-white">Purity: {product.chain_purity}</li>
                  <li className="text-white">Color: {product.chain_color}</li>
                  <li className="text-white">Style: {product.chain_type}</li>
                  <li className="text-white">Thickness: {product.chain_thickness}mm</li>
                  <li className="text-white">Length: {product.chain_length}in</li>
                  <li className="text-white">Weight: {product.chain_weight}g</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-gray-400 mb-4">Latest Purchases By Users</h3>
                <div className="bg-black/30 rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-black/50 text-gray-400">
                        <th className="py-2 px-4 text-left text-sm font-semibold">User</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold">Time of Last Purchase</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceHistory.map((purchase, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-2 px-4 text-white text-sm">{purchase.full_name}</td>
                          <td className="py-2 px-4 text-gray-400 text-sm">
                            {getRelativeTimeString(new Date(purchase.purchase_date))}
                          </td>
                          <td className="py-2 px-4 text-[#FFD700] font-bold text-sm">
                            ${Number(purchase.latest_price).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>
                        </tr>
                      ))}
                      {priceHistory.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-gray-400">
                            No purchase history available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  {!isLoggedIn ? (
                    <button
                      onClick={() => router.push('/login')}
                      className="w-full bg-black text-[#FFD700] border border-[#FFD700] px-4 py-2 rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors"
                    >
                      Log In To Report Prices
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPriceModal(true)}
                      className="w-full bg-[#FFD700] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
                    >
                      Report Your Latest Purchase
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={`/stores/${store.storeID}`}
                  className="bg-black text-[#FFD700] border border-[#FFD700] px-6 py-3 rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors"
                >
                  View Store Details
                </Link>
                <Link
                  href={{
                    pathname: '/map',
                    query: { storeID: store.storeID }
                  }}
                  className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
                >
                  View Store on Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showPriceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black border border-[#FFD700] p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl text-[#FFD700] font-bold mb-4">
              Report Your Purchase
            </h3>
            <form onSubmit={handlePriceSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 block mb-2">Purchase Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  className="w-full bg-white/10 text-white border border-gray-600 rounded-lg px-4 py-2 focus:border-[#FFD700] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-2">Purchase Time</label>
                <input
                  type="time"
                  required
                  className={`w-full bg-white/10 text-white border border-gray-600 rounded-lg px-4 py-2 focus:border-[#FFD700] focus:outline-none ${styles.dateTimeInput}`}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPriceModal(false)}
                  className="flex-1 bg-transparent border border-[#FFD700] text-[#FFD700] px-4 py-2 rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#FFD700] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;