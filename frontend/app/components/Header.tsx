"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  isLoggedIn: boolean; // Define the prop type
}

// Update the type definition to be more specific
type ChainType = string | {
  name: string;
  value: string;
  special: boolean;
};

const Header: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
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

  useEffect(() => {
    const checkAuthStatus = async () => {
      const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
      const role = localStorage.getItem("userRole");
      const ownerID = localStorage.getItem("ownerID");
      
      setIsLoggedIn(loggedInStatus);

      if (loggedInStatus) {
        if (role === 'business') {
          // For business users
          if (ownerID) {
            // Business user with store - show dashboard only
            setUserRole('business');
            
            // If they try to access profile page, redirect to dashboard
            if (window.location.pathname === '/profile') {
              router.replace('/dashboard');
            }
          } else {
            // Business user without store - redirect to setup
            setUserRole('shopper'); // Temporarily set as shopper until setup complete
            router.replace('/business-setup');
          }
        } else {
          // For regular shoppers
          setUserRole('shopper');
          
          // If they try to access dashboard, redirect to profile
          if (window.location.pathname === '/dashboard') {
            router.replace('/profile');
          }
        }
      } else {
        setUserRole(null);
      }
    };

    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userID");
    localStorage.removeItem("userRole");
    localStorage.removeItem("ownerID"); // Add this line to clear ownerID
    setIsLoggedIn(false);
    setUserRole(null); // Add this line to reset userRole state
    
    router.push('/');
    router.refresh();
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}>
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
            FIND GOLD CHAINS
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
                        href={`/search?filter=goldPurity&value=${purity.value}&showResults=true`}
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
                              href={`/search?filter=chainStyle&value=${linkValue}&showResults=true`}
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
                          { name: "See All", value: "", special: true }
                        ].map(type => {
                          const isSpecialType = typeof type !== 'string';
                          const displayName = isSpecialType ? type.name : type;
                          const linkValue = isSpecialType ? type.value : type.replace(' Chain', '');
                          
                          return (
                            <Link 
                              key={displayName}
                              href={`/search?filter=chainStyle&value=${linkValue}&showResults=true`}
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
        <Link href="/map" className={styles.navLink}>MAP</Link>
        <Link href="/about-us" className={styles.navLink}>ABOUT</Link>
        <Link href="/contact-us" className={styles.navLink}>CONTACT</Link>
        {isLoggedIn ? (
          <>
            {userRole === 'business' && localStorage.getItem('ownerID') ? (
              <Link href="/dashboard" className={styles.navLink}>DASHBOARD</Link>
            ) : (
              <Link href="/profile" className={styles.authButton}>PROFILE</Link>
            )}
            <button
              onClick={handleSignOut}
              className={styles.authButton}
            >
              SIGN OUT
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.authButton}>LOG IN</Link>
            <Link href="/signup" className={styles.authButton}>SIGN UP</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;