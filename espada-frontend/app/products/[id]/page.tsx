"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';  // Add this import
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Store, 
  fetchStores,
  getStoreStatus, 
  parseStoreHours,
  getFormattedProductName
} from '../../data/stores';
import styles from './ProductPage.module.css';
import { StarRating } from '@/app/components/StarRating';
import { motion } from 'framer-motion';

const ProductPage = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const storeId = params.id as string;
  const router = useRouter(); // This will now use the App Router version

  useEffect(() => {
    const loadStore = async () => {
      try {
        console.log('Loading store with ID:', storeId);
        const stores = await fetchStores();
        console.log('All stores:', stores);
        const storeData = stores.find(s => s.id === storeId);
        console.log('Found store:', storeData);
        
        if (!storeData) {
          setError('Store not found');
          return;
        }
        
        setStore(storeData);
      } catch (err) {
        console.error('Error loading store:', err);
        setError('Error loading store data');
      }
    };
    loadStore();
  }, [storeId]);

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

  if (!store) {
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

  const { isOpen, nextChange } = getStoreStatus(store.hours);
  const hours = parseStoreHours(store.hours);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[80px] pb-[60px] px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-black rounded-lg p-8 shadow-xl">
            {/* Store Header */}
            <div className="mb-8">
              <h1 className="text-4xl text-[#FFD700] font-bold mb-4 tracking-tight">
                {getFormattedProductName(store)}
              </h1>
              <h2 className="text-2xl text-white mb-4 opacity-90">
                {store.name}
              </h2>
              <p className="text-gray-400">{store.address}</p>
              <div className="mt-4">
                <StarRating rating={store.rating} numReviews={store.numReviews} size="large" />
              </div>
            </div>

            {/* Store Details Section */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Hours */}
              <div className="bg-white/10 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`${styles.statusDot} ${isOpen ? styles.open : styles.closed}`} />
                  <span className="text-white text-lg font-medium"> {/* Increased text size */}
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                  <span className="text-gray-400 mx-2 text-lg">•</span> {/* Increased text size */}
                  <span className="text-gray-400 text-lg">{nextChange}</span> {/* Increased text size */}
                </div>
                
                <div className="space-y-2"> {/* Increased vertical spacing */}
                  {Object.entries(hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-400 w-20 text-base font-medium">{day}</span> {/* Increased text size and width */}
                      <span className="text-white text-base">{time}</span> {/* Increased text size */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Price and Specifications */}
              <div className="bg-white/10 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                  ${store.price.toLocaleString()}
                </h2>
                
                <div>
                  <h3 className="text-gray-400 mb-2">Specifications</h3>
                  <ul className="space-y-2">
                    <li className="text-white">Purity: {store.purity}K Gold</li>
                    <li className="text-white">Color: {store.color}</li>
                    <li className="text-white">Style: {store.style}</li>
                    <li className="text-white">Thickness: {store.thickness}</li>
                    <li className="text-white">Length: {store.length}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <Link
                href={{
                  pathname: '/Map',
                  query: { storeId: store.id }
                }}
                className="bg-black text-[#FFD700] border border-[#FFD700] px-6 py-3 rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors"
              >
                View on Map
              </Link>
              
              <a 
                href={`https://maps.google.com/?q=${store.lat},${store.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
              >
                Get Directions On Google Maps
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;