"use client"
import Header from '../components/Header';
import Footer from '../components/Footer'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function ProfileDropdown({ onRoleSelect }: { onRoleSelect: (role: string) => void }) {
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
        <div className='rounded border border-solid border-gray-400 bg-black/70 text-gray-100 rounded-lg border border-solid border-gray-400 border-10'>
            <div className="flex flex-col items-center p-4">
                <h1 className="text-2xl mb-4">What kind of user are you?</h1>
                <div className="relative">
                    <button 
                        onClick={toggleDropdown} 
                        className='w-48 py-2 px-4 bg-gray-800 rounded-lg flex justify-between items-center'
                        type="button"
                    >
                        <span>{selectedOption ? selectedOption : 'Select Role'}</span>
                        <svg 
                            className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showDropdown && (
                        <ul className="absolute w-48 mt-1 bg-gray-800 rounded-lg shadow-lg z-10">
                            <li 
                                onClick={() => handleOptionClick('Consumer')}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            >
                                Consumer
                            </li>
                            <li 
                                onClick={() => handleOptionClick('Business')}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            >
                                Business
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function Signup() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (userRole === 'Business') {
            // Store form data in localStorage to retrieve after subscription
            localStorage.setItem('signupData', JSON.stringify(formData));
            router.push('/subscription');
        } else {
            try {
                const response = await fetch('http://localhost:5000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        username: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        password: formData.password,
                        account_type: 'consumer'
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store login state
                    localStorage.setItem('isLoggedIn', 'true');
                    // Redirect to home page
                    router.push('/');
                } else {
                    alert(data.error || 'Signup failed. Please try again.');
                }
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred during signup. Please try again.');
            }
        }
    };

    return (
        <>
            <Header />
            <main>
                <div className='text-lg'>
                    <div className="relative bg-[url('/hero-background.jpg')] 
                    bg-cover bg-center bg-no-repeat min-h-screen flex flex-col items-center justify-center mx-auto h-screen px-10 py-8 drop-shadow-sm">
                        <div className="absolute inset-0 bg-white/70 z-0"></div>
                        <div className="relative bg-black/70 text-white border-yellow-400 border-10 px-14 py-8 rounded-lg border border-solid border-10">
                            <h1 className="font-bold py-2 text-center text-2xl mb-2 text-yellow-400">Sign Up</h1>
                            <ProfileDropdown onRoleSelect={setUserRole} />
                            <form onSubmit={handleSubmit} className="mt-6">
                                <div className="mb-4">
                                    <label className="block mb-2">First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="border border-solid border-grey w-full text-black p-2 rounded" 
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="border border-solid border-grey w-full text-black p-2 rounded" 
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="border border-solid border-grey w-full text-black p-2 rounded" 
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Password</label>
                                    <input 
                                        type="password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="border border-solid border-grey w-full text-black p-2 rounded" 
                                        required
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button 
                                        className="text-white rounded-lg border border-solid border-yellow-400 flex items-center 
                                        justify-center hover:bg-yellow-400 hover:text-black transition-colors duration-300 h-10 base:h-12 px-4 base:px-5
                                        drop-shadow-sm"
                                        type="submit"
                                    >
                                        {userRole === 'Business' ? 'Continue to Subscription' : 'Sign Up'}
                                    </button>
                                </div>
                            </form>
                            <div className="text-center">
                                <p className="text-sm m-2">
                                    Already have an account? <a href="/login" className="font-medium text-yellow-400 hover:underline">Login</a>
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