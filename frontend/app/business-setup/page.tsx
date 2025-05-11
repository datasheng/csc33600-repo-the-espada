"use client"
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BusinessInfo {
    storeName: string;
    description: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    hours: {
        [key: string]: {
            open: string;
            close: string;
            closed: boolean;
        };
    };
    categories: string[];
    socialMedia: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
    specialties: string[];
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

const JEWELRY_SPECIALTIES = [
    'Fine Jewelry',
    'Custom Design',
    'Diamond Jewelry',
    'Wedding Rings',
    'Vintage Jewelry',
    'Luxury Watches',
    'Repair Services',
    'Appraisal Services'
];

export default function BusinessSetup() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
        storeName: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        hours: DAYS_OF_WEEK.reduce((acc, day) => ({
            ...acc,
            [day]: { open: '09:00', close: '17:00', closed: false }
        }), {}),
        categories: [],
        socialMedia: {},
        specialties: []
    });

    useEffect(() => {
        // Check if user has completed payment
        const billingInfo = localStorage.getItem('billingInfo');
        if (!billingInfo) {
            router.push('/subscription');
        }
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBusinessInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSpecialtyChange = (specialty: string) => {
        setBusinessInfo(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
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

    const handleSocialMediaChange = (platform: string, value: string) => {
        setBusinessInfo(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [platform]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields based on current step
        if (currentStep === 1) {
            if (!businessInfo.storeName || !businessInfo.description || businessInfo.specialties.length === 0) {
                alert('Please complete all required fields in Step 1');
                return;
            }
        } else if (currentStep === 2) {
            if (!businessInfo.phone || !businessInfo.email || !businessInfo.address || 
                !businessInfo.city || !businessInfo.state || !businessInfo.zipCode) {
                alert('Please complete all required fields in Step 2');
                return;
            }
        } else if (currentStep === 3) {
            // Validate that at least one day has hours set
            const hasHours = Object.values(businessInfo.hours).some(day => !day.closed);
            if (!hasHours) {
                alert('Please set business hours for at least one day');
                return;
            }
        }

        // If not on the last step, move to next step
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
            return;
        }

        // On the last step, validate and submit
        if (currentStep === 4) {
            // Save business info to localStorage
            localStorage.setItem('businessInfo', JSON.stringify(businessInfo));
            
            // Clear the billing info since it's no longer needed
            localStorage.removeItem('billingInfo');
            
            // Add a small delay to ensure localStorage is updated
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Redirect to dashboard
            router.push('/dashboard');
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
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Description
                </label>
                <textarea
                    name="description"
                    value={businessInfo.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={4}
                    placeholder="Tell customers about your jewelry store, your expertise, and what makes you unique..."
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Specialties
                </label>
                <div className="grid grid-cols-2 gap-4">
                    {JEWELRY_SPECIALTIES.map(specialty => (
                        <div key={specialty} className="flex items-center">
                            <input
                                type="checkbox"
                                id={specialty}
                                checked={businessInfo.specialties.includes(specialty)}
                                onChange={() => handleSpecialtyChange(specialty)}
                                className="h-4 w-4 text-yellow-400 rounded border-gray-300"
                            />
                            <label htmlFor={specialty} className="ml-2 text-sm text-gray-700">
                                {specialty}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={businessInfo.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
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
                    Website
                </label>
                <input
                    type="url"
                    name="website"
                    value={businessInfo.website}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
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
            </div>
        </div>
    );

    const renderStep3 = () => (
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

    const renderStep4 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media Links
                </label>
                <div className="space-y-4">
                    <div>
                        <input
                            type="url"
                            placeholder="Facebook URL"
                            value={businessInfo.socialMedia.facebook || ''}
                            onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <input
                            type="url"
                            placeholder="Instagram URL"
                            value={businessInfo.socialMedia.instagram || ''}
                            onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <input
                            type="url"
                            placeholder="Twitter URL"
                            value={businessInfo.socialMedia.twitter || ''}
                            onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
            </div>
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
                                Step {currentStep} of 4
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                            {currentStep === 4 && renderStep4()}

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
                                {currentStep < 4 ? (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(prev => prev + 1)}
                                        className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
                                    >
                                        Next →
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
                                    >
                                        Complete Setup
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