"use client"
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Search.module.css';
import { motion } from 'framer-motion';
import { StarRating } from '../components/StarRating';
import { 
  Store, 
  fetchStores, 
  getStoreStatus, 
  parseStoreHours,
  getFormattedProductName // Add this import
} from '../data/stores';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    goldPurity: "",
    chainStyle: "",
    color: "",
    thickness: "",
    length: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [isClient, setIsClient] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollOffset = 85; // Adjust this value to control scroll position

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const loadStores = async () => {
      const storeData = await fetchStores();
      setStores(storeData);
    };
    loadStores();
  }, []);

  useEffect(() => {
    const filterType = searchParams.get('filter');
    const filterValue = searchParams.get('value');
    const showResults = searchParams.get('showResults');

    if (filterType && filterValue !== null && showResults === 'true') {
      // Set the initial filter
      setFilters(prev => ({
        ...prev,
        [filterType]: filterValue
      }));

      // For empty filter value, show all results
      if (filterValue === '') {
        setFilteredStores(stores);
        setShowResults(true);
      } else {
        // Filter results for specific value
        const filtered = stores.filter(store => {
          if (filterType === 'goldPurity') {
            return filterValue === '' || store.purity === parseInt(filterValue);
          }
          if (filterType === 'chainStyle') {
            return filterValue === '' || store.style === filterValue;
          }
          return true;
        });

        setFilteredStores(filtered);
        setShowResults(true);
      }

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
  }, [stores, searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtered = stores.filter(store => {
      if (filters.goldPurity && store.purity !== parseInt(filters.goldPurity)) return false;
      if (filters.chainStyle && store.style !== filters.chainStyle) return false;
      if (filters.thickness && store.thickness !== filters.thickness) return false;
      if (filters.length && store.length !== filters.length) return false;
      if (filters.color && store.color !== filters.color) return false;
      return true;
    });

    setFilteredStores(filtered);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[80px] pb-[60px] px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-8 text-center">
            Search For Solid Gold Chains
          </h1>

          {isClient && (
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
                              target: { name: 'color', value: colorOption.id }
                            } as React.ChangeEvent<HTMLSelectElement>)}
                            className={`${styles.chainTypeSelector} ${filters.color === colorOption.id ? styles.selected : ''}`}
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
                    <select
                      name="goldPurity"
                      value={filters.goldPurity}
                      onChange={handleFilterChange}
                      className={styles.filterSelect}
                    >
                      <option value="">All Purities</option>
                      <option value="10">10K Gold</option>
                      <option value="14">14K Gold</option>
                      <option value="18">18K Gold</option>
                      <option value="22">22K Gold</option>
                      <option value="24">24K Pure Gold</option>
                    </select>
                  </div>
                </div>

                {/* Chain Thickness and Length side by side - Fourth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Chain Thickness Filter */}
                  <div className="space-y-2">
                    <label className="text-[#FFD700] text-lg font-medium">Chain Thickness</label>
                    <select
                      name="thickness"
                      value={filters.thickness}
                      onChange={handleFilterChange}
                      className={styles.filterSelect}
                    >
                      <option value="">All Thicknesses</option>
                      {Array.from({ length: 39 }, (_, i) => (i + 2) / 2).map(thickness => (
                        <option key={thickness} value={`${thickness} mm`}>
                          {thickness} mm
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chain Length Filter */}
                  <div className="space-y-2">
                    <label className="text-[#FFD700] text-lg font-medium">Chain Length</label>
                    <select
                      name="length"
                      value={filters.length}
                      onChange={handleFilterChange}
                      className={styles.filterSelect}
                    >
                      <option value="">All Lengths</option>
                      {Array.from({ length: 8 }, (_, i) => 16 + (i * 2)).map(length => (
                        <option key={length} value={`${length} in`}>
                          {length} inches
                        </option>
                      ))}
                    </select>
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
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Found {filteredStores.length} Results
                  </h2>
                  
                  {filteredStores.map((store) => (
                    <motion.div
                      key={store.id}
                      className="bg-white/10 rounded-lg p-6 hover:bg-white/15 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl text-[#FFD700] font-bold mb-2 tracking-tight">
                            {getFormattedProductName(store)}
                          </h2>
                          <h3 className="text-xl font-bold text-white mb-2 italic">
                            {store.name}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">
                            {store.address}
                          </p>
                          <StarRating rating={store.rating} numReviews={store.numReviews} size="medium" />
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`${styles.statusDot} ${getStoreStatus(store.hours).isOpen ? styles.open : styles.closed}`} />
                            <span className="text-gray-400 text-sm">
                              {getStoreStatus(store.hours).isOpen ? 'Open' : 'Closed'}
                            </span>
                            <span className="text-gray-600 mx-1">•</span>
                            <span className="text-gray-400 text-sm">
                              {getStoreStatus(store.hours).nextChange}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-4">
                          <div className="text-3xl font-bold text-[#FFD700]">
                            ${store.price.toLocaleString()}
                          </div>
                          <button
                            onClick={() => router.push(`/products/${store.id}`)}
                            className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
                          >
                            View More Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredStores.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <p>No chains found matching your criteria.</p>
                      <p className="mt-2">Try adjusting your filters.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SearchPage;