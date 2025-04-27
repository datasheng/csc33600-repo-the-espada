"use client"
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function AboutUs() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-[url('/hero-background.jpg')]  relative h-screen w-full bg-cover flex items-center p-4 min-h-screen  justify-center bg-center bg-no-repeat">

        <div className='absolute inset-0 bg-white/80 z-0'>
        </div>

        <div className='relative z-10 flex flex-row items-center gap-x-10 max-w-6xl'>

          <div className='flex flex-col text-right'>
          <h1 className="text-4xl font-extrabold mb-2 ">WELCOME TO</h1>
          <h1 className='text-4xl font-extrabold'  >
            <span className='text-yellow-400'>GOLD</span>
            <span className='text-red-500'>LINKS</span>
          </h1>
          </div>

          <div className=' h-52 border-l-4 border-black'></div>

          <div className='max-w-md mt-6 md:mt-0 text-center md:text-left'>
          <p className="text-lg font-medium ">GoldLinks is a community-driven platform revolutionizing the way you buy gold chains.
We help you find the best deals by comparing real-time prices from trusted local and online stores.
Backed by user reviews and live updates, GoldLinks ensures transparency, saves you money, and protects you from scams — all in one easy-to-use platform.</p>
          </div>
          
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}