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
  fetchStores,
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

const StoreContent = ({ store, products }: { store: Store, products: Product[] }) => {
  const { isOpen, nextChange } = getStoreStatus(store.hours);

  return (
    <div className="bg-black rounded-lg p-8 shadow-xl">
      {/* Store Info Section */}
      <div className="mb-8">
        <h1 className="text-4xl text-[#FFD700] font-bold mb-4 tracking-tight">
          {store.name}
        </h1>
        
        <div className="mb-4">
          <StarRating rating={store.rating} numReviews={store.numReviews} size="large" />
        </div>

        <a 
          href={`https://maps.google.com/?q=${store.lat},${store.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors mb-4 block"
        >
          {store.address}
        </a>

        {/* Store Status and Hours */}
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`${styles.statusDot} ${isOpen ? styles.open : styles.closed}`} />
            <span className="text-white text-lg font-medium">
              {isOpen ? 'Open' : 'Closed'}
            </span>
            <span className="text-gray-400 mx-2 text-lg">•</span>
            <span className="text-gray-400 text-lg">{nextChange}</span>
          </div>
          
          {/* Business Hours */}
          <div className="space-y-2 mb-6">
            {store.hours.map((hour) => (
              <div key={hour.day} className="flex justify-between">
                <span className="text-gray-400 w-20 text-base font-medium">
                  {hour.day}
                </span>
                <span className="text-white text-base">
                  {hour.isClosed ? 'Closed' : `${hour.open} - ${hour.close}`}
                </span>
              </div>
            ))}
          </div>

          {/* View Store on Map button */}
          <Link
            href={{
              pathname: '/Map',
              query: { storeId: store.id }
            }}
            className="bg-black text-[#FFD700] border border-[#FFD700] px-6 py-3 rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors w-full text-center block"
          >
            View Store on Map
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <div>
        <h2 className="text-2xl text-white font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.productId}
              className="bg-white/10 rounded-lg p-6 hover:bg-white/15 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl text-white font-bold mb-3">
                {getFormattedProductName(product)}
              </h3>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-[#FFD700]">
                  ${product.price.toLocaleString()}
                </span>
                <Link
                  href={`/products/${product.productId}`}
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

const StorePage = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const storeId = params.id as string;
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [stores, allProducts] = await Promise.all([
          fetchStores(),
          fetchProducts()
        ]);
        
        const storeData = stores.find(s => s.id === storeId);
        if (!storeData) {
          setError('Store not found');
          return;
        }

        const storeProducts = allProducts.filter(p => p.storeId === storeId);
        setStore(storeData);
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
            ) : store && products ? (
              <StoreContent store={store} products={products} />
            ) : null}
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StorePage;