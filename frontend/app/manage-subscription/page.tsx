"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Subscription {
    subscriptionID: number;
    ownerID: number;
    start_date: string;
    end_date: string;
    join_fee: number;
}

export default function ManageSubscription() {
    const router = useRouter();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const ownerID = localStorage.getItem('ownerID');
                if (!ownerID) {
                    router.replace('/signup');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/subscriptions/${ownerID}`);
                if (!response.ok) throw new Error('Failed to fetch subscription');

                const data = await response.json();
                setSubscription(data);
            } catch (err) {
                console.error('Error fetching subscription:', err);
                setError('Failed to load subscription data');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, [router]);

    const calculateTimeLeft = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        
        if (months > 0) {
            return `${months} months and ${days % 30} days`;
        }
        return `${days} days`;
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-black rounded-lg p-8 shadow-xl">
                        <h1 className="text-3xl font-bold text-yellow-400 mb-8">
                            Subscription Status
                        </h1>

                        {loading ? (
                            <div className="text-white">Loading subscription details...</div>
                        ) : error ? (
                            <div className="text-red-400">{error}</div>
                        ) : subscription ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-gray-400 text-sm">Start Date</h3>
                                        <p className="text-white text-lg">
                                            {new Date(subscription.start_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-400 text-sm">End Date</h3>
                                        <p className="text-white text-lg">
                                            {new Date(subscription.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-gray-400 text-sm">Time Remaining</h3>
                                    <p className="text-yellow-400 text-xl font-bold">
                                        {calculateTimeLeft(subscription.end_date)} left
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-gray-400 text-sm">Subscription Fee Paid</h3>
                                    <p className="text-white text-lg">
                                        ${Number(subscription.join_fee).toFixed(2)}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-gray-700">
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-500 transition-colors"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-white">No subscription found.</div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}