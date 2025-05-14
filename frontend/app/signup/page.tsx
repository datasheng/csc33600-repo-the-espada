"use client"
import Header from '../components/Header';
import Footer from '../components/Footer'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function ProfileDropdown({ onRoleSelect, error }: { 
    onRoleSelect: (role: string) => void;
    error: string | null;
}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null as string | null);
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        setShowDropdown(false);
        onRoleSelect(option);
    };

    return (
        <div className='bg-black/80 text-gray-100 rounded-lg p-6 backdrop-blur-sm'>
            <div className="flex flex-col items-center">
                <h1 className="text-xl font-medium mb-4 text-yellow-400">What kind of user are you?</h1>
                <div className="relative w-full">
                    <button 
                        onClick={toggleDropdown} 
                        className={`w-full py-3 px-4 bg-gray-800/90 rounded-lg flex justify-between items-center hover:bg-gray-700/90 transition-colors
                            ${error && !selectedOption ? 'border-2 border-red-500' : 'border border-gray-700'}`}
                        type="button"
                    >
                        <span className={`${!selectedOption && error ? 'text-red-400' : 'text-gray-200'}`}>
                            {selectedOption ? selectedOption : 'Select Role'}
                        </span>
                        <svg 
                            className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showDropdown && (
                        <ul className="absolute w-full mt-2 bg-gray-800/95 rounded-lg shadow-xl z-10 border border-gray-700">
                            <li 
                                onClick={() => handleOptionClick('Shopper')}
                                className="px-4 py-3 hover:bg-gray-700/90 cursor-pointer transition-colors first:rounded-t-lg"
                            >
                                Shopper
                            </li>
                            <li 
                                onClick={() => handleOptionClick('Business')}
                                className="px-4 py-3 hover:bg-gray-700/90 cursor-pointer transition-colors last:rounded-b-lg"
                            >
                                Business
                            </li>
                        </ul>
                    )}
                    {error && !selectedOption && (
                        <p className="mt-2 text-sm text-red-400">Please select a user type</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Signup() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null); // Clear any previous errors
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if user role is selected
        if (!userRole) {
            setError('Please select a user type');
            return;
        }

        // Check for existing email first regardless of user type
        try {
            const checkEmailResponse = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    password: formData.password
                }),
                credentials: 'include'
            });

            const data = await checkEmailResponse.json();

            if (checkEmailResponse.status === 409) {
                setError('This email is already registered. Please use a different email or log in.');
                return;
            }

            // If email is unique, proceed with the appropriate flow
            if (userRole === 'Business') {
                localStorage.setItem('signupData', JSON.stringify(formData));
                localStorage.setItem('userRole', 'business');
                localStorage.removeItem('completedSubscription');
                router.push('/subscription');
            } else {
                // For regular signup, we already have the response
                if (!checkEmailResponse.ok) {
                    throw new Error(data.error || 'Signup failed');
                }

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', data.user.userID.toString());
                localStorage.setItem('userRole', 'shopper');
                
                router.push('/');
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            setError(error.message || 'An error occurred during signup');
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[url('/hero-background.jpg')] bg-cover bg-fixed bg-center">
                <div className="min-h-screen w-full bg-white/[0.15] backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
                        <div className="w-full max-w-md bg-black/80 text-white rounded-xl border border-yellow-400/30 shadow-2xl">
                            <div className="p-8">
                                <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">Sign Up</h1>
                                
                                <ProfileDropdown onRoleSelect={setUserRole} error={error} />

                                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">First Name</label>
                                            <input 
                                                type="text" 
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-800/90 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" 
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Last Name</label>
                                            <input 
                                                type="text" 
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-800/90 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" 
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-800/90 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" 
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                                            <input 
                                                type="password" 
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-800/90 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all" 
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button 
                                            className="w-full py-3 px-4 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200 shadow-lg"
                                            type="submit"
                                        >
                                            {userRole === 'Business' ? 'Continue to Subscription' : 'Sign Up'}
                                        </button>

                                        {error && (
                                            <div className="py-3 px-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                                                <p className="text-red-400 text-center text-sm">{error}</p>
                                            </div>
                                        )}
                                    </div>
                                </form>

                                <p className="mt-6 text-center text-gray-400">
                                    Already have an account?{' '}
                                    <a href="/login" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
                                        Login
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}