"use client";
import React, { useEffect, useState, useCallback } from "react";
import styles from './Map.module.css';
import { Map as LeafletMap, Icon, Marker } from 'leaflet';
import Image from 'next/image';
import Link from 'next/link';
// Add import for motion
import { motion } from "framer-motion"

// Add this utility function at the top of the file
const getStoreStatus = (hours: string): { isOpen: boolean; nextChange: string } => {
  // Get current EST time
  const now = new Date();
  const est = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    weekday: 'short'
  });
  
  const currentDay = now.toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'short' });
  const currentTime = now.toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', hour12: false });
  
  // Parse store hours
  const hoursRegex = /([a-zA-Z]+)-([a-zA-Z]+):\s*(\d+(?::\d+)?[AP]M)-(\d+(?::\d+)?[AP]M)/g;
  const daysMap: { [key: string]: number } = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  let schedule: { start: Date, end: Date }[] = [];
  
  let match;
  while ((match = hoursRegex.exec(hours)) !== null) {
    const [_, startDay, endDay, startTime, endTime] = match;
    const startHour = parseInt(startTime.replace(/[APM]/g, ''));
    const endHour = parseInt(endTime.replace(/[APM]/g, ''));
    
    // Create Date objects for start and end times
    const start = new Date();
    start.setHours(startTime.includes('PM') ? startHour + 12 : startHour, 0);
    const end = new Date();
    end.setHours(endTime.includes('PM') ? endHour + 12 : endHour, 0);
    
    schedule.push({ start, end });
  }
  
  // Check if currently open
  const currentHour = parseInt(currentTime.split(':')[0]);
  const isOpen = schedule.some(({ start, end }) => 
    currentHour >= start.getHours() && currentHour < end.getHours()
  );
  
  // Find next opening/closing time
  let nextChange = '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let nextOpeningDay = today;
  let nextOpeningTime = '';

  // Parse store hours for each day
  const daysArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Find the next opening time
  if (!isOpen) {
    let daysToCheck = 7; // Check up to a week ahead
    let currentCheckDay = today;
    
    while (daysToCheck > 0) {
      const checkDayName = currentCheckDay.toLocaleString('en-US', { 
        timeZone: 'America/New_York', 
        weekday: 'short' 
      });
      
      // Look for this day's hours in the schedule
      const dayRegex = new RegExp(`${checkDayName}[^,]*?:(\\s*\\d+(?::\\d+)?[AP]M)`, 'i');
      const match = hours.match(dayRegex);

      if (match && !hours.includes(`${checkDayName}: Closed`)) {
        nextOpeningDay = currentCheckDay;
        nextOpeningTime = match[1].trim();
        break;
      }

      // Move to next day
      currentCheckDay = new Date(currentCheckDay);
      currentCheckDay.setDate(currentCheckDay.getDate() + 1);
      daysToCheck--;
    }

    if (nextOpeningTime) {
      const dayName = nextOpeningDay.toLocaleString('en-US', { 
        timeZone: 'America/New_York', 
        weekday: 'short' 
      });
      nextChange = `Opens ${nextOpeningTime} ${dayName}`;
    } else {
      nextChange = 'Temporarily closed';
    }
  } else {
    const closing = schedule.find(({ end }) => currentHour < end.getHours());
    if (closing) {
      nextChange = `Closes at ${closing.end.toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
      })}`;
    }
  }
  
  return { isOpen, nextChange };
};

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
  rating: number;      // Add rating (0-5)
  numReviews: number;  // Add number of reviews
  color: string;  // Add this property
}

interface CustomMarker extends Marker {
  storeId?: string;
}

const isValidIcon = (icon: Icon | null): icon is Icon => {
  return icon !== null;
};

const StarRating: React.FC<{ rating: number; numReviews: number }> = ({ rating, numReviews }) => {
  return (
    <div className={styles.starRating}>
      <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
      <div className={styles.stars}>
        {[...Array(5)].map((_, index) => {
          const fillPercentage = Math.min(Math.max((rating - index) * 100, 0), 100);
          return (
            <span 
              key={index} 
              className={styles.star}
              style={{
                position: 'relative',
                display: 'inline-block'
              }}
            >
              <span className={styles.starBackground}>★</span>
              <span 
                className={styles.starFill}
                style={{
                  width: `${fillPercentage}%`,
                  overflow: 'hidden',
                  position: 'absolute',
                  left: 0,
                  top: 0
                }}
              >
                ★
              </span>
            </span>
          );
        })}
      </div>
      <span className={styles.reviewCount}>({numReviews})</span>
    </div>
  );
};

// Add this new component
const StoreStatus: React.FC<{ hours: string }> = ({ hours }) => {
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
  const [showHours, setShowHours] = useState(false);

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
      length: "20 in",     // Added space
      rating: 4.5,      // Add rating (0-5)
      numReviews: 128,  // Add number of reviews
      color: "Yellow",
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
      length: "24 in",     // Added space
      rating: 4.2,      // Add rating (0-5)
      numReviews: 86,  // Add number of reviews
      color: "Rose",
    },
    {
      id: '3',
      name: "Royal Gold & Jewelry",
      address: "28 E 23rd St, New York, NY 10010",
      hours: "Mon-Sat: 11AM-8PM, Sun: Closed", // Changed from 8PM to 11PM
      lat: 40.7410,
      lng: -73.9867,
      price: 1899.99,
      purity: 22,
      style: "Franco",
      thickness: "3 mm",
      length: "18 in",
      rating: 4.8,
      numReviews: 234,
      color: "Two-Color",
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
    const singleRegex = /([a-zA-Z]{3}):\s*((?:\d+(?::\d+)?[AP]M-\d+(?::\d+)?[AP]M)|Closed)/g;
  
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
        setMarkers([]);

        let filtered = stores.filter(store => {
          if (currentFilters.goldPurity && store.purity !== parseInt(currentFilters.goldPurity)) return false;
          if (currentFilters.chainStyle && store.style !== currentFilters.chainStyle) return false;
          if (currentFilters.thickness && store.thickness !== currentFilters.thickness) return false;
          if (currentFilters.length && store.length !== currentFilters.length) return false;
          if (currentFilters.color && store.color !== currentFilters.color) return false;  // Add this
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

              {/* Add this after the Chain Type filter */}
              <div style={{ marginBottom: "24px" }}>
                <label>Chain Color</label>
                <select
                  name="color"
                  value={pendingFilters.color}
                  onChange={handleFilterChange}
                >
                  <option value="">All Colors</option>
                  <option value="Yellow">Yellow Gold</option>
                  <option value="Rose">Rose Gold</option>
                  <option value="White">White Gold</option>
                  <option value="Two-Color">Two-Tone</option>
                  <option value="Tri-Color">Tri-Color</option>
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label>Chain Thickness</label>
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
                <label>Chain Length</label>
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
                <StarRating rating={store.rating} numReviews={store.numReviews} />
                <p>{store.address}</p>
                <div className={styles.storeStatus}>
                  <span className={`${styles.statusDot} ${getStoreStatus(store.hours).isOpen ? styles.open : styles.closed}`} />
                  <span className={styles.statusText}>
                    {getStoreStatus(store.hours).isOpen ? 'Open' : 'Closed'}
                  </span>
                  <span className={styles.statusBullet}>•</span>
                  <span className={styles.nextChange}>
                    {getStoreStatus(store.hours).nextChange}
                  </span>
                </div>
                <p className={styles.price}>${store.price.toLocaleString()}</p>
                <div className={styles.chainDetails}>
                  <span>{store.purity}K</span>
                  <span>{store.color}</span>
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
            <StarRating rating={selectedStoreData.rating} numReviews={selectedStoreData.numReviews} />
            <p className={styles.address}>{selectedStoreData.address}</p>
            
            <div className={styles.extendedInfoStatus}>
              <div 
                className={styles.statusHeader}
                onClick={() => setShowHours(!showHours)}
              >
                <div className={styles.statusInfo}>
                  <span className={`${styles.statusDot} ${getStoreStatus(selectedStoreData.hours).isOpen ? styles.open : styles.closed}`} />
                  <span className={styles.statusText}>
                    {getStoreStatus(selectedStoreData.hours).isOpen ? 'Open' : 'Closed'}
                  </span>
                  <span className={styles.statusBullet}>•</span>
                  <span className={styles.nextChange}>
                    {getStoreStatus(selectedStoreData.hours).nextChange}
                  </span>
                </div>
                <span className={`${styles.dropdownArrow} ${showHours ? styles.open : ''}`}>▼</span>
              </div>
              
              {showHours && (
                <div className={styles.hoursDropdown}>
                  {Object.entries(parseStoreHours(selectedStoreData.hours)).map(([day, hours]) => (
                    <div key={day} className={styles.hourRow}>
                      <span className={styles.dayName}>{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.priceSection}>
              <div className={styles.price}>${selectedStoreData.price.toLocaleString()}</div>
            </div>

            <div className={styles.details}>
              <div className={styles.detail}>
                <label>Purity</label>
                <span>{selectedStoreData.purity}K Gold</span>
              </div>
              <div className={styles.detail}>
                <label>Color</label>
                <span>{selectedStoreData.color}</span>
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