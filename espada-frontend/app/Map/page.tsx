// app/Map/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet CSS
import styles from './Map.module.css'; // Import CSS module

const MapComponent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [filters, setFilters] = useState({
    priceSort: "", // "lowToHigh" or "highToLow"
    goldPurity: "",
    chainStyle: "", // Selected chain style
    thickness: "",
    length: "",
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceSort: "",
      goldPurity: "",
      chainStyle: "",
      thickness: "",
      length: "",
    });
  };

  useEffect(() => {
    // Custom gold marker icon
    const goldIcon = L.icon({
      iconUrl: "/map_images/gold-marker.png", // Path to the gold marker in the public folder
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const map = L.map("map", { zoomControl: false }).setView([40.7128, -74.006], 13);
    
    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", {
      attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>'
    }).addTo(map);

    const stores = [
      { name: "Store 1", lat: 40.7128, lng: -74.006, pricePerGram: 60, purity: 18, style: "Cable", thickness: "2mm", length: "20in" },
      { name: "Store 2", lat: 40.7214, lng: -74.0052, pricePerGram: 55, purity: 14, style: "Figaro", thickness: "3mm", length: "24in" },
      { name: "Store 3", lat: 40.7153, lng: -74.0112, pricePerGram: 70, purity: 24, style: "Rope", thickness: "1.5mm", length: "18in" },
    ];

    // Filter and sort stores
    let filteredStores = stores.filter(store => {
      if (filters.goldPurity && store.purity !== parseInt(filters.goldPurity)) return false;
      if (filters.chainStyle && store.style !== filters.chainStyle) return false;
      if (filters.thickness && store.thickness !== filters.thickness) return false;
      if (filters.length && store.length !== filters.length) return false;
      return true;
    });

    // Sort by price
    if (filters.priceSort === "lowToHigh") {
      filteredStores.sort((a, b) => a.pricePerGram - b.pricePerGram);
    } else if (filters.priceSort === "highToLow") {
      filteredStores.sort((a, b) => b.pricePerGram - a.pricePerGram);
    }

    // Add markers with gold icons
    filteredStores.forEach(store => {
      L.marker([store.lat, store.lng], { icon: goldIcon })
        .bindPopup(`
          <b>${store.name}</b><br>
          Price: $${store.pricePerGram}/gram<br>
          Purity: ${store.purity}K<br>
          Style: ${store.style}<br>
          Thickness: ${store.thickness}<br>
          Length: ${store.length}
        `)
        .addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [filters]);

  return (
    <div className={styles.container}>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={styles.hamburgerButton}
      >
        <span style={{ marginTop: "-2px" }}>☰</span>
        <span style={{ fontSize: "16px" }}>Filters</span>
      </button>

      {/* Filter Menu */}
      {isMenuOpen && (
        <div className={styles.filterMenu}>
          <h2>Shop By Filter</h2>
          
          <div style={{ marginBottom: "24px" }}>
            <div style={{ marginBottom: "24px" }}>
              <label>Price</label>
              <select
                name="priceSort"
                value={filters.priceSort}
                onChange={handleFilterChange}
              >
                <option value="">No Sorting</option>
                <option value="lowToHigh">Price: Lowest to Highest</option>
                <option value="highToLow">Price: Highest to Lowest</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label>Gold Quality</label>
              <select
                name="goldPurity"
                value={filters.goldPurity}
                onChange={handleFilterChange}
              >
                <option value="">All Purities</option>
                <option value="14">14K Gold</option>
                <option value="18">18K Gold</option>
                <option value="24">24K Pure Gold</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label>Chain Style</label>
              <select
                name="chainStyle"
                value={filters.chainStyle}
                onChange={handleFilterChange}
              >
                <option value="">All Styles</option>
                <option value="Cable">Cable Style</option>
                <option value="Figaro">Figaro Style</option>
                <option value="Rope">Rope Style</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label>Thickness</label>
              <select
                name="thickness"
                value={filters.thickness}
                onChange={handleFilterChange}
              >
                <option value="">All Thicknesses</option>
                <option value="1.5mm">1.5mm</option>
                <option value="2mm">2mm</option>
                <option value="3mm">3mm</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label>Length</label>
              <select
                name="length"
                value={filters.length}
                onChange={handleFilterChange}
              >
                <option value="">All Lengths</option>
                <option value="18in">18in</option>
                <option value="20in">20in</option>
                <option value="24in">24in</option>
              </select>
            </div>

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

      <div id="map" className={styles.mapContainer} />
    </div>
  );
};

export default MapComponent;