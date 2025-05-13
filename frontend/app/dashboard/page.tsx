'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import ProductManagement from '../components/ProductManagement';
import StoreTimingManagement from '../components/StoreTimingManagement';
import Header from '../components/Header';
import Footer from '../components/Footer';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-[60px]">
        <div className="bg-black py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl ring-1 ring-[#FFD700]/30">
              <div className="px-4 py-5 sm:p-6">
                <h1 className="text-2xl font-semibold text-[#FFD700] mb-6">Business Dashboard</h1>
                
                <Tab.Group onChange={setSelectedTab}>
                  <Tab.List className="flex space-x-1 rounded-xl bg-black/50 p-1 ring-1 ring-[#FFD700]/30">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                          'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#FFD700] focus:outline-none focus:ring-2',
                          selected
                            ? 'bg-[#FFD700] text-black shadow'
                            : 'text-[#FFD700] hover:bg-[#FFD700]/10 hover:text-[#FFD700]'
                        )
                      }
                    >
                      Product Management
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                          'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#FFD700] focus:outline-none focus:ring-2',
                          selected
                            ? 'bg-[#FFD700] text-black shadow'
                            : 'text-[#FFD700] hover:bg-[#FFD700]/10 hover:text-[#FFD700]'
                        )
                      }
                    >
                      Store Timings
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="mt-6">
                    <Tab.Panel>
                      <div className="bg-black/50 rounded-lg p-6 ring-1 ring-[#FFD700]/30">
                        <h2 className="text-xl font-semibold mb-4 text-[#FFD700]">Product Management</h2>
                        <ProductManagement />
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="bg-black/50 rounded-lg p-6 ring-1 ring-[#FFD700]/30">
                        <h2 className="text-xl font-semibold mb-4 text-[#FFD700]">Store Timings</h2>
                        <StoreTimingManagement />
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 