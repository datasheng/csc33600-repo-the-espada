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
  fetchUserRating,
  getStoreStatus, 
  getFormattedProductName,
  submitRating,
  fetchRatingDistribution,
  RatingDistribution,  // Add this import
  DAYS_OF_WEEK  // Add this import
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

// Update RatingSection to use local login check
const RatingSection: React.FC<{
  rating: number;
  userRating: number;
  onRatingSubmit: (rating: number) => Promise<void>;
  isSubmitting: boolean;
  ratingDistribution: RatingDistribution;  // Add this prop
}> = ({ rating, userRating, onRatingSubmit, isSubmitting, ratingDistribution }) => {
  const router = useRouter();
  const [currentUserRating, setCurrentUserRating] = useState(userRating);
  const isLoggedIn = typeof localStorage !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    console.log('RatingSection received userRating:', userRating);
    setCurrentUserRating(userRating);
  }, [userRating]);

  const handleRatingChange = async (newRating: number) => {
    try {
      setCurrentUserRating(newRating);
      await onRatingSubmit(newRating);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      setCurrentUserRating(userRating); // Reset to user's saved rating on error
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex gap-8">
        {/* Login Required Box */}
        <div className="bg-white/10 rounded-lg p-6 w-[40%]">
          <h3 className="text-xl text-white font-bold mb-4">Rate this Store</h3>
          <div className="space-y-4">
            <div className="flex flex-col items-start gap-2">
              <label className="text-gray-400">Your Rating:</label>
              <StarRating rating={0} size="large" readonly />
            </div>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-[#FFD700] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
            >
              Log In To Rate This Store
            </button>
          </div>
        </div>

        {/* Rating Distribution Box - Same as logged in version */}
        <div className="bg-white/10 rounded-lg p-6 w-[60%]">
          <h3 className="text-xl text-white font-bold mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-gray-400 w-16">{stars} Stars</span>
                <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FFD700] rounded-full"
                    style={{ 
                      width: `${(ratingDistribution[stars as keyof RatingDistribution] / 
                        Object.values(ratingDistribution).reduce((a, b) => a + b, 0)) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-gray-400 w-8 text-right">
                  {ratingDistribution[stars as keyof RatingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      {/* Your Rating Box */}
      <div className="bg-white/10 rounded-lg p-6 w-[40%] flex flex-col justify-center"> {/* Added flex and justify-center */}
        <div className="flex flex-col items-center gap-4"> {/* Increased gap and made it a flex container */}
          <h3 className="text-xl text-white font-bold text-center">Rate this Store</h3>
          <div className="flex flex-col items-center gap-3"> {/* Increased gap */}
            <label className="text-gray-400">Your Rating:</label>
            <StarRating 
              rating={currentUserRating}
              size="large"
              onRatingSubmit={handleRatingChange}
              readonly={isSubmitting}
            />
            {isSubmitting && (
              <p className="text-[#FFD700] text-sm text-center">Submitting your rating...</p>
            )}
          </div>
        </div>
      </div>

      {/* Rating Distribution Box */}
      <div className="bg-white/10 rounded-lg p-6 w-[60%]">
        <h3 className="text-xl text-white font-bold mb-4">Rating Distribution</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-gray-400 w-16">{stars} Stars</span>
              <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FFD700] rounded-full"
                  style={{ 
                    width: `${(ratingDistribution[stars as keyof RatingDistribution] / 
                      Object.values(ratingDistribution).reduce((a, b) => a + b, 0)) * 100}%` 
                    }}
                />
              </div>
              <span className="text-gray-400 w-8 text-right">
                {ratingDistribution[stars as keyof RatingDistribution]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Update StoreContent props
const StoreContent: React.FC<{ 
  store: Store; 
  hours: StoreHours[]; 
  products: Product[];
  onRatingSubmit: (rating: number) => Promise<void>;
  isSubmitting: boolean;
  userRating: number;
  ratingDistribution: RatingDistribution;  // Add this prop
}> = ({ store, hours, products, onRatingSubmit, isSubmitting, userRating, ratingDistribution }) => {
  console.log('[StoreContent] Received userRating:', userRating);
  
  const { isOpen, nextChange } = getStoreStatus(hours);

  return (
    <div className="bg-black rounded-lg p-8 shadow-xl">
      {/* Store Header */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-5 gap-8"> {/* Changed from cols-3 to cols-5 */}
        {/* Store Info - Takes up 2 columns */}
        <div className="lg:col-span-2"> {/* Changed from col-span-1 to col-span-2 */}
          <h1 className="text-4xl text-[#FFD700] font-bold mb-4 tracking-tight">
            {store.store_name}
          </h1>
          
          <div className="mb-6">
            <StarRating 
              rating={store.rating} 
              size="large"
              readonly={true}
              numReviews={store.rating_count} // Changed from ratingCount
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
        </div>

        {/* Rating Sections - Takes up 3 columns */}
        <div className="lg:col-span-3"> {/* Changed from col-span-2 to col-span-3 */}
          <RatingSection
            rating={store.rating}
            userRating={userRating} // Pass user's personal rating
            onRatingSubmit={onRatingSubmit}
            isSubmitting={isSubmitting}
            ratingDistribution={ratingDistribution}
          />
        </div>
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
            const hourData = hours.find(h => h.daysOpen === day);
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
              query: { storeID: store.storeID }
            }}
            className="bg-black text-[#FFD700] border border-[#FFD700] px-6 py-3 rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors w-full text-center"
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPersonalRating, setUserPersonalRating] = useState<number>(0);
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution>({ 
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0 
  });
  const params = useParams();
  const storeId = params.id as string;
  const isLoggedIn = typeof localStorage !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
  const userId = isLoggedIn ? Number(localStorage.getItem('userId')) : null;

  // Add function to refresh store data
  const refreshStoreData = async () => {
    try {
      const stores = await fetchStores();
      const storeData = stores.find(s => s.storeID.toString() === storeId);
      if (storeData) {
        setStore(storeData);
      }
    } catch (error) {
      console.error('Error refreshing store data:', error);
    }
  };

  const handleRatingSubmit = async (rating: number) => {
    if (!isLoggedIn || !store || isSubmitting || products.length === 0 || !userId) return;
    
    try {
      setIsSubmitting(true);
      
      // Submit rating to backend
      await submitRating(
        store.storeID,
        products[0].productID,
        userId,
        rating
      );

      // Refresh store data to get updated rating
      await refreshStoreData();
      
      // Fetch updated rating distribution
      const newDistribution = await fetchRatingDistribution(store.storeID);
      setRatingDistribution(newDistribution);
      
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get userId from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      console.log('[StorePage] Stored userId:', storedUserId);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const storedUserId = localStorage.getItem('userId');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        console.log('👤 [StorePage] Auth Info:', {
          isLoggedIn,
          userId: storedUserId
        });

        const [stores, hoursData, productsData] = await Promise.all([
          fetchStores(),
          fetchStoreHours(parseInt(storeId)),
          fetchProducts()
        ]);

        const storeData = stores.find(s => s.storeID.toString() === storeId);
        
        if (!storeData) {
          setError('Store not found');
          return;
        }

        // Filter products for this store
        const storeProducts = productsData.filter(p => p.storeID === storeData.storeID);

        // Set all the data
        setStore(storeData);
        setHours(hoursData);
        setProducts(storeProducts);

        // Fetch rating distribution
        const distribution = await fetchRatingDistribution(storeData.storeID);
        setRatingDistribution(distribution);

        // Only fetch user rating if user is logged in and we have a userId
        if (isLoggedIn && storedUserId) {
          try {
            const userId = parseInt(storedUserId);
            console.log('⭐ [StorePage] Fetching rating:', { 
              storeId: storeData.storeID, 
              userId 
            });
            
            const userRatingData = await fetchUserRating(storeData.storeID, userId);
            console.log('✅ [StorePage] Received rating:', userRatingData);
            
            setUserPersonalRating(userRatingData);
          } catch (error) {
            console.error('❌ [StorePage] Rating fetch error:', error);
          }
        } else {
          console.log('⚠️ [StorePage] Not fetching rating - user not authenticated');
        }

      } catch (err) {
        console.error('[StorePage] Error:', err);
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
              <StoreContent 
                store={store} 
                hours={hours} 
                products={products}
                onRatingSubmit={handleRatingSubmit}
                isSubmitting={isSubmitting}
                userRating={userPersonalRating}
                ratingDistribution={ratingDistribution} // Use actual distribution
              />
            ) : null}
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StorePage;