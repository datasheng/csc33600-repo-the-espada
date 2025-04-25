"use client"
import { motion } from "framer-motion"
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-500 to-black">
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] gap-8 pt-[60px]">
        <h1 className="text-2xl font-semibold font-sans text-center">Welcome to Espada! We make sure you never have to overspend on gold ever again...</h1>
        <motion.button 
          className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg"
          whileHover={{
            scale: 1.05,
            backgroundColor: "blue-600"
          }}
          whileTap={{
            scale: 0.95,
            backgroundColor: "blue-700"
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10
          }}
        >
          Get Started
        </motion.button>
      </main>
      <Footer />
    </div>
  );
}