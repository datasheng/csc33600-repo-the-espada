"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Store, 
  Product,
  fetchStores,
  fetchProducts,
  getStoreStatus, 
  getFormattedProductName,
  fetchStoreHours,
  StoreHours
} from '../../data/stores';
import styles from './ProductPage.module.css';
import { StarRating } from '@/app/components/StarRating';
import { motion } from 'framer-motion';

const ProductPage = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [hours, setHours] = useState<StoreHours[]>([]);  // Changed from any | null
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const productID = parseInt(params.id as string, 10);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get all products first
        const products = await fetchProducts();
        const productData = products.find(p => p.productID === productID);  // Changed from productId
        
        if (!productData) {
          setError('Product not found');
          return;
        }

        // Then get the store info and hours
        const stores = await fetchStores();
        const storeData = stores.find(s => s.storeID === productData.storeID);  // Changed from id/storeId

        if (!storeData) {
          setError('Store not found');
          return;
        }

        // Fetch store hours
        const hoursData = await fetchStoreHours(storeData.storeID);

        setProduct(productData);
        setStore(storeData);
        setHours(hoursData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error loading data');
      }
    };

    loadData();
  }, [productID]);

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

  // Update the getStoreStatus call to use the hours state instead of store.hours
  const { isOpen, nextChange } = getStoreStatus(hours);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[80px] pb-[60px] px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-black rounded-lg p-8 shadow-xl">
            {/* Product Header */}
            <div className="mb-8">
              <h1 className="text-4xl text-[#FFD700] font-bold mb-4 tracking-tight">
                {getFormattedProductName(product)}
              </h1>
              <h2 className="text-2xl text-white mb-2 opacity-90">
                {store.store_name}  {/* Changed from name */}
              </h2>
              <div className="mb-2">
                <StarRating 
                  rating={store.rating} 
                  size="medium"
                  numReviews={store.rating_count} // Add this line
                />
              </div>
              <p className="text-gray-400">
                {store.address}
              </p>
              
              {/* Store Hours Status */}
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

            {/* Product Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specifications Container */}
              <div className="bg-white/10 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                  Price: ${product.set_price.toLocaleString()}
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

              {/* Latest Purchases Container */}
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-gray-400 mb-4">Latest Purchases</h3>
                <div className="bg-black/30 rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-black/50 text-gray-400">
                        <th className="py-2 px-4 text-left text-sm font-semibold">User</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold">Date</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-2 px-4 text-white text-sm">John Doe</td>
                        <td className="py-2 px-4 text-gray-400 text-sm">2023-09-15</td>
                        <td className="py-2 px-4 text-[#FFD700] font-bold text-sm">$199.99</td>
                      </tr>
                      <tr className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-2 px-4 text-white text-sm">Jane Smith</td>
                        <td className="py-2 px-4 text-gray-400 text-sm">2023-09-14</td>
                        <td className="py-2 px-4 text-[#FFD700] font-bold text-sm">$189.99</td>
                      </tr>
                      <tr className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-2 px-4 text-white text-sm">Alex Johnson</td>
                        <td className="py-2 px-4 text-gray-400 text-sm">2023-09-13</td>
                        <td className="py-2 px-4 text-[#FFD700] font-bold text-sm">$179.99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
    </div>
  );
};

export default ProductPage;