"use client"

import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
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