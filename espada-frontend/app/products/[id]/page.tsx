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
  getFormattedProductName
} from '../../data/stores';
import styles from './ProductPage.module.css';
import { StarRating } from '@/app/components/StarRating';
import { motion } from 'framer-motion';

const ProductPage = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get all products first
        const products = await fetchProducts();
        const productData = products.find(p => p.productId === productId);
        
        if (!productData) {
          setError('Product not found');
          return;
        }

        // Then get the store info
        const stores = await fetchStores();
        const storeData = stores.find(s => s.id === productData.storeId);

        if (!storeData) {
          setError('Store not found');
          return;
        }

        setProduct(productData);
        setStore(storeData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error loading data');
      }
    };

    loadData();
  }, [productId]);

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

  const { isOpen, nextChange } = getStoreStatus(store.hours);

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
              <h2 className="text-2xl text-white mb-4 opacity-90">
                {store.name}
              </h2>
            </div>

            {/* Product Details */}
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
                ${product.price.toLocaleString()}
              </h2>
              
              <div>
                <h3 className="text-gray-400 mb-2">Specifications</h3>
                <ul className="space-y-2">
                  <li className="text-white">Purity: {product.purity}K Gold</li>
                  <li className="text-white">Color: {product.color}</li>
                  <li className="text-white">Style: {product.style}</li>
                  <li className="text-white">Thickness: {product.thickness}</li>
                  <li className="text-white">Length: {product.length}</li>
                  <li className="text-white">Weight: {product.weight} g</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <Link
                href={`/stores/${store.id}`}
                className="bg-black text-[#FFD700] border border-[#FFD700] px-6 py-3 rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors"
              >
                View Store Details
              </Link>
              <Link
                href={{
                  pathname: '/Map',
                  query: { storeId: store.id }
                }}
                className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
              >
                View Store on Map
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;