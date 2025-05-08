"use client"
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactUs(){
  return(
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-[url('/nyc.jpg')] min-h-screen bg-cover bg-center bg-no-repeat relative">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-20 flex items-center justify-center min-h-screen">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 max-w-5xl w-full">
              {/* Phone Card */}
              <div className="flex-1 bg-black/80 backdrop-blur-sm text-gray-100 p-8 rounded-xl shadow-2xl ring-1 ring-yellow-500/30 hover:ring-yellow-500/50 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaPhoneAlt size={48} className="text-yellow-400 mb-4" />
                  <h2 className="text-3xl font-bold mb-6">Call Us</h2>
                  <p className="font-semibold text-xl mb-6 text-yellow-400">+1 (123) 456-2233</p>
                  <div className="space-y-4 w-full">
                    <h3 className="font-bold text-lg border-b border-yellow-500/30 pb-2">Phone Hours</h3>
                    <div className="space-y-2">
                      <p className="text-base">Monday-Friday: <span className="text-yellow-400">9:00 am - 7:00 pm</span></p>
                      <p className="text-base">Saturday & Sunday: <span className="text-yellow-400">10:00 am - 4:00 pm</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex-1 bg-black/80 backdrop-blur-sm text-gray-100 p-8 rounded-xl shadow-2xl ring-1 ring-yellow-500/30 hover:ring-yellow-500/50 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <MdEmail size={48} className="text-yellow-400 mb-4"/>
                  <h2 className="text-3xl font-bold mb-6">Email Us</h2>
                  <p className="text-xl font-semibold mb-6 text-yellow-400">support@goldlinks.com</p>
                  <div className="space-y-4 w-full">
                    <h3 className="font-bold text-lg border-b border-yellow-500/30 pb-2">Email Hours</h3>
                    <div className="space-y-2">
                      <p className="text-base">Monday-Friday: <span className="text-yellow-400">9:00 am - 7:00 pm</span></p>
                      <p className="text-base">Saturday & Sunday: <span className="text-yellow-400">10:00 am - 4:00 pm</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}