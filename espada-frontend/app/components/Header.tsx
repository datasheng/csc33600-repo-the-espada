"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const chainPurities = ["10K", "14K", "18K", "22K"];
  const chainTypes = [
    "Anchor",
    "Ball",
    "Box",
    "Byzantine",
    "Cable",
    "Figaro",
    "Figarope",
    "FlatCurb",
    "Franco",
    "Herringbone",
    "Link",
    "Mariner",
    "MiamiCuban",
    "MoonCut",
    "Rope",
    "Wheat"
  ];

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
    setActiveSubmenu(null);
  };

  const handleSubmenuClick = (e: React.MouseEvent, submenu: string) => {
    e.stopPropagation();
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  };

  // Split chain types into two columns
  const midpoint = Math.ceil(chainTypes.length / 2);
  const leftColumnTypes = chainTypes.slice(0, midpoint);
  const rightColumnTypes = chainTypes.slice(midpoint);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.dropdown}`)) {
        setIsDropdownOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <Link href="/heroSection" className={styles.logoLink}>
        <Image
          src="/goldlinks-header-logo.svg"
          alt="GoldLinks Logo"
          width={240}
          height={60}
          className={styles.logo}
        />
      </Link>
      
      <nav className={styles.nav}>
        <div className={styles.dropdown}>
          <button 
            className={styles.dropdownButton}
            onClick={handleDropdownClick}
          >
            Find Gold Chains
            <span className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.open : ''}`}>▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className={styles.dropdownContent}>
              <Link href="/search" className={styles.dropdownItem}>Search</Link>
              
              <div 
                className={styles.dropdownItem}
                onClick={(e) => handleSubmenuClick(e, 'purity')}
                data-submenu="purity"
              >
                By Purity
                <span className={`${styles.submenuArrow} ${activeSubmenu === 'purity' ? styles.open : ''}`}>▶</span>
                
                {activeSubmenu === 'purity' && (
                  <div className={styles.submenuContent}>
                    {chainPurities.map(purity => (
                      <Link key={purity} 
                            href={`/Map?filter=purity&value=${purity}`} 
                            className={styles.dropdownItem}>
                        {purity}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <div 
                className={styles.dropdownItem}
                onClick={(e) => handleSubmenuClick(e, 'type')}
                data-submenu="type"
              >
                By Chain Type
                <span className={`${styles.submenuArrow} ${activeSubmenu === 'type' ? styles.open : ''}`}>▶</span>
                
                {activeSubmenu === 'type' && (
                  <div className={styles.submenuContent}>
                    <div className={styles.twoColumnSubmenu}>
                      <div className={styles.submenuColumn}>
                        {leftColumnTypes.map(type => (
                          <Link key={type} 
                                href={`/Map?filter=chainType&value=${type}`} 
                                className={styles.dropdownItem}>
                            {type}
                          </Link>
                        ))}
                      </div>
                      <div className={styles.submenuColumn}>
                        {rightColumnTypes.map(type => (
                          <Link key={type} 
                                href={`/Map?filter=chainType&value=${type}`} 
                                className={styles.dropdownItem}>
                            {type}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/search" className={`${styles.dropdownItem} ${styles.seeAllButton}`}>
                      See All Chain Types
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <Link href="/Map" className={styles.navLink}>Map</Link>
        <Link href="/AboutUs" className={styles.navLink}>About Us</Link>
        <Link href="/ContactUs" className={styles.navLink}>Contact</Link>
        <Link href="/login" className={styles.authButton}>Login</Link>
        <Link href="/signup" className={styles.authButton}>Sign Up</Link>
      </nav>
    </header>
  );
};

export default Header;