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
        
          <div className="bg-black text-white p-8 rounded-lg ">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-50">ContactUS</h1>
            <a  href="mailto:support@gmail.com"className="text-gray-50 mb-6  text-lg   flex items-center hover:bg-black-700 space-x-2  hover:text-indigo-500 ">
              <MdEmail size={24}/>
              <span>Email: support@gmail.com</span>
            </a>
            <a href="tel:+1234567890" className="text-gray-50 text-lg flex items-center space-x-2 hover:text-indigo-500">
                <FaPhoneAlt size={24} className="text-gray-50" /> {/* Correctly passing className and size */}
                <span>Phone: +1 (234) 567-890</span>
              </a>
            
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}