"use client"

import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCrown, FaRegClock, FaGem, FaLock } from 'react-icons/fa';
import { HiChip } from 'react-icons/hi';
import Image from 'next/image';

// Add this function at the top level of your component
const scrollToFeatures = () => {
  document.querySelector('#premium-benefits')?.scrollIntoView({ 
    behavior: 'smooth' 
  });
};

export default function AboutLinkCard() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <section className="relative bg-gradient-to-r from-black via-red-900 to-black text-white py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 via-[#DAA520]/10 to-[#FFD700]/10 opacity-10"></div>
          <div className="container mx-auto px-4 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Left Content */}
              <div className="text-left space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                >
                  Introducing the GoldLinks LinkCard
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-300"
                >
                  Your Key to Unlocking Exclusive Gold Chain Deals
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href="/linkcard-signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                    >
                      Apply Now
                    </motion.button>
                  </Link>
                  <button 
                    onClick={scrollToFeatures}
                    className="border-2 border-[#FFD700] text-[#FFD700] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#FFD700]/10 transition-all w-full sm:w-auto"
                  >
                    Learn More
                  </button>
                </motion.div>
              </div>
              
              {/* Right Content - Card Preview */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="relative w-full aspect-[16/9] bg-gradient-to-r from-black via-black to-gray-900 rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-300">
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Card Top Section */}
                    <div className="flex justify-between items-start">
                      <Image
                        src="/goldlinks-header-logo.svg"
                        alt="GoldLinks"
                        width={100}  // Increased from 80
                        height={40}  // Increased from 30
                        className="h-10 w-auto object-contain [clip-path:inset(1px)]"  // Increased from h-8
                      />
                      <span className="text-[#FFD700] font-medium text-xl">LinkCard</span>
                    </div>
                    
                    {/* Card Middle Section */}
                    <div className="flex items-center space-x-1 my-4"> {/* Changed from space-x-4 to space-x-2 */}
                      {/* Contactless Payment Icon */}
                      <Image
                        src="/contactless-icon.svg"
                        alt="Contactless payment"
                        width={45}
                        height={45}
                        className="text-[#FFD700] rotate-30"
                      />

                      {/* EMV Chip */}
                      <div className="relative w-[61px] h-[50px]">
                        <div className="absolute inset-0 bg-[#000000] rounded-md">
                            <svg
                            viewBox="0 0 61 50"
                            className="w-full h-full"
                            fill="none"
                            stroke="black"
                            strokeWidth="1"
                            >
                            <mask id="chipMask">
                              <rect width="100%" height="100%" fill="white"/>
                              <path 
                              fill="none" 
                              stroke="black" 
                              strokeWidth="3" 
                              d="M9,8c0,0,4.3,0,7.2,0c2.8,0,3.8,2,3.8,4s-1,6-4,6H0 M20,51.2c0,0,3.5-2.7,3.5-8.7c0-4-4-10-9-10s-15,0-15,0 M14.5,18.5V31 M47.8,8c0,0-7.3-0.5-7.1,5c0.1,2.6,1.8,5.5,6.3,5.5c5.3-0.1,14.9-0.5,14.9-0.5 M61.4,32.5c0,0-10.1,0-15.1,0s-9.1,6-9.1,10c0,6,3.5,8.7,3.5,8.7 M46.3,18.5V31"
                              />
                            </mask>
                            <rect
                              mask="url(#chipMask)"
                              width="100%"
                              height="100%"
                              fill="#FFD700"
                              rx="5"
                              ry="5"
                            />
                            </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Bottom Section */}
                    <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <div className="text-[#FFD700] font-mono text-2xl">**** **** **** 1234</div>
                        <div className="text-[#FFD700]/60 text-base font-medium">CARD HOLDER NAME</div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-[#FFD700]/60 text-sm">VALID THRU</div>
                        <div className="text-[#FFD700] font-mono text-xl">MM/DD</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Holographic Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="premium-benefits" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Premium Benefits</h2>
              <p className="text-gray-600">Unlock exclusive perks and privileges with your GoldLinks LinkCard</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { icon: FaCrown, title: "Exclusive Discounts", desc: "Special pricing on premium gold chains" },
                { icon: FaRegClock, title: "Early Access", desc: "Be first to shop flash sales" },
                { icon: FaGem, title: "Loyalty Points", desc: "Earn points on every purchase" },
                { icon: FaLock, title: "Private Vault", desc: "Access to premium collections" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <feature.icon className="text-4xl text-[#FFD700] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-r from-black via-red-900 to-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 via-[#DAA520]/10 to-[#FFD700]/10 opacity-10"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-6"
              >
                Ready to Experience Luxury?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 mb-8"
              >
                Join the exclusive community of GoldLinks LinkCard holders today.
              </motion.p>
              <Link href="/linkcard-signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Apply for LinkCard Now
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}