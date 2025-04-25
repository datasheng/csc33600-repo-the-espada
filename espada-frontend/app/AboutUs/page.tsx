"use client"
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function AboutUs() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-[url('/background.jpg.jpg')] h-screen w-full bg-cover flex items-center flex-col p-4 min-h-screen  justify-center bg-center bg-no-repeat">
          <h1 className="text-4xl font-extrabold mb-6 ">About US</h1>
          <p className="text-black-600 mb-6">Welcome to our website!!!</p>
          <button className="bg-indigo-600 text-white rounded-full px-6 py-3 hover:bg-indigo-700 hover:scale-105 transition duration-300 ">Contact US</button>
        </div>
      </main>
      <Footer />
    </>
  )
}