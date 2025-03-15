"use client"
import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"

// Define HamburgerIcon component directly in this file
function HamburgerIcon({ isOpen, toggleMenu }: { isOpen: boolean; toggleMenu: () => void}) {
  return (
    <button
      onClick={toggleMenu}
      className = "bg-transparent border-none cursor-pointer p-0 z-10"
    >
      <motion.div
        className = "w-[25px] h-[3px] bg-gray-800 my-1"
        animate = {{
          rotate: isOpen ? 45:0,
          translateY: isOpen ? 8:0
        }}
      />

      <motion.div
        className = "w-[25px] h-[3px] bg-gray-800 my-1"
        animate = {{
          opacity: isOpen ? 0:1
        }}
      />
      <motion.div
        className = "w-[25px] h-[3px] bg-gray-800 my-1"
        animate = {{
          rotate: isOpen ? -45:0,
          translateY: isOpen ? -8:0
        }}
      />

      <motion.div
      
      />
    </button>
  );
}

export default function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-5 min-h-screen bg-gradient-to-br from-white via-yellow-500 to-black">
      <header className="flex justify-between items-center pb-5">
        <HamburgerIcon 
          isOpen = {isOpen}
          toggleMenu = {() => setIsOpen(!isOpen)}
        />
        <div className="text-2xl font-bold">Espada</div>
      </header>
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] gap-8">
        <h1 className="text-2xl font-semibold font-sans text-center">Welcome to Espada! We make sure you never have to overspend on gold ever again...</h1>
        <motion.button className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg"
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
    </div>
  );
}