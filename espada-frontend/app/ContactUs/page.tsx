"use client"
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactUs(){
  return(
    <>
      <Header />
      <main>
        <div className=" bg-[url('/nyc.jpg')] h-screen w-full bg-cover flex items-center flex-col p-4 min-h-screen  justify-center bg-center bg-no-repeat">
        
          <div className="flex flex-col md:flex-row gap-10">
            <div className=" bg-black/70 text-gray-100 p-10 rounded-lg shadow-lg w-80 flex flex-col items-center space-y-4 ring-1 ring-yellow-500/30">
            <FaPhoneAlt size={40} className="text-yellow-400 mb-2" />
            
            <h2 className="text-2xl font-bold mb-4">Call Us</h2>
            <p className="font-semibold text-lg mb-3"> +1(123)-456-2233</p>
            <div className="text-center text-sm space-y-2">
              <p className="font-bold ">Phone Hours:</p>
              <p>Monday-Friday: 9:00 am - 7:00 pm</p>
              
              <p>Saturday & Sunday: 10:00 am - 4:00 pm</p>
              
             </div>
            </div>

            <div className=" bg-black/70 text-gray-100 p-10 rounded-lg shadow-lg w-80 flex flex-col items-center space-y-4 ring-1 ring-yellow-500/30">
              <MdEmail size={40} className="text-yellow-400 mb-2"/>

              <h2 className="text-2xl font-bold mb-4">Email Us</h2>
              <p className="text-lg font-semibold mb-2">support@gmail.com</p>
              <p className="text-center text-sm">Submit an email and we will get back to you soon! </p>
            <div className="text-center text-sm space-y-2">
              <p className="font-bold">Email Hours:</p>
              <p>Monday-Friday: 9:00 am - 7:00 pm</p>
              
              <p>Saturday &Sunday: 10:00 am - 4:00 pm</p>
             </div>
            </div>
            
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}