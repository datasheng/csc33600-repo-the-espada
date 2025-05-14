"use client"
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <Image
            src="/footer-logo-design.svg"
            alt="GoldLinks Logo"
            width={150}
            height={38}
            className={styles.footerLogo}
          />
        </div>
        
        <div className={styles.section}>
          <h3>Features</h3>
          <ul>
            <li><Link href="/search">Find Gold Chains</Link></li>
            <li><Link href="/map">Map</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Company</h3>
          <ul>
            <li><Link href="/about-us">About</Link></li>
            <li><Link href="/contact-us">Contact</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Socials</h3>
          <ul>
            <li><Link href="https://instagram.com" target="_blank">Instagram</Link></li>
            <li><Link href="https://twitter.com" target="_blank">Twitter/X</Link></li>
            <li><Link href="https://facebook.com" target="_blank">Facebook</Link></li>
            <li><Link href="https://linkedin.com" target="_blank">LinkedIn</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Sign Up For Our Newsletter</h3>
          <div className={styles.emailInput}>
            <input 
              type="email" 
              placeholder="Enter your email address"
              className={styles.subscribeInput}
            />
            <button className={styles.subscribeButton}>Subscribe</button>
          </div>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <p>&copy; 2025 GoldLinks. All rights reserved.</p>
      </div>
    </footer>
  );
}