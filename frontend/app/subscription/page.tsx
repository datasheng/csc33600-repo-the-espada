"use client"
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SubscriptionTier {
    name: string;
    price: number;
    equivalent: number;  // equivalent per month
    duration: string;
}

interface BillingInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

const subscriptionTiers: SubscriptionTier[] = [
    {
        name: "12 MONTHS",
        price: 699.99,
        equivalent: 58.33,
        duration: "every 12 months"
    },
    {
        name: "3 MONTHS",
        price: 209.99,
        equivalent: 70.00,
        duration: "every 3 months"
    },
    {
        name: "1 MONTH",
        price: 79.99,
        equivalent: 79.99,
        duration: "every month"
    }
];

const BUSINESS_FEATURES = [
    {
        title: "🏪 Store Management",
        features: [
            "Create & edit store profile",
            "Manage address and contact info",
            "Set business hours",
            "Phone and email support"
        ]
    },
    {
        title: "📦 Product Listings",
        features: [
            "Add/edit/delete gold chains",
            "Manage chain specifications (type, purity, color)",
            "Set weight, length, and pricing",
            "Update stock availability",
            "Real-time price updates",
            "View customer ratings and feedback"
        ]
    },
    {
        title: "📍 Search & Map Integration",
        features: [
            "Show in user searches by chain type",
            "Filter by price range and distance",
            "Interactive map location",
            "Dynamic store page linking",
        ]
    }
];

export default function Subscription() {
    const router = useRouter();
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [showBillingForm, setShowBillingForm] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [ownerID, setOwnerID] = useState<string | null>(null);
    const [billingInfo, setBillingInfo] = useState<BillingInfo>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });

    useEffect(() => {
        // Check if coming from signup flow
        const signupData = localStorage.getItem('signupData');
        if (!signupData) {
            router.push('/signup');
            return;
        }

        // Check if user is already logged in and has completed subscription
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const ownerID = localStorage.getItem('ownerID');
        if (isLoggedIn && ownerID) {
            router.push('/business-setup');
            return;
        }
    }, [router]);

    const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingInfo({
            ...billingInfo,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // 1. Create user account first
            const signupData = JSON.parse(localStorage.getItem('signupData') || '{}');
            const signupResponse = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    first_name: signupData.firstName,
                    last_name: signupData.lastName,
                    email: signupData.email,
                    password: signupData.password,
                    is_business: true
                })
            });

            const userData = await signupResponse.json();
            if (!signupResponse.ok) {
                throw new Error(userData.error || 'Signup failed');
            }

            // 2. Create subscription
            const selectedPlan = subscriptionTiers.find(tier => tier.name === selectedTier);
            if (!selectedPlan) throw new Error('No plan selected');

            const subscriptionResponse = await fetch('http://localhost:5000/api/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userID: userData.user.userID,
                    subscriptionType: selectedTier,
                    joinFee: selectedPlan.price
                })
            });

            const subscriptionData = await subscriptionResponse.json();
            if (!subscriptionResponse.ok) {
                throw new Error(subscriptionData.error || 'Failed to create subscription');
            }

            // Set all necessary flags at once
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', userData.user.userID.toString());
            localStorage.setItem('userRole', 'business');
            localStorage.setItem('ownerID', subscriptionData.data.ownerID.toString());
            localStorage.setItem('billingInfo', JSON.stringify({
                ...billingInfo,
                selectedPlan: selectedTier,
                subscriptionID: subscriptionData.data.subscription.subscriptionID
            }));

            // Remove signup data immediately
            localStorage.removeItem('signupData');

            // Use replace instead of push to prevent back navigation
            router.replace('/business-setup');

        } catch (error: any) {
            console.error('Payment/Signup error:', error);
            alert(error.message || 'An error occurred during signup. Please try again.');
        }
    };

    // Render error page for non-business users
    if (userRole === 'shopper') {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-black rounded-lg p-8 shadow-xl">
                            <h1 className="text-2xl text-[#FFD700] font-bold mb-4">
                                Business Account Required
                            </h1>
                            <p className="text-white mb-6">
                                You need a business account to access subscription plans. If you're a business owner, 
                                please create a business account.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-6 py-3 bg-transparent border border-[#FFD700] text-[#FFD700] rounded-lg font-bold hover:bg-[#FFD700] hover:text-black transition-colors"
                                >
                                    Return Home
                                </button>
                                <button
                                    onClick={() => router.push('/signup')}
                                    className="px-6 py-3 bg-[#FFD700] text-black rounded-lg font-bold hover:bg-[#e6c200] transition-colors"
                                >
                                    Create Business Account
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Choose Your Business Plan
                        </h1>
                        <p className="text-xl text-gray-600 mb-12">
                            Select the perfect plan for your business needs
                        </p>
                    </div>

                    {!showBillingForm ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {subscriptionTiers.map((tier) => (
                                <div
                                    key={tier.name}
                                    className={`rounded-lg shadow-lg overflow-hidden ${
                                        tier.name === "12 MONTHS" ? 'border-2 border-yellow-400 transform scale-105' : 'border border-gray-200'
                                    }`}
                                >
                                    {tier.name === "12 MONTHS" && (
                                        <div className="bg-yellow-400 text-black text-center py-2 font-semibold">
                                            Best Value
                                        </div>
                                    )}
                                    <div className="p-8 bg-white">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                            {tier.name}
                                        </h2>
                                        <p className="text-4xl font-bold text-gray-900 mb-2">
                                            ${tier.price}
                                            <span className="text-lg font-normal text-gray-500">
                                                {" "}{tier.duration}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600 mb-8">
                                            Equivalent to: ${tier.equivalent}/month
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedTier(tier.name);
                                                setShowBillingForm(true);
                                            }}
                                            className="w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-300 bg-gray-900 text-white hover:bg-gray-800"
                                        >
                                            Select Plan
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                            {/* Add selected plan summary */}
                            {selectedTier && (
                                <div className="mb-8 bg-gradient-to-r from-yellow-50 to-gray-50 rounded-xl border border-yellow-200 overflow-hidden">
                                    <div className="bg-yellow-400/10 px-6 py-3 border-b border-yellow-200">
                                        <h3 className="text-xl font-bold text-gray-900">Selected Plan</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="text-2xl font-bold text-gray-900">{selectedTier}</p>
                                                <p className="text-sm text-gray-600">
                                                    Billed {subscriptionTiers.find(tier => tier.name === selectedTier)?.duration}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-baseline">
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        ${subscriptionTiers.find(tier => tier.name === selectedTier)?.price}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    (${subscriptionTiers.find(tier => tier.name === selectedTier)?.equivalent}/month)
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-600 flex items-center">
                                                <svg 
                                                    className="h-5 w-5 text-green-500 mr-2" 
                                                    fill="none" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth="2" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor"
                                                >
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                All features included with {selectedTier.toLowerCase()} subscription
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>
                            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={billingInfo.cardNumber}
                                            onChange={handleBillingInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="1234 5678 9012 3456"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={billingInfo.expiryDate}
                                                onChange={handleBillingInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="MM/YY"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={billingInfo.cvv}
                                                onChange={handleBillingInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="123"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name on Card
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={billingInfo.name}
                                        onChange={handleBillingInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Billing Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={billingInfo.address}
                                        onChange={handleBillingInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                        required
                                    />
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="city"
                                                value={billingInfo.city}
                                                onChange={handleBillingInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="City"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="state"
                                                value={billingInfo.state}
                                                onChange={handleBillingInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="State"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={billingInfo.zipCode}
                                                onChange={handleBillingInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder="ZIP Code"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowBillingForm(false)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        ← Back to Plans
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
                                    >
                                        Complete Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                <div className="mt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">
                        Everything You Need to Run Your Jewelry Business
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
                        {BUSINESS_FEATURES.map((section) => (
                            <div key={section.title} className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                                <ul className="space-y-3">
                                    {section.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <svg 
                                                className="h-5 w-5 text-yellow-400 mr-2 mt-1 flex-shrink-0" 
                                                fill="none" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth="2" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}