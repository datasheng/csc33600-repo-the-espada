"use client"
import Header from '../components/Header'
import Footer from '../components/Footer'
import { motion } from "framer-motion"
import Link from 'next/link'

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-[url('/hero-background.jpg')] relative min-h-screen w-full bg-cover flex items-center p-4 justify-center bg-center bg-no-repeat">
          {/* Overlay */}
          <div className='absolute inset-0 bg-gradient-to-b from-white/90 to-white/70'></div>

          {/* Content Container */}
          <motion.div 
            className='relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-x-10 max-w-6xl mx-auto px-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Welcome Text */}
            <div className='flex flex-col text-center md:text-right'>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
                WELCOME TO
              </h1>
              <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
                <span className='text-yellow-400'>GOLD</span>
                <span className='text-red-500'>LINKS</span>
              </h1>
            </div>

            {/* Divider */}
            <div className='hidden md:block h-52 border-l-4 border-black/80'></div>

            {/* Description and Button */}
            <div className='max-w-md space-y-6 text-center md:text-left'>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-800">
                GoldLinks is a community-driven platform revolutionizing the way you buy gold chains.
                We help you find the best deals by comparing real-time prices from trusted local and online stores.
                Backed by user reviews and live updates, GoldLinks ensures transparency, saves you money, and protects you from scams — all in one easy-to-use platform.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/"
                  className="inline-block px-8 py-4 bg-black text-yellow-400 font-bold rounded-lg
                    shadow-lg hover:bg-yellow-400 hover:text-black transition-all duration-300"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}