"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

// Update the type definition to be more specific
type ChainType = string | {
  name: string;
  value: string;
  special: boolean;
};

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  // Update the chainTypes array with proper typing
  const chainTypes: ChainType[] = [
    "Anchor",
    "Ball",
    "Box",
    "Byzantine",
    "Cable",
    "Figaro",
    "Figarope",
    "Flat Curb",
    "Franco",
    "Herringbone",
    "Mariner",
    "Miami Cuban",
    "Moon Cut",
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

  // First, let's update the column splitting logic to maintain proper typing
  const splitChainTypes = (types: ChainType[]): [ChainType[], ChainType[]] => {
    const midpoint = Math.ceil(types.length / 2);
    return [types.slice(0, midpoint), types.slice(midpoint)];
  };

  // Update the column variables
  const [leftColumnTypes, rightColumnTypes] = splitChainTypes(chainTypes);

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
                    {[
                      { value: '10', label: '10K Gold' },
                      { value: '14', label: '14K Gold' },
                      { value: '18', label: '18K Gold' },
                      { value: '22', label: '22K Gold' },
                      { value: '24', label: '24K Pure Gold' },
                      { value: '', label: 'See All', special: true }
                    ].map(purity => (
                      <Link 
                        key={purity.value} 
                        href={`/search?filter=goldPurity&value=${purity.value}&showResults=true`} // Add showResults parameter
                        className={`${styles.dropdownItem} ${purity.special ? styles.seeAllButton : ''}`}
                      >
                        {purity.label}
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
                By Type
                <span className={`${styles.submenuArrow} ${activeSubmenu === 'type' ? styles.open : ''}`}>▶</span>
                
                {activeSubmenu === 'type' && (
                  <div className={styles.submenuContent}>
                    <div className={styles.twoColumnSubmenu}>
                      <div className={styles.submenuColumn}>
                        {leftColumnTypes.map(type => {
                          const isSpecialType = typeof type !== 'string';
                          const displayName = isSpecialType ? type.name : type;
                          const linkValue = isSpecialType ? type.value : type.replace(' Chain', '');
                          
                          return (
                            <Link 
                              key={displayName}
                              href={`/search?filter=chainStyle&value=${linkValue}&showResults=true`} // Add showResults parameter
                              className={styles.dropdownItem}
                            >
                              {displayName}
                            </Link>
                          );
                        })}
                      </div>
                      <div className={styles.submenuColumn}>
                        {[
                          ...rightColumnTypes,
                          { name: "See All", value: "", special: true } // Moved to end of right column
                        ].map(type => {
                          const isSpecialType = typeof type !== 'string';
                          const displayName = isSpecialType ? type.name : type;
                          const linkValue = isSpecialType ? type.value : type.replace(' Chain', '');
                          
                          return (
                            <Link 
                              key={displayName}
                              href={`/search?filter=chainStyle&value=${linkValue}&showResults=true`} // Add showResults parameter
                              className={`${styles.dropdownItem} ${isSpecialType && type.special ? styles.seeAllButton : ''}`}
                            >
                              {displayName}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
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