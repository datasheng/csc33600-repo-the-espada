"use client"
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Search.module.css';
import { motion } from 'framer-motion';
import { StarRating } from '../components/StarRating';
import { 
  Store, 
  Product,
  fetchStores, 
  fetchProducts,
  getStoreStatus, 
  getFormattedProductName,
  CHAIN_TYPES,
  CHAIN_COLORS,
  GOLD_PURITIES,
  PriceHistory,
  fetchPriceHistory
} from '../data/stores';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CustomListbox from '../components/CustomListbox';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    goldPurity: "",
    chainStyle: "",
    chainColor: "", // Updated from color
    chainThickness: "", // Updated from thickness
    chainLength: "", // Updated from length
  });
  const [showResults, setShowResults] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollOffset = 85;

  // Add new state for price sorting
  const [priceSort, setPriceSort] = useState<"" | "lowToHigh" | "highToLow">("");

  // Add priceHistory state
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

  // Load stores and products
  useEffect(() => {
    const loadData = async () => {
      const [storeData, productData] = await Promise.all([
        fetchStores(),
        fetchProducts()
      ]);
      setStores(storeData);
      setProducts(productData);
      
      // Add this line
      if (productData.length > 0) {
        const priceHistoryData = await fetchPriceHistory(productData[0].productID);
        setPriceHistory(priceHistoryData);
      }
    };
    loadData();
  }, []);

  // Handle filters from URL
  useEffect(() => {
    const filterType = searchParams.get('filter');
    const filterValue = searchParams.get('value');
    const showResults = searchParams.get('showResults');

    if (filterType && filterValue !== null && showResults === 'true') {
      setFilters(prev => ({
        ...prev,
        [filterType]: filterValue
      }));

      // Update filter logic to use new field names
      const filtered = products.filter(product => {
        if (filterType === 'goldPurity' && filterValue) {
          return product.chain_purity === filterValue;
        }
        if (filterType === 'chainStyle' && filterValue) {
          return product.chain_type === filterValue;
        }
        if (filterType === 'chainColor' && filterValue) {
          return product.chain_color === filterValue;
        }
        return true;
      });

      setFilteredProducts(filtered);
      setShowResults(true);

      // Scroll to results
      setTimeout(() => {
        if (resultsRef.current) {
          const elementPosition = resultsRef.current.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - scrollOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [products, searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Add handler function
  const handlePriceSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setPriceSort(value as "" | "lowToHigh" | "highToLow");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update product filtering to use correct property names
    const filtered = products.filter(product => {
      if (filters.goldPurity && product.chain_purity !== filters.goldPurity) return false;
      if (filters.chainStyle && product.chain_type !== filters.chainStyle) return false;
      if (filters.chainThickness && product.chain_thickness !== parseFloat(filters.chainThickness)) return false;
      if (filters.chainLength && product.chain_length !== parseFloat(filters.chainLength)) return false;
      if (filters.chainColor && product.chain_color !== filters.chainColor) return false;
      return true;
    });

    setFilteredProducts(filtered);
    setShowResults(true);
  };

  // Add getRelativeTimeString function
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[80px] pb-[60px] px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-8 text-center">
            Search For Solid Gold Chains
          </h1>

          <div className="bg-black rounded-lg p-8 shadow-xl">
            <div className="grid grid-cols-1 gap-8 mb-8">
              {/* Chain Style Filter - First */}
              <div className="space-y-4">
                <label className="text-[#FFD700] text-lg font-medium">Chain Type</label>
                <div className={styles.scrollContainer}> {/* Changed from overflow-x-auto */}
                  <div className={styles.scrollContent}> {/* Changed from flex gap-4 min-w-min */}
                    {[
                      { id: '', name: 'ALL TYPES', image: '/chaindisplay/all-chains.png' },
                      { id: 'Anchor', name: 'ANCHOR', image: '/chaindisplay/anchor.png' },
                      { id: 'Ball', name: 'BALL', image: '/chaindisplay/ball.png' },
                      { id: 'Box', name: 'BOX', image: '/chaindisplay/box.png' },
                      { id: 'Byzantine', name: 'BYZANTINE', image: '/chaindisplay/byzantine.png' },
                      { id: 'Cable', name: 'CABLE', image: '/chaindisplay/cable.png' },
                      { id: 'Figaro', name: 'FIGARO', image: '/chaindisplay/figaro.png' },
                      { id: 'Figarope', name: 'FIGAROPE', image: '/chaindisplay/figarope.png' },
                      { id: 'FlatCurb', name: 'FLAT CURB', image: '/chaindisplay/flat-curb.png' },
                      { id: 'Franco', name: 'FRANCO', image: '/chaindisplay/franco.png' },
                      { id: 'Herringbone', name: 'HERRINGBONE', image: '/chaindisplay/herringbone.png' },
                      { id: 'Mariner', name: 'MARINER', image: '/chaindisplay/mariner.png' },
                      { id: 'MiamiCuban', name: 'MIAMI CUBAN', image: '/chaindisplay/miami-cuban.png' },
                      { id: 'MoonCut', name: 'MOON CUT', image: '/chaindisplay/moon-cut.png' },
                      { id: 'Rope', name: 'ROPE', image: '/chaindisplay/rope.png' },
                      { id: 'Wheat', name: 'WHEAT', image: '/chaindisplay/wheat.png' }
                    ].map((chain) => (
                      <motion.div
                        key={chain.id}
                        onClick={() => handleFilterChange({
                          target: { name: 'chainStyle', value: chain.id }
                        } as React.ChangeEvent<HTMLSelectElement>)}
                        className={`${styles.chainTypeSelector} ${filters.chainStyle === chain.id ? styles.selected : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={styles.chainImageWrapper}>
                          <div className="relative w-full h-full">
                            <Image
                              src={chain.image}
                              alt={chain.name}
                              fill
                              sizes="120px"
                              className={styles.chainImage}
                            />
                          </div>
                        </div>
                        <span className={styles.chainName}>{chain.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add a div to group Color and Purity filters with smaller gap */}
              <div className="grid grid-cols-1 gap-0"> {/* Reduced gap from 8 to 2 */}
                {/* Chain Color Filter - Second */}
                <div className="space-y-4">
                  <label className="text-[#FFD700] text-lg font-medium">Chain Color</label>
                  <div className={styles.scrollContainer}>
                    <div className={styles.scrollContent}>
                      {[
                        { id: '', name: 'ALL COLORS', color: 'linear-gradient(45deg, #FFD700, #FFA500, #FFFFFF)' },
                        { id: 'Yellow', name: 'YELLOW GOLD', color: '#FFD700' },
                        { id: 'Rose', name: 'ROSE GOLD', color: '#B76E79' },
                        { id: 'White', name: 'WHITE GOLD', color: '#E8E8E8' },
                        { id: 'Two-Color', name: 'TWO-TONE', color: 'linear-gradient(45deg, #FFD700 50%, #E8E8E8 50%)' },
                        { id: 'Tri-Color', name: 'TRI-COLOR', color: 'linear-gradient(45deg, #FFD700 33%, #B76E79 33% 66%, #E8E8E8 66%)' },
                      ].map((colorOption) => (
                        <motion.div
                          key={colorOption.id}
                          onClick={() => handleFilterChange({
                            target: { name: 'chainColor', value: colorOption.id }
                          } as React.ChangeEvent<HTMLSelectElement>)}
                          className={`${styles.chainTypeSelector} ${filters.chainColor === colorOption.id ? styles.selected : ''}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={styles.chainImageWrapper}>
                            <div 
                              className={styles.colorCircle}
                              style={{
                                background: colorOption.color
                              }}
                            />
                          </div>
                          <span className={styles.chainName}>{colorOption.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gold Purity Filter - Third */}
                <div className="space-y-2">
                  <label className="text-[#FFD700] text-lg font-medium">Gold Purity</label>
                  <CustomListbox
                    options={[
                      { value: '', label: 'All Purities' },
                      { value: '10', label: '10K Gold' },
                      { value: '14', label: '14K Gold' },
                      { value: '18', label: '18K Gold' },
                      { value: '22', label: '22K Gold' },
                      { value: '24', label: '24K Pure Gold' },
                    ]}
                    value={filters.goldPurity}
                    onChange={(value) => handleFilterChange({
                      target: { name: 'goldPurity', value }
                    } as React.ChangeEvent<HTMLSelectElement>)}
                    label="Gold Purity"
                  />
                </div>
              </div>

              {/* Chain Thickness and Length side by side - Fourth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chain Thickness Filter */}
                <div className="space-y-2">
                  <label className="text-[#FFD700] text-lg font-medium">Chain Thickness</label>
                  <CustomListbox
                    options={[
                      { value: '', label: 'All Thicknesses' },
                      ...Array.from({ length: 39 }, (_, i) => {
                        const thickness = (i + 2) / 2;
                        return {
                          value: thickness.toString(),
                          label: `${thickness} mm`
                        };
                      })
                    ]}
                    value={filters.chainThickness}
                    onChange={(value) => handleFilterChange({
                      target: { name: 'chainThickness', value }
                    } as React.ChangeEvent<HTMLSelectElement>)}
                    label="Chain Thickness"
                  />
                </div>

                {/* Chain Length Filter */}
                <div className="space-y-2">
                  <label className="text-[#FFD700] text-lg font-medium">Chain Length</label>
                  <CustomListbox
                    options={[
                      { value: '', label: 'All Lengths' },
                      ...Array.from({ length: 8 }, (_, i) => {
                        const length = 16 + (i * 2);
                        return {
                          value: `${length}`,
                          label: `${length} inches`
                        };
                      })
                    ]}
                    value={filters.chainLength}
                    onChange={(value) => handleFilterChange({
                      target: { name: 'chainLength', value }
                    } as React.ChangeEvent<HTMLSelectElement>)}
                    label="Chain Length"
                  />
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={styles.searchButton}
            >
              Find Gold Chains
            </motion.button>

            {/* Results Section */}
            {showResults && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Found {filteredProducts.length} Results
                  </h2>
                  <div className="flex items-center">
                    <select
                      value={priceSort}
                      onChange={handlePriceSortChange}
                      className={styles.priceSort}
                    >
                      <option value="">Sort by Price</option>
                      <option value="lowToHigh">Lowest to Highest</option>
                      <option value="highToLow">Highest to Lowest</option>
                    </select>
                  </div>
                </div>
                
                {/* Sort and map products */}
                {[...filteredProducts]
                  .sort((a, b) => {
                    if (priceSort === "lowToHigh") {
                      return a.set_price - b.set_price;
                    } else if (priceSort === "highToLow") {
                      return b.set_price - a.set_price;
                    }
                    return 0;
                  })
                  .map((product) => {
                    const store = stores.find(s => s.storeID === product.storeID); // Changed from id/storeId
                    if (!store) return null;
                    return (
                      <motion.div
                        key={product.productID} // Changed from productId
                        className="bg-white/10 rounded-lg p-6 hover:bg-white/15 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            {/* Product details (name, store, etc.) */}
                            <h2 className="text-2xl text-white font-bold mb-2 tracking-tight">
                              {getFormattedProductName(product)}
                            </h2>
                            <Link 
                              href={`/stores/${store.storeID}`}
                              className="text-xl font-bold text-[#FFD700] mb-2 italic hover:text-[#e6c200] transition-colors inline-block"
                            >
                              {store.store_name}
                            </Link>
                            <p className="text-gray-400 text-sm mb-2">
                              {store.address}
                            </p>
                            <StarRating 
                              rating={store.rating} 
                              size="medium"
                              numReviews={store.rating_count}
                            />
                          </div>

                          {/* Vertical divider between product details and prices */}
                          <div className="h-36 w-px bg-gray-600 mx-8"></div>

                          <div className="text-right flex flex-col items-end gap-4">
                            <div className="flex items-center gap-8">
                              {/* Latest Price Report */}
                              {priceHistory && priceHistory[0] ? (
                                <div className="flex flex-col items-end gap-1">
                                  <div className="text-white text-base">Latest Purchase By Users</div>
                                  <div className="text-3xl font-bold text-[#FFD700]">
                                    ${Number(priceHistory[0].latest_price).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </div>
                                  <span className="text-gray-400 text-xl">By {priceHistory[0].full_name}</span>
                                  <span className="text-gray-300 text-lg">
                                  {getRelativeTimeString(new Date(priceHistory[0].purchase_date))}
                                  </span>
                                </div>
                              ) : null}

                              {/* Center divider between prices */}
                              <div className="h-36 w-px bg-gray-600"></div>

                              {/* Set Price and View Details */}
                              <div className="flex flex-col items-end gap-4">
                                <div>
                                  <div className="text-white text-base mb-2">Price Set By Store</div>
                                  <div className="text-3xl font-bold text-[#FFD700]">
                                    ${product.set_price.toLocaleString()}
                                  </div>
                                </div>
                                <button
                                  onClick={() => router.push(`/products/${product.productID}`)}
                                  className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                
                {filteredProducts.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <p>No chains found matching your criteria.</p>
                    <p className="mt-2">Try adjusting your filters.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SearchPage;