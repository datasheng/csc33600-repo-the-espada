"use client"
import { motion } from "framer-motion"
import Header from './components/Header'
import Footer from './components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import './home.css'
import { UsersIcon, ShoppingBagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import GoldChatbot from './components/GoldChatbot'

export default function Home() {
  const [currentBg, setCurrentBg] = useState(1);

  const scrollToSection = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    const headerOffset = 30; // Adjust this value to control scroll position
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative flex min-h-[calc(100vh-120px)] pt-[60px]">
        {/* Background Container */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Front Layer */}
          <div 
            className={`absolute inset-0 transition-opacity duration-1000 opacity-10`}
            style={{
              backgroundImage: 'url("/hero-background.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1
            }}
          />
          {/* Back Layer with gradient */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 70%, white 100%)',
              zIndex: 2
            }}
          />
        </div>
        
        {/* Content Container - increased z-index */}
        <div className="container mx-auto px-4 flex items-center relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 w-full">
            {/* Left Column - Text Content */}
            <motion.div 
              className="flex-1 max-w-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-black mb-6 leading-tight">
                $olid <span className="text-[#FFD700]">Gold</span> Chain $hopping
                <br />
                <span className="text-[#e72114]">$implified.</span>
              </h1>
              
              <p className="text-lg font-bold text-gray-600 mb-8 leading-relaxed">
                GoldLinks scans real-time prices from the top jewelry stores around—online and local— and compiles it all in one place so that you never overpay again. Compare prices, track trends, and shop smarter.
              </p>
              
              <div className="flex gap-4">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    transition: { ease: "easeOut", duration: 0.2 }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { ease: "easeOut", duration: 0.2 }
                  }}
                >
                  <Link 
                    href="/map"
                    className="primaryButton"
                  >
                    Compare Prices Now
                  </Link>
                </motion.div>

                <Link href="#how-it-works">
                  <motion.button
                    onClick={(e) => scrollToSection(e, 'how-it-works')}
                    whileHover={{
                      scale: 1.05,
                      transition: { ease: "easeOut", duration: 0.2 }
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: { ease: "easeOut", duration: 0.2 }
                    }}
                    className="secondaryButton"
                  >
                    How It Works
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right Column - Visual */}
            <motion.div 
              className="flex-1 relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="rounded-lg shadow-2xl w-full h-auto"
              >
                <source src="/hero-chains.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Fade-out transition - adjusted position */}
      <div className="h-24 bg-gradient-to-b from-transparent to-white relative z-20 -mt-24"></div>

      {/* Social Proof Section - added z-index */}
      <section className="bg-white py-16 relative z-30">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl text-gray-700 mb-12">
            Join thousands finding the best gold prices every day
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Users Metric */}
            <div className="text-center">
              <div className="mb-4 mx-auto w-16 h-16">
                <UsersIcon className="w-16 h-16 text-gray-800" />
              </div>
              <div className="text-4xl font-bold text-[#FFD700] mb-2">10K+</div>
              <p className="text-gray-600">Gold Chain Listings</p>
            </div>

            {/* Stores Metric */}
            <div className="text-center">
              <div className="mb-4 mx-auto w-16 h-16">
                <ShoppingBagIcon className="w-16 h-16 text-gray-800" />
              </div>
              <div className="text-4xl font-bold text-[#FFD700] mb-2">100+</div>
              <p className="text-gray-600">Included Jewelry Stores</p>
            </div>

            {/* Savings Metric */}
            <div className="text-center">
              <div className="mb-4 mx-auto w-16 h-16">
                <CurrencyDollarIcon className="w-16 h-16 text-gray-800" />
              </div>
              <div className="text-4xl font-bold text-[#FFD700] mb-2">$2M+</div>
              <p className="text-gray-600">Customer Savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Journey Section */}
      <section id="how-it-works" className="bg-white py-16 relative z-30">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-4xl font-bold text-black mb-16">
            How GoldLinks Works
          </h2>
          
          <div className="max-w-6xl mx-auto space-y-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 order-2 md:order-1">
                <div className="relative mb-6">
                  <span className="text-[#FFD700] text-xl font-bold mb-2 block">Step 1</span>
                  <h3 className="text-3xl font-bold mb-4">Explore the Map</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Open the map to see jewelry stores near you and online listings at a glance. Our interactive map shows you all the gold chain retailers in your area, making it easy to plan your shopping route.
                  </p>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg shadow-2xl w-full h-auto journeyImage"
                >
                  <source src="/journey/map-view.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg shadow-2xl w-full h-auto journeyImage"
                >
                  <source src="/journey/filters.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="flex-1">
                <div className="relative mb-6">
                  <span className="text-[#FFD700] text-xl font-bold mb-2 block">Step 2</span>
                  <h3 className="text-3xl font-bold mb-4">Apply Filters</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Tap the Filters button to select your preferred chain type, karat, price range, and more. Our comprehensive filtering system helps you find exactly what you're looking for, from chain style to specific dimensions.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 order-2 md:order-1">
                <div className="relative mb-6">
                  <span className="text-[#FFD700] text-xl font-bold mb-2 block">Step 3</span>
                  <h3 className="text-3xl font-bold mb-4">Compare Listings</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                    Dive into the product pages to see detailed chain specifications, retail prices, and the latest user-reported purchases. Each page provides all the information you need to make an informed decision, and you can even report your own prices to help others in the community.
                    </p>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg shadow-2xl w-full h-auto journeyImage"
                >
                  <source src="/journey/compare.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg shadow-2xl w-full h-auto journeyImage"
                >
                  <source src="/journey/store-details.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="flex-1">
                <div className="relative mb-6">
                  <span className="text-[#FFD700] text-xl font-bold mb-2 block">Step 4</span>
                  <h3 className="text-3xl font-bold mb-4">View Store Details</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                    Visit the store's page to explore detailed information, including store hours, contact details, and available gold chain products. You'll also find a user ratings section, where you can input your own rating, and a direct link to navigate to the store via Google Maps.
                    </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center mt-24">
            <Link href="/map">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black text-[#FFD700] font-bold rounded-md text-lg shadow-lg hover:bg-[#FFD700] hover:text-black transition-all duration-200"
              >
                Explore The Map
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <GoldChatbot />
    </div>
  );
}