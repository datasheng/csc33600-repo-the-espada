"use client"
import { useState, useEffect } from 'react';

export default function Latest() {
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-2/5 max-h-[700px] overflow-y-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-7 mt-5">Latest Purchases</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="py-3 px-4 text-left font-semibold">User</th>
                            <th className="py-3 px-4 text-left font-semibold">Date</th>
                            <th className="py-3 px-4 text-left font-semibold">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Example rows */}
                        <tr className="border-b hover:bg-gray-100">
                            <td className="py-3 px-4 text-gray-800">John Doe</td>
                            <td className="py-3 px-4 text-gray-600">2023-09-15</td>
                            <td className="py-3 px-4 text-[#FFD700] font-bold">$199.99</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-100">
                            <td className="py-3 px-4 text-gray-800">Jane Smith</td>
                            <td className="py-3 px-4 text-gray-600">2023-09-14</td>
                            <td className="py-3 px-4 text-[#FFD700] font-bold">$189.99</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-100">
                            <td className="py-3 px-4 text-gray-800">Alex Johnson</td>
                            <td className="py-3 px-4 text-gray-600">2023-09-13</td>
                            <td className="py-3 px-4 text-[#FFD700] font-bold">$179.99</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}