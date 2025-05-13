"use client"
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubscriptionTier {
    name: string;
    price: number;
    features: string[];
    recommended?: boolean;
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
        name: "Basic",
        price: 29.99,
        features: [
            "Basic business profile",
            "Up to 10 product listings",
            "Basic analytics",
            "Email support"
        ]
    },
    {
        name: "Professional",
        price: 79.99,
        features: [
            "Enhanced business profile",
            "Up to 50 product listings",
            "Advanced analytics",
            "Priority support",
            "Custom branding",
            "Featured listings"
        ],
        recommended: true
    },
    {
        name: "Enterprise",
        price: 199.99,
        features: [
            "Premium business profile",
            "Unlimited product listings",
            "Full analytics suite",
            "24/7 dedicated support",
            "Custom domain",
            "API access",
            "White-label options"
        ]
    }
];

export default function Subscription() {
    const router = useRouter();
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [showBillingForm, setShowBillingForm] = useState(false);
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

    const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBillingInfo({
            ...billingInfo,
            [e.target.name]: e.target.value
        });
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically integrate with a payment processor
        // For now, we'll just simulate a successful payment
        const signupData = JSON.parse(localStorage.getItem('signupData') || '{}');
        localStorage.setItem('billingInfo', JSON.stringify(billingInfo));
        localStorage.setItem('selectedPlan', selectedTier || '');
        
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: `${signupData.firstName} ${signupData.lastName}`,
                    email: signupData.email,
                    password: signupData.password,
                    account_type: 'business',
                    store_name: signupData.store_name || 'My Store',
                    store_address: signupData.store_address || '123 Business St'
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store login state
                localStorage.setItem('isLoggedIn', 'true');
                // Redirect to business profile setup
                router.push('/business-setup');
            } else {
                alert(data.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup. Please try again.');
        }
    };

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
                                        tier.recommended
                                            ? 'border-2 border-yellow-400 transform scale-105'
                                            : 'border border-gray-200'
                                    }`}
                                >
                                    {tier.recommended && (
                                        <div className="bg-yellow-400 text-black text-center py-2 font-semibold">
                                            Recommended
                                        </div>
                                    )}
                                    <div className="p-8 bg-white">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            {tier.name}
                                        </h2>
                                        <p className="text-4xl font-bold text-gray-900 mb-6">
                                            ${tier.price}
                                            <span className="text-lg font-normal text-gray-500">
                                                /month
                                            </span>
                                        </p>
                                        <ul className="space-y-4 mb-8">
                                            {tier.features.map((feature) => (
                                                <li key={feature} className="flex items-center">
                                                    <svg
                                                        className="h-5 w-5 text-green-500 mr-2"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
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
            </main>
            <Footer />
        </>
    );
} 