"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from './Map.module.css';
import { Map as LeafletMap, Icon, Marker } from 'leaflet';
import Image from 'next/image';
import Link from 'next/link';
// Add import for motion
import { motion } from "framer-motion"

// Add this utility function at the top of the file
import { 
  fetchStores,
  fetchProducts,
  fetchStoreHours,
  getStoreStatus, 
  CHAIN_TYPES,
  CHAIN_COLORS,
  GOLD_PURITIES,
  getFormattedProductName
} from '../data/stores';

// Change the import to use type-only import
import type { Store, Product, StoreHours, StoreStatus as IStoreStatus } from '../data/stores';

// Remove the local StarRating component and import it
import { StarRating } from '../components/StarRating';

// Add this near the top of the MapComponent
import { useSearchParams } from 'next/navigation';

// Add this to your imports at the top
import { useRouter } from 'next/navigation';

import CustomListbox from '../components/CustomListbox';

// Update CustomMarker interface to use storeID instead of id
interface CustomMarker extends Marker {
  storeID?: number;  // Changed from string to number to match database
}

const isValidIcon = (icon: Icon | null): icon is Icon => {
  return icon !== null;
};

// Rename the component to avoid conflict
const StoreStatusDisplay: React.FC<{ hours: StoreHours[] }> = ({ hours }) => {
  const { isOpen, nextChange } = getStoreStatus(hours);
  
  return (
    <div className={styles.storeStatus}>
      <span className={`${styles.statusDot} ${isOpen ? styles.open : styles.closed}`} />
      <span className={styles.statusText}>
        {isOpen ? 'Open' : 'Closed'}
      </span>
      <span className={styles.nextChange}>{nextChange}</span>
    </div>
  );
};

import Header from '../components/Header';

// ...rest of your imports

const MapComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [stores, setStores] = useState<Store[]>([]); // Add this line
  const [filters, setFilters] = useState({
    priceSort: "",
    goldPurity: "",
    chainStyle: "",
    thickness: "",
    length: "",
  });
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);  // Changed from string to number
  const [showResults, setShowResults] = useState(false);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [clickCount, setClickCount] = useState<{ [key: string]: number }>({});

  // Add these icon references at the top of your component
  const [goldIcon, setGoldIcon] = useState<Icon | null>(null);
  const [selectedGoldIcon, setSelectedGoldIcon] = useState<Icon | null>(null);

  // Add new state for current filters and pending filters
  const [currentFilters, setCurrentFilters] = useState({
    goldPurity: "",
    chainStyle: "",
    thickness: "",
    length: "",
    color: "",    // Add this
  });

  const [pendingFilters, setPendingFilters] = useState({
    goldPurity: "",
    chainStyle: "",
    thickness: "",
    length: "",
    color: "",    // Add this
  });

  // Add state for price sort in results
  const [priceSort, setPriceSort] = useState("");

  // Add new state for extended info
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);
  const [selectedStoreData, setSelectedStoreData] = useState<Store | null>(null);

  // Add new state for hours dropdown
  const [showHours, setShowHours] = useState(true);

  // Add new state for products
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Add new state for selected product ID
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const [hours, setHours] = useState<StoreHours[]>([]);

  // Add useEffect for map initialization to prevent SSR issues
  useEffect(() => {
    let isMounted = true;
  
    const initializeMap = async () => {
      try {
        if (typeof window === 'undefined') return; // Prevent SSR execution
        
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
  
        if (!isMounted) return;
  
        if (!map) {
          const newMap = L.map("map", { zoomControl: false }).setView([40.7128, -74.006], 13);
          
          L.control.zoom({ 
            position: 'bottomright',
            zoomInText: '+',
            zoomOutText: '-'
          }).addTo(newMap);
  
          L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", {
            attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>'
          }).addTo(newMap);
  
          setMap(newMap);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
  
    initializeMap();
  
    return () => {
      isMounted = false;
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Update the icon initialization useEffect
  useEffect(() => {
    const initIcons = async () => {
      if (typeof window === 'undefined') return; // Prevent SSR execution
      
      try {
        const L = (await import('leaflet')).default;
        
        const normalIcon = L.icon({
          iconUrl: "/map_images/black-marker.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
  
        const selectedIcon = L.icon({
          iconUrl: "/map_images/gold-marker.png",
          iconSize: [35, 57], // Larger size for selected state
          iconAnchor: [17, 57],
          popupAnchor: [1, -34],
        });
  
        setGoldIcon(normalIcon);
        setSelectedGoldIcon(selectedIcon);
      } catch (error) {
        console.error('Error initializing icons:', error);
      }
    };
  
    initIcons();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedValue = value;
  
    if (name === 'chain_thickness' || name === 'chain_length') {
      updatedValue = value.replace(/[^0-9.]/g, ''); // Remove units
    }
  
    setPendingFilters(prev => ({ ...prev, [name]: updatedValue }));
  };

  // Update the handlePriceSortChange function
  const handlePriceSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setPriceSort(value);
  
    // First, sort all filtered products
    let sortedProducts = [...filteredProducts];
    if (value === "") {
      // Reset to original order
      sortedProducts = [...products].filter(p => 
        filteredProducts.some(fp => fp.productID === p.productID)
      );
    } else {
      sortedProducts.sort((a, b) => {
        if (value === "lowToHigh") {
          return a.set_price - b.set_price;
        } else {
          return b.set_price - a.set_price;
        }
      });
    }
    setFilteredProducts(sortedProducts);
  };

  const clearFilters = () => {
    setPendingFilters({
      goldPurity: "",
      chainStyle: "",
      thickness: "",
      length: "",
      color: "",    // Add this
    });
    setCurrentFilters({
      goldPurity: "",
      chainStyle: "",
      thickness: "",
      length: "",
      color: "",    // Add this
    });
    if (isValidIcon(goldIcon)) {
      markers.forEach(marker => marker.setIcon(goldIcon));
    }
  };

  // Update handleStoreClick to include productId
  const handleStoreClick = async (storeID: number, productID: number) => {
    const store = stores.find(s => s.storeID === storeID);
    if (!store || !map || !isValidIcon(selectedGoldIcon)) {
      console.error('Missing required data:', { store, map, selectedGoldIcon });
      return;
    }
  
    map.setView([store.latitude, store.longitude], 15);  // Changed from lat/lng
    
    // Update marker handling
    markers.forEach(marker => {
      if (isValidIcon(goldIcon)) {
        marker.setIcon(goldIcon);
        marker.setZIndexOffset(0);
      }
    });
  
    const selectedMarker = markers.find(marker => marker.storeID === storeID);
    if (selectedMarker) {
      selectedMarker.setIcon(selectedGoldIcon);
      selectedMarker.setZIndexOffset(1000);
      bounceMarker(selectedMarker);
    }
  
    setSelectedStore(storeID);
    setSelectedStoreData(store);
    setSelectedProduct(products.find(p => p.productID === productID) || null);
    setSelectedProductId(productID);
    setShowExtendedInfo(true);
  };

  const handleApplyFilters = () => {
    setCurrentFilters(pendingFilters); // This triggers the actual filtering
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setSelectedStore(null);
    if (isValidIcon(goldIcon)) {
      markers.forEach(marker => marker.setIcon(goldIcon));
    }
  };

  // Add useEffect to fetch stores and products
  useEffect(() => {
    const loadData = async () => {
      const [storeData, productData] = await Promise.all([
        fetchStores(),
        fetchProducts()
      ]);
      setStores(storeData);
      setProducts(productData);
    };
    loadData();
  }, []);

  // Add this function at the component level
  const bounceMarker = (marker: CustomMarker) => {
    const originalLatLng = marker.getLatLng();
    const originalIcon = marker.getIcon();
    let bounce = 0;
    let direction = 1;
  
    const animation = setInterval(() => {
      bounce += (0.5 * direction); // Increased from 0.3 to 0.5 for faster bounce
      if (bounce > 3.0) direction = -1; // Increased from 1.5 to 3.0 for higher bounce
      if (bounce < 0) {
        clearInterval(animation);
        marker.setLatLng(originalLatLng);
        return;
      }
      
      const newLatLng = {
        lat: originalLatLng.lat + (bounce * 0.0002), // Increased from 0.0001 to 0.0002 for larger displacement
        lng: originalLatLng.lng
      };
      marker.setLatLng(newLatLng);
    }, 16);
  
    // Clear animation after 1 second
    setTimeout(() => {
      clearInterval(animation);
      marker.setLatLng(originalLatLng);
    }, 1000);
  };

  // Add this function to parse hours string into structured data
  const parseStoreHours = (hours: string) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hoursMap: { [key: string]: string } = {};
    
    // Initialize all days as Closed
    days.forEach(day => {
      hoursMap[day] = 'Closed';
    });
  
    // Match patterns like "Mon-Sat: 10AM-6PM" or "Sun: Closed"
    const rangeRegex = /([a-zA-Z]{3})-([a-zA-Z]{3}):\s*((?:\d+(?::\d+)?[AP]M-\d+(?::\d+)?[AP]M)|Closed)/g;
    const singleRegex = /([a-zA-Z]{3}):\s*((?:\d+(?::\d+)?[AP]M-\d+(?::d+)?[AP]M)|Closed)/g;
  
    let match;
  
    // First check for ranges
    while ((match = rangeRegex.exec(hours)) !== null) {
      const [_, startDay, endDay, timeRange] = match;
      const startIdx = days.indexOf(startDay);
      const endIdx = days.indexOf(endDay);
      
      // Handle the range of days
      if (startIdx !== -1 && endIdx !== -1) {
        // Make sure to handle wrap-around (e.g., if endIdx < startIdx)
        const dayIndices = startIdx <= endIdx 
          ? Array.from({ length: endIdx - startIdx + 1 }, (_, i) => startIdx + i)
          : [...Array.from({ length: days.length - startIdx }, (_, i) => startIdx + i), 
             ...Array.from({ length: endIdx + 1 }, (_, i) => i)];
        
        dayIndices.forEach(idx => {
          hoursMap[days[idx]] = timeRange;
        });
      }
    }
  
    // Then check for individual days to override any ranges
    hours.replace(rangeRegex, ''); // Remove the ranges we've already processed
    while ((match = singleRegex.exec(hours)) !== null) {
      const [_, day, timeRange] = match;
      if (days.includes(day)) {
        hoursMap[day] = timeRange;
      }
    }
  
    return hoursMap;
  };

  // Update markers when filters or map changes
  useEffect(() => {
    const updateMarkers = async () => {
      if (!map || !goldIcon || !selectedGoldIcon) return;

      try {
        const L = (await import('leaflet')).default;

        // Clear existing markers
        markers.forEach(marker => marker.remove());

        // Filter products first
        const filtered = products.filter(product => {
          if (currentFilters.goldPurity && product.chain_purity !== currentFilters.goldPurity) return false;
          if (currentFilters.chainStyle && product.chain_type !== currentFilters.chainStyle) return false;
          if (currentFilters.thickness && product.chain_thickness !== parseFloat(currentFilters.thickness)) return false;
          if (currentFilters.length && product.chain_length !== parseFloat(currentFilters.length)) return false;
          if (currentFilters.color && product.chain_color !== currentFilters.color) return false;
          return true;
        });

        setFilteredProducts(filtered);

        // Get unique store IDs from filtered products
        const storeIds = [...new Set(filtered.map(p => p.storeID))];
        const filteredStores = stores.filter(s => storeIds.includes(s.storeID)); // Changed from s.id
        setFilteredStores(filteredStores);

        // Create markers for filtered stores with proper icon selection
        const newMarkers = filteredStores.map(store => {
          const marker = L.marker([store.latitude, store.longitude], {  // Changed from lat/lng
            icon: store.storeID === selectedStore ? selectedGoldIcon : goldIcon 
          }) as CustomMarker;
          
          marker.storeID = store.storeID;  // Changed from id
          
          if (store.storeID === selectedStore) {
            marker.setZIndexOffset(1000);
          }
          
          // Update marker click handler to find first product for the store
          marker.on('click', () => {
            const firstProduct = products.find(p => p.storeID === store.storeID);
            if (firstProduct) {
              handleStoreClick(store.storeID, firstProduct.productID);
            }
          });
          
          marker.addTo(map);
          return marker;
        });

        setMarkers(newMarkers);
      } catch (error) {
        console.error('Error updating markers:', error);
      }
    };

    updateMarkers();
  }, [currentFilters, map, goldIcon, selectedGoldIcon, priceSort, products, stores, selectedStore, selectedProductId]); // Add selectedStore to deps

  // First, create a stable reference for the initialization function
  const initView = useCallback(async (storeId: string | null) => {
    if (!storeId || !stores.length || !map || !markers.length) return;
  
    const store = stores.find(s => s.storeID === parseInt(storeId)); // Convert string to number
    if (!store) return;
  
    // Reset filters
    setCurrentFilters({
      goldPurity: "",
      chainStyle: "",
      thickness: "",
      length: "",
      color: "",
    });
  
    // Reset all markers first
    markers.forEach(m => {
      if (isValidIcon(goldIcon)) {
        m.setIcon(goldIcon);
      }
    });
  
    // Find and update target marker
    const targetMarker = markers.find(m => m.storeID === parseInt(storeId));  // Convert string to number
    if (targetMarker && isValidIcon(selectedGoldIcon)) {
      targetMarker.setIcon(selectedGoldIcon);
      bounceMarker(targetMarker);
    }
  
    // Update view and state with correct property names
    map.setView([store.latitude, store.longitude], 15);
    setSelectedStore(parseInt(storeId));  // Convert string to number
    setSelectedStoreData(store);
    setShowExtendedInfo(true);
  }, [stores, map, markers, goldIcon, selectedGoldIcon]);
  
  // Remove the duplicate URL parameter handlers and combine into one
  useEffect(() => {
    const storeID = searchParams.get('storeID');
    
    // Skip if no storeID or if it's already selected
    if (!storeID || selectedStore === parseInt(storeID)) return;
    
    const handleStoreSelection = async () => {
      if (stores.length > 0 && map && markers.length > 0) {
        const store = stores.find(s => s.storeID === parseInt(storeID));
        if (!store) return;
  
        // Get store products
        const storeProducts = products.filter(p => p.storeID === parseInt(storeID));
        const firstMatchingProduct = storeProducts[0] || null;
  
        // Reset all markers first
        markers.forEach(m => {
          if (isValidIcon(goldIcon)) {
            m.setIcon(goldIcon);
            m.setZIndexOffset(0);
          }
        });
  
        // Update selected marker
        const targetMarker = markers.find(m => m.storeID === parseInt(storeID));
        if (targetMarker && isValidIcon(selectedGoldIcon)) {
          targetMarker.setIcon(selectedGoldIcon);
          targetMarker.setZIndexOffset(1000);
          bounceMarker(targetMarker);
        }
  
        // Set view with correct property names
        map.setView([store.latitude, store.longitude], 15);
        setSelectedStore(parseInt(storeID));
        setSelectedStoreData(store);
        setSelectedProduct(firstMatchingProduct);
        setShowExtendedInfo(true);
  
        window.history.replaceState({}, '', '/map');
      }
    };
  
    handleStoreSelection();
  }, [searchParams, stores, map, markers, goldIcon, selectedGoldIcon, products]);

  // Fetch hours when store is selected
  useEffect(() => {
    if (selectedStoreData) {
      fetchStoreHours(selectedStoreData.storeID).then(setHours);
    }
  }, [selectedStoreData]);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <button
          onClick={toggleMenu}
          className={styles.hamburgerButton}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={styles.hamburgerIcon}>
            <motion.div
              className="w-[25px] h-[3px] my-1"
              style={{ backgroundColor: isHovered ? "black" : "#FFD700" }}
              animate={{
                rotate: isMenuOpen ? 45 : 0,
                translateY: isMenuOpen ? 8 : 0
              }}
            />
            <motion.div
              className="w-[25px] h-[3px] my-1"
              style={{ backgroundColor: isHovered ? "black" : "#FFD700" }}
              animate={{
                opacity: isMenuOpen ? 0 : 1
              }}
            />
            <motion.div
              className="w-[25px] h-[3px] my-1"
              style={{ backgroundColor: isHovered ? "black" : "#FFD700" }}
              animate={{
                rotate: isMenuOpen ? -45 : 0,
                translateY: isMenuOpen ? -8 : 0
              }}
            />
          </div>
          <span>Filters</span>
        </button>

        {/* Filter Menu */}
        {isMenuOpen && (
          <div className={styles.filterMenu}>
            <h2>Shop By Filter</h2>
            
            <div style={{ marginBottom: "24px" }}>
              <div style={{ marginBottom: "24px" }}>
                <label>Gold Purity</label>
                <div className={styles.mapFilterWrapper}>
                  <CustomListbox
                    options={[
                      { value: '', label: 'All Purities' },
                      { value: '10', label: '10K Gold' },
                      { value: '14', label: '14K Gold' },
                      { value: '18', label: '18K Gold' },
                      { value: '22', label: '22K Gold' },
                      { value: '24', label: '24K Pure Gold' },
                    ]}
                    value={pendingFilters.goldPurity}
                    onChange={(value) => handleFilterChange({
                      target: { name: 'goldPurity', value }
                    } as any)}
                    label="Gold Purity"
                  />
                </div>
              </div>

              {/* Update each CustomListbox section */}
              <div style={{ marginBottom: "24px" }}>
                <label>Chain Type</label>
                <div className={styles.mapFilterWrapper}>
                  <CustomListbox
                    options={[
                      { value: '', label: 'All Types' },
                      { value: 'Anchor', label: 'ANCHOR' },
                      { value: 'Ball', label: 'Ball Chain' },
                      { value: 'Box', label: 'Box Chain' },
                      { value: 'Byzantine', label: 'Byzantine Chain' },
                      { value: 'Cable', label: 'Cable Chain' },
                      { value: 'Figaro', label: 'Figaro Chain' },
                      { value: 'Figarope', label: 'Figarope Chain' },
                      { value: 'FlatCurb', label: 'Flat Curb Chain' },
                      { value: 'Franco', label: 'Franco Chain' },
                      { value: 'Herringbone', label: 'Herringbone Chain' },
                      { value: 'Mariner', label: 'Mariner Chain' },
                      { value: 'MiamiCuban', label: 'Miami Cuban Chain' },
                      { value: 'MoonCut', label: 'Moon Cut Chain' },
                      { value: 'Rope', label: 'Rope Chain' },
                      { value: 'Wheat', label: 'Wheat Chain' },
                    ]}
                    value={pendingFilters.chainStyle}
                    onChange={(value) => handleFilterChange({
                      target: { name: 'chain_type', value }
                    } as any)}
                    label="Chain Type"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label>Chain Color</label>
                <div className={styles.mapFilterWrapper}>
                  <CustomListbox
                    options={[
                      { value: '', label: 'All Colors' },
                      { value: 'Yellow', label: 'Yellow Gold' },
                      { value: 'Rose', label: 'Rose Gold' },
                      { value: 'White', label: 'White Gold' },
                      { value: 'Two-Color', label: 'Two-Tone' },
                      { value: 'Tri-Color', label: 'Tri-Color' },
                    ]}
                    value={pendingFilters.color}
                    onChange={(value) => handleFilterChange({
                      target: { name: 'color', value }
                    } as any)}
                    label="Chain Color"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label>Chain Thickness</label>
                <div className={styles.mapFilterWrapper}>
                  <CustomListbox
                    options={[
                      { value: '', label: 'All Thicknesses' },
                      ...Array.from({ length: 39 }, (_, i) => {
                        const thickness = (i + 2) / 2;
                        return {
                          value: `${thickness} mm`,
                          label: `${thickness} mm`
                        };
                      })
                    ]}
                    value={pendingFilters.thickness}
                    onChange={(value) => handleFilterChange({
                      target: { name: 'chain_thickness', value }
                    } as any)}
                    label="Chain Thickness"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label>Chain Length</label>
                <div className={styles.mapFilterWrapper}>
                  <CustomListbox
                    options={[
                      { value: '', label: 'All Lengths' },
                      ...Array.from({ length: 8 }, (_, i) => {
                        const length = 16 + (i * 2);
                        return {
                          value: `${length} in`,
                          label: `${length} inches`
                        };
                      })
                    ]}
                    value={pendingFilters.length}
                    onChange={(value) => handleFilterChange({
                      target: { name: 'chain_length', value }
                    } as any)}
                    label="Chain Length"
                  />
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={handleApplyFilters}
                className={styles.applyFiltersButton}
              >
                Apply Filters
              </button>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className={styles.clearFiltersButton}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results List */}
        {showResults && (
          <div className={styles.resultsList}>
            <div className={styles.resultsHeader}>
              <h3>Results ({filteredProducts.length})</h3>
              <div className={styles.resultsControls}>
                <select
                  className={styles.priceSortSelect}
                  value={priceSort}
                  onChange={handlePriceSortChange}
                >
                  <option value="">Sort by Price</option>
                  <option value="lowToHigh">Lowest to Highest</option>
                  <option value="highToLow">Highest to Lowest</option>
                </select>
                <button onClick={handleCloseResults} className={styles.closeButton}>×</button>
              </div>
            </div>
            
            {/* Show all products in a flat list, sorted by price */}
            {filteredProducts
              .sort((a, b) => {
                if (priceSort === "lowToHigh") {
                  return a.set_price - b.set_price;
                } else if (priceSort === "highToLow") {
                  return b.set_price - a.set_price;
                }
                return 0;
              })
              .map((product) => {
                const store = stores.find(s => s.storeID === product.storeID); // Changed from s.id
                if (!store) return null;
                
                return (
                  <div 
                    key={product.productID} // Changed from productId
                    className={`${styles.productCard} ${selectedProductId === product.productID ? styles.selected : ''}`}
                    onClick={() => handleStoreClick(store.storeID, product.productID)}
                  >
                    <div className={styles.productInfo}>
                      <p className={styles.productName}>
                        {getFormattedProductName(product)}
                      </p>
                      <p className={styles.storeName}>
                        {store.store_name} {/* Changed from name */}
                      </p>
                      <p className={styles.productPrice}>
                        ${product.set_price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/products/${product.productID.toString()}`);
                      }}
                      className={styles.viewProductButton}
                    >
                      View Product
                    </button>
                  </div>
                );
              })}
          </div>
        )}

        {showExtendedInfo && selectedStoreData && selectedProduct && (
          <div className={styles.extendedInfo}>
            <button 
              className={styles.closeExtendedInfo}
              onClick={() => {
                setShowExtendedInfo(false);
                setSelectedProduct(null);
              }}
            >
              ×
            </button>
            
            <h3 className="text-2xl text-white mb-4 opacity-90">
              {selectedStoreData.store_name}
            </h3>
            
            <StarRating 
              rating={selectedStoreData.rating} 
              size="large" 
              // Remove numReviews as it's not in the Store interface
            />
            
            <p className={styles.address}>{selectedStoreData.address}</p>
            
            <div className={styles.extendedInfoStatus}>
              <div 
                className={styles.statusHeader}
                onClick={() => setShowHours(!showHours)}
              >
                <div className={styles.statusInfo}>
                  <span className={`${styles.statusDot} ${getStoreStatus(hours).isOpen ? styles.open : styles.closed}`} />
                  <span className={styles.statusText}>
                    {getStoreStatus(hours).isOpen ? 'Open' : 'Closed'}
                  </span>
                  <span className={styles.statusBullet}>•</span>
                  <span className={styles.nextChange}>
                    {getStoreStatus(hours).nextChange}
                  </span>
                </div>
                <span className={`${styles.dropdownArrow} ${showHours ? styles.open : ''}`}>▼</span>
              </div>
              
              {showHours && (
                <div className={styles.hoursDropdown}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const hourData = hours.find(h => h.day === day);
                    return (
                      <div key={day} className={styles.hourRow}>
                        <span className={styles.dayName}>{day}</span>
                        <span>
                          {hourData 
                            ? `${hourData.openTime} - ${hourData.closeTime}`
                            : 'Closed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <a 
                href={`https://maps.google.com/?q=${selectedStoreData.latitude},${selectedStoreData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsButton}
              >
                Get Directions
              </a>
              <Link
                href={`/stores/${selectedStoreData.storeID}`} // Changed from /map to /stores/:id
                className={styles.detailsButton}
              >
                View Store Details
              </Link>
            </div>
          </div>
        )}

        <div id="map" className={styles.mapContainer} />
      </div>
    </>
  );
};

export default MapComponent;