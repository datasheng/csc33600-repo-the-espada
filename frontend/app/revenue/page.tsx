"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Subscription {
    subscriptionID: number;
    ownerID: number;
    start_date: string;
    end_date: string;
    join_fee: number;
}

interface ReportsResponse {
    reports: Subscription[];
    total: number;
}

const RevenuePage = () => {
    const [reports, setReports] = useState<Subscription[]>([]);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<ReportsResponse>('http://localhost:5000/api/reports', { withCredentials: true });
                setReports(response.data.reports);
                setTotalRevenue(response.data.total);
            } catch (error: any) {
                console.error('Error fetching subscription data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-[80px] pb-[60px] px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-black rounded-lg p-8 shadow-xl">
                        <h1 className="text-3xl text-yellow-400 font-bold mb-6">Subscription Data</h1>
                        <div className="overflow-x-auto">
                            <div className="mb-6 p-4 bg-gray-200 rounded-lg">
                                <span className="text-gray-800 text-lg font-semibold">Total Revenue: </span>
                                <span className="text-yellow-600 text-lg font-bold">
                                    ${Number(totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-800">
                                        <th className="py-3 px-6 text-gray-300">Subscription ID</th>
                                        <th className="py-3 px-6 text-gray-300">Owner ID</th>
                                        <th className="py-3 px-6 text-gray-300">Start Date</th>
                                        <th className="py-3 px-6 text-gray-300">End Date</th>
                                        <th className="py-3 px-6 text-gray-300">Join Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.length ? (
                                        reports.map((item, index) => (
                                            <tr key={item.subscriptionID} className="border-b border-gray-700 hover:bg-gray-700">
                                                <td className="py-3 px-6 text-white">{item.subscriptionID}</td>
                                                <td className="py-3 px-6 text-white">{item.ownerID}</td>
                                                <td className="py-3 px-6 text-gray-300">
                                                    {new Date(item.start_date).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-6 text-gray-300">
                                                    {new Date(item.end_date).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-6 text-yellow-400 font-bold">
                                                    ${Number(item.join_fee).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-4 text-center text-gray-300">
                                                No subscription data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RevenuePage;


