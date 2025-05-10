"use client"
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { StarRating } from '@/app/components/StarRating';
import { 
  Store, 
  Product,
  StoreHours,
  fetchStores,
  fetchStoreHours,
  fetchProducts,
  getStoreStatus, 
  getFormattedProductName
} from '../../data/stores';
import styles from './StorePage.module.css';
import { motion } from 'framer-motion';

// Loading component
const LoadingState = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <main className="pt-[80px] pb-[60px] px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    </main>
    <Footer />
  </div>
);

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
];

const StoreContent: React.FC<{ 
  store: Store; 
  hours: StoreHours[]; 
  products: Product[]; 
}> = ({ store, hours, products }) => {
  const { isOpen, nextChange } = getStoreStatus(hours);

  return (
    <div className="bg-black rounded-lg p-8 shadow-xl">
      {/* Store Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-[#FFD700] font-bold mb-4 tracking-tight">
          {store.store_name}
        </h1>
        
        <div className="mb-6">
          <StarRating 
            rating={store.rating} 
            size="large"
            // numReviews={store.numReviews}  // To be implemented in the future
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-3 mb-8">
          {/* Changed from lat/lng */}
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
        </div>

        {/* Store Status and Hours */}
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <span className={`${styles.statusDot} ${isOpen ? styles.open : styles.closed}`} />
            <span className="text-white text-lg font-medium">
              {isOpen ? 'Open' : 'Closed'}
            </span>
            <span className="text-gray-400 mx-2 text-lg">•</span>
            <span className="text-gray-400 text-lg">{nextChange}</span>
          </div>
          
          {/* Business Hours */}
          <div className="space-y-2 mb-6">
            {DAYS_OF_WEEK.map((day) => {
              const hourData = hours.find(h => h.day === day);
              return (
                <div key={day} className="flex justify-between">
                  <span className="text-gray-400 w-24 text-base font-medium">
                    {day}
                  </span>
                  <span className="text-white text-base">
                    {hourData 
                      ? `${hourData.openTime} - ${hourData.closeTime}`
                      : 'Closed'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Link
              href={{
                pathname: '/map',
                query: { storeId: store.storeID }
              }}
              className="bg-black text-[#FFD700] border border-[#FFD700] px-6 py-3 rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors w-full text-center"
            >
              View Store on Map
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div>
        <h2 className="text-2xl text-white font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.productID}
              className="bg-white/10 rounded-lg p-6 hover:bg-white/15 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl text-white font-bold mb-3">
                {getFormattedProductName(product)}
              </h3>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-[#FFD700]">
                  ${product.set_price.toLocaleString()}
                </span>
                <Link
                  href={`/products/${product.productID}`}
                  className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
                >
                  View Product
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StorePage: React.FC = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [hours, setHours] = useState<StoreHours[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const storeId = params.id as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Fetch store data
        const stores = await fetchStores();
        const storeData = stores.find(s => s.storeID.toString() === storeId);
        
        if (!storeData) {
          setError('Store not found');
          return;
        }

        // Fetch hours and products
        const [hoursData, productsData] = await Promise.all([
          fetchStoreHours(storeData.storeID),
          fetchProducts()
        ]);

        const storeProducts = productsData.filter(p => p.storeID === storeData.storeID);
        
        setStore(storeData);
        setHours(hoursData);
        setProducts(storeProducts);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error loading data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storeId]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[80px] pb-[60px] px-4">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<LoadingState />}>
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : store && hours && products ? (
              <StoreContent store={store} hours={hours} products={products} />
            ) : null}
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StorePage;