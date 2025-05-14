"use client"
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BusinessInfo {
    storeName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: string;
    longitude: string;
    hours: {
        [key: string]: {
            open: string;
            close: string;
            closed: boolean;
        };
    };
}

const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

const to24Hour = (time: string): string | null => {
    if (!time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};

const formatHoursForDB = (businessHours: BusinessInfo['hours']): Array<{
    daysOpen: string;
    openTime: string | null;
    closeTime: string | null;
}> => {
    return Object.entries(businessHours).map(([day, hours]) => ({
        daysOpen: day,
        openTime: hours.closed ? null : to24Hour(hours.open),
        closeTime: hours.closed ? null : to24Hour(hours.close)
    }));
};

const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);
    
    // Format as (XXX) XXX-XXXX
    if (limited.length >= 6) {
        return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else if (limited.length >= 3) {
        return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else if (limited.length > 0) {
        return `(${limited}`;
    }
    return '';
};

export default function BusinessSetup() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
        storeName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        latitude: '',
        longitude: '',
        hours: DAYS_OF_WEEK.reduce((acc, day) => ({
            ...acc,
            [day]: { open: '09:00', close: '17:00', closed: false }
        }), {})
    });

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        const ownerID = localStorage.getItem('ownerID');

        // If not a business user with ownerID, redirect to home
        if (userRole !== 'business' || !ownerID) {
            router.replace('/');
            return;
        }

        // Don't check for completedSubscription here since we already have ownerID
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBusinessInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setBusinessInfo(prev => ({
            ...prev,
            phone: formatted
        }));
    };

    const handleHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
        setBusinessInfo(prev => ({
            ...prev,
            hours: {
                ...prev.hours,
                [day]: {
                    ...prev.hours[day],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted, current step:', currentStep);

        if (currentStep === 1) {
            if (!businessInfo.storeName || !businessInfo.phone || !businessInfo.email || 
                !businessInfo.address || !businessInfo.city || !businessInfo.state || 
                !businessInfo.zipCode || !businessInfo.latitude || !businessInfo.longitude) {
                alert('Please complete all required fields');
                return;
            }
            setCurrentStep(prev => prev + 1);
        } 
        else if (currentStep === 2) {
            console.log('Submitting final form');
            const hasHours = Object.values(businessInfo.hours).some(day => !day.closed);
            if (!hasHours) {
                alert('Please set business hours for at least one day');
                return;
            }

            try {
                const ownerID = localStorage.getItem('ownerID');
                if (!ownerID) {
                    throw new Error('Owner ID not found');
                }

                const formattedHours = formatHoursForDB(businessInfo.hours);
                console.log('Formatted hours:', formattedHours);

                const response = await fetch('http://localhost:5000/api/stores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        ownerID: parseInt(ownerID),
                        store_name: businessInfo.storeName,
                        address: `${businessInfo.address}, ${businessInfo.city}, ${businessInfo.state} ${businessInfo.zipCode}`,
                        latitude: parseFloat(businessInfo.latitude),
                        longitude: parseFloat(businessInfo.longitude),
                        phone: businessInfo.phone,
                        email: businessInfo.email,
                        hours: formattedHours
                    })
                });

                const data = await response.json();
                console.log('Server response:', data);

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to create store');
                }

                // Save business info to localStorage
                localStorage.setItem('businessInfo', JSON.stringify({
                    ...businessInfo,
                    storeID: data.storeID
                }));
                
                // Clean up and set completion flags
                localStorage.removeItem('billingInfo');
                localStorage.setItem('completedSetup', 'true');

                // Redirect to dashboard using replace
                router.replace('/dashboard');

            } catch (error) {
                console.error('Error saving business info:', error);
                alert('An error occurred while saving your business information.');
            }
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jewelry Store Name
                </label>
                <input
                    type="text"
                    name="storeName"
                    value={businessInfo.storeName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={businessInfo.phone}
                        onChange={handlePhoneInput}  // Use the specific handler
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="(XXX) XXX-XXXX"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={businessInfo.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                </label>
                <input
                    type="text"
                    name="address"
                    value={businessInfo.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    required
                />
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <input
                            type="text"
                            name="city"
                            value={businessInfo.city}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="City"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="state"
                            value={businessInfo.state}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="State"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="zipCode"
                            value={businessInfo.zipCode}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="ZIP Code"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Latitude
                        </label>
                        <input
                            type="text"
                            name="latitude"
                            value={businessInfo.latitude}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g. 40.7128"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Longitude
                        </label>
                        <input
                            type="text"
                            name="longitude"
                            value={businessInfo.longitude}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g. -74.0060"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
            {DAYS_OF_WEEK.map(day => (
                <div key={day} className="flex items-center space-x-4">
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700">
                            {day}
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={businessInfo.hours[day].closed}
                            onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                            className="h-4 w-4 text-yellow-400"
                        />
                        <span className="text-sm text-gray-500">Closed</span>
                    </div>
                    {!businessInfo.hours[day].closed && (
                        <>
                            <input
                                type="time"
                                value={businessInfo.hours[day].open}
                                onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                className="p-2 border border-gray-300 rounded-md"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="time"
                                value={businessInfo.hours[day].close}
                                onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                className="p-2 border border-gray-300 rounded-md"
                            />
                        </>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Set Up Your Business Profile
                            </h1>
                            <p className="text-gray-600">
                                Step {currentStep} of 2
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}

                            <div className="flex justify-between mt-8">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        ← Previous
                                    </button>
                                )}
                                {currentStep === 2 ? (
                                    <button
                                        type="submit" // This is important
                                        className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
                                    >
                                        Complete Setup
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
                                    >
                                        Next →
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}