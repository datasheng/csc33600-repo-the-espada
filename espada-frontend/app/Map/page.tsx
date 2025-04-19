"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from './Map.module.css';
import { Map as LeafletMap, Icon, Marker } from 'leaflet';
import Image from 'next/image';
import Link from 'next/link';
// Add import for motion
import { motion } from "framer-motion"

interface Store {
  id: string;
  name: string;
  address: string;
  hours: string;
  lat: number;
  lng: number;
  price: number;  // Changed from pricePerGram
  purity: number;
  style: string;
  thickness: string;
  length: string;
}

interface CustomMarker extends Marker {
  storeId?: string;
}

const isValidIcon = (icon: Icon | null): icon is Icon => {
  return icon !== null;
};

const MapComponent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [filters, setFilters] = useState({
    priceSort: "",
    goldPurity: "",
    chainStyle: "",
    thickness: "",
    length: "",
  });
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
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
  });

  const [pendingFilters, setPendingFilters] = useState({
    goldPurity: "",
    chainStyle: "",
    thickness: "",
    length: "",
  });

  // Add state for price sort in results
  const [priceSort, setPriceSort] = useState("");

  // Add new state for extended info
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);
  const [selectedStoreData, setSelectedStoreData] = useState<Store | null>(null);

  // Initialize icons when the component mounts
  useEffect(() => {
    const initIcons = async () => {
      const L = (await import('leaflet')).default;
      
      const normalIcon = L.icon({
        iconUrl: "/map_images/black-marker.png", // Update with black marker image
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const selectedIcon = L.icon({
        iconUrl: "/map_images/gold-marker.png", // Keep the gold marker for selected state
        iconSize: [35, 57],
        iconAnchor: [17, 57],
        className: styles.selectedMarker
      });

      setGoldIcon(normalIcon);
      setSelectedGoldIcon(selectedIcon);
    };

    initIcons();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPendingFilters(prev => ({ ...prev, [name]: value }));
    // This updates the visual state of filters but doesn't trigger filtering
  };

  const handlePriceSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setPriceSort(value);
    
    // Immediately sort the current filtered stores
    let sortedStores = [...filteredStores];
    if (value === "lowToHigh") {
      sortedStores.sort((a, b) => a.price - b.price);
    } else if (value === "highToLow") {
      sortedStores.sort((a, b) => b.price - a.price);
    }
    setFilteredStores(sortedStores);
  };

  const clearFilters = () => {
    setPendingFilters({
      goldPurity: "",
      chainStyle: "",
      thickness: "",
      length: "",
    });
    setCurrentFilters({
      goldPurity: "",
      chainStyle: "",
      thickness: "",
      length: "",
    });
    if (isValidIcon(goldIcon)) {
      markers.forEach(marker => marker.setIcon(goldIcon));
    }
  };

  const handleStoreClick = (storeId: string) => {
    // First reset ALL markers to default state
    markers.forEach(marker => {
      if (isValidIcon(goldIcon)) {
        marker.setIcon(goldIcon);
      }
    });

    setSelectedStore(storeId);
    const store = stores.find(s => s.id === storeId);
    
    if (store && map && isValidIcon(selectedGoldIcon)) {
      // Then set only the clicked marker to selected state
      const selectedMarker = markers.find(marker => marker.storeId === storeId);
      if (selectedMarker) {
        selectedMarker.setIcon(selectedGoldIcon);
        bounceMarker(selectedMarker);
        // Always zoom when clicking from results list, no double click needed
        map.setView([store.lat, store.lng], 15);
      }
      
      // Add these lines to show extended info
      setSelectedStoreData(store);
      setShowExtendedInfo(true);
    }
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

  // Sample store data with more details
  const stores: Store[] = [
    {
      id: '1',
      name: "Gold & Diamond District",
      address: "47 W 47th St, New York, NY 10036",
      hours: "Mon-Sat: 10AM-6PM, Sun: Closed",
      lat: 40.7128,
      lng: -74.006,
      price: 1299.99,  // Changed from pricePerGram
      purity: 18,
      style: "Cable",
      thickness: "2 mm",  // Added space
      length: "20 in"     // Added space
    },
    {
      id: '2',
      name: "Empire Gold Exchange",
      address: "152 W 34th St, New York, NY 10001",
      hours: "Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 11AM-5PM",
      lat: 40.7505,
      lng: -73.9934,
      price: 2499.99,  // Changed from pricePerGram
      purity: 14,
      style: "Miami Cuban",
      thickness: "4 mm",  // Added space
      length: "24 in"     // Added space
    },
    {
      id: '3',
      name: "Royal Gold & Jewelry",
      address: "28 E 23rd St, New York, NY 10010",
      hours: "Mon-Sat: 11AM-8PM, Sun: Closed",
      lat: 40.7410,
      lng: -73.9867,
      price: 1899.99,  // Changed from pricePerGram
      purity: 22,
      style: "Franco",
      thickness: "3 mm",  // Added space
      length: "18 in"     // Added space
    }
  ];

  // Initialize map only once
  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        if (!isMounted) return;

        if (!map) {
          const newMap = L.map("map", { zoomControl: false }).setView([40.7128, -74.006], 13);
          
          // Move zoom control to bottom right
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
        setMap(null);
      }
    };
  }, []); // Empty dependency array - only run once

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

  // Update markers when filters or map changes
  useEffect(() => {
    const updateMarkers = async () => {
      if (!map || !goldIcon || !selectedGoldIcon) return;

      try {
        const L = (await import('leaflet')).default;

        // Clear existing markers
        markers.forEach(marker => marker.remove());
        setMarkers([]);

        let filtered = stores.filter(store => {
          if (currentFilters.goldPurity && store.purity !== parseInt(currentFilters.goldPurity)) return false;
          if (currentFilters.chainStyle && store.style !== currentFilters.chainStyle) return false;
          if (currentFilters.thickness && store.thickness !== currentFilters.thickness) return false;
          if (currentFilters.length && store.length !== currentFilters.length) return false;
          return true;
        });

        // Apply price sorting if set
        if (priceSort === "lowToHigh") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (priceSort === "highToLow") {
          filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredStores(filtered);

        // Inside updateMarkers function, update the marker click handler
        const newMarkers = filtered.map(store => {
          const marker = L.marker([store.lat, store.lng], { icon: goldIcon }) as CustomMarker;
          
          marker.on('click', () => {
            // Reset ALL markers to default icon first
            newMarkers.forEach(m => {
              if (isValidIcon(goldIcon)) {
                m.setIcon(goldIcon);
              }
            });

            const currentClicks = clickCount[store.id] || 0;
            const newClickCount = currentClicks + 1;
            
            setClickCount(prev => ({
              ...prev,
              [store.id]: newClickCount
            }));

            setSelectedStore(store.id);
            
            // Set this marker as selected
            if (isValidIcon(selectedGoldIcon)) {
              marker.setIcon(selectedGoldIcon);
            }
            bounceMarker(marker);

            // Only zoom on double click for markers
            if (newClickCount === 2) {
              map.setView([store.lat, store.lng], 15);
              setClickCount(prev => ({
                ...prev,
                [store.id]: 0
              }));
            }

            setSelectedStoreData(store);
            setShowExtendedInfo(true);
          });

          marker.storeId = store.id;
          marker.addTo(map);

          return marker;
        });

        setMarkers(newMarkers);
      } catch (error) {
        console.error('Error updating markers:', error);
      }
    };

    updateMarkers();
  }, [currentFilters, map, goldIcon, selectedGoldIcon, priceSort]);

  return (
    <>
      <header className={styles.header}>
        <Link href="/heroSection" className={styles.logoLink}>
          <Image
            src="/goldlinks-header-logo.svg" // Changed from /logo.png
            alt="GoldLinks Logo"             // Updated alt text
            width={240}
            height={60}
            className={styles.logo}
          />
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/AboutUs" className={styles.navLink}>About Us</Link>
          <Link href="/ContactUs" className={styles.navLink}>Contact</Link>
          <Link href="/login" className={styles.authButton}>Login</Link>
          <Link href="/signup" className={styles.authButton}>Sign Up</Link>
        </nav>
      </header>

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
                <label>Gold Quality</label>
                <select
                  name="goldPurity"
                  value={pendingFilters.goldPurity}
                  onChange={handleFilterChange}
                >
                  <option value="">All Purities</option>
                  <option value="10">10K Gold</option>
                  <option value="14">14K Gold</option>
                  <option value="18">18K Gold</option>
                  <option value="22">22K Gold</option>
                  <option value="24">24K Pure Gold</option>
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label>Chain Type</label>
                <select
                  name="chainStyle"
                  value={pendingFilters.chainStyle}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="Anchor">Anchor Chain</option>
                  <option value="Ball">Ball Chain</option>
                  <option value="Box">Box Chain</option>
                  <option value="Byzantine">Byzantine Chain</option>
                  <option value="Cable">Cable Chain</option>
                  <option value="Figaro">Figaro Chain</option>
                  <option value="Figarope">Figarope Chain</option>
                  <option value="FlatCurb">Flat Curb Chain</option>
                  <option value="Franco">Franco Chain</option>
                  <option value="Herringbone">Herringbone Chain</option>
                  <option value="Link">Link Chain</option>
                  <option value="Mariner">Mariner Chain</option>
                  <option value="MiamiCuban">Miami Cuban Chain</option>
                  <option value="MoonCut">Moon Cut Chain</option>
                  <option value="Rope">Rope Chain</option>
                  <option value="Wheat">Wheat Chain</option>
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label>Thickness</label>
                <select
                  name="thickness"
                  value={pendingFilters.thickness}  // Changed from filters.thickness
                  onChange={handleFilterChange}
                >
                  <option value="">All Thicknesses</option>
                  {Array.from({ length: 39 }, (_, i) => (i + 2) / 2).map(thickness => (
                    <option key={thickness} value={`${thickness}mm`}>
                      {thickness} mm
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label>Length</label>
                <select
                  name="length"
                  value={pendingFilters.length}  // Changed from filters.length
                  onChange={handleFilterChange}
                >
                  <option value="">All Lengths</option>
                  {Array.from({ length: 8 }, (_, i) => 16 + (i * 2)).map(length => (
                    <option key={length} value={`${length}in`}>
                      {length} in
                    </option>
                  ))}
                </select>
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
              <h3>Results ({filteredStores.length})</h3>
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
                <button 
                  onClick={handleCloseResults}
                  className={styles.closeButton}
                >
                  ×
                </button>
              </div>
            </div>
            {filteredStores.map(store => (
              <div
                key={store.id}
                className={`${styles.storeCard} ${selectedStore === store.id ? styles.selected : ''}`}
                onClick={() => handleStoreClick(store.id)}
              >
                <h4>{store.name}</h4>
                <p>{store.address}</p>
                <p className={styles.hours}>{store.hours}</p>
                <p className={styles.price}>${store.price.toLocaleString()}</p>
                <div className={styles.chainDetails}>
                  <span>{store.purity}K</span>
                  <span>{store.style}</span>
                  <span>{store.thickness}</span>
                  <span>{store.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showExtendedInfo && selectedStoreData && (
          <div className={styles.extendedInfo}>
            <button 
              className={styles.closeExtendedInfo}
              onClick={() => setShowExtendedInfo(false)}
            >
              ×
            </button>
            <h2>{selectedStoreData.name}</h2>
            <p className={styles.address}>{selectedStoreData.address}</p>
            <p className={styles.hours}>{selectedStoreData.hours}</p>
            
            <div className={styles.priceSection}>
              <div className={styles.price}>
                ${selectedStoreData.price.toLocaleString()}
              </div>
            </div>
            
            <div className={styles.details}>
              <div className={styles.detail}>
                <label>Purity</label>
                <span>{selectedStoreData.purity}K Gold</span>
              </div>
              <div className={styles.detail}>
                <label>Style</label>
                <span>{selectedStoreData.style}</span>
              </div>
              <div className={styles.detail}>
                <label>Thickness</label>
                <span>{selectedStoreData.thickness}</span>
              </div>
              <div className={styles.detail}>
                <label>Length</label>
                <span>{selectedStoreData.length}</span>
              </div>
            </div>
          </div>
        )}

        <div id="map" className={styles.mapContainer} />
      </div>
    </>
  );
};

export default MapComponent;