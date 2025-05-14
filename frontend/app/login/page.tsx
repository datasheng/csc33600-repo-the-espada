"use client"
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';

export default function Login() {
    const [data, setData] = useState({ email: "", password: "" });
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const handleChange = (e: any) =>{
        const {name, value} = e.target
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const userData = {
            email: data.email,
            password: data.password,
        };

        try {
            const response = await axios.post("http://127.0.0.1:5000/api/login", userData, {
                withCredentials: true,
            });

            console.log('Login response:', response.data);
            
            if (!response.data?.user?.userID) {
                console.error('Invalid response format:', response.data);
                throw new Error('Invalid response from server');
            }

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userId", response.data.user.userID.toString());
            
            setError(null);
            setIsLoggedIn(true);

            // Get the return URL from query parameters
            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('returnUrl');
            
            // Redirect to return URL if it exists, otherwise go to home
            router.push(returnUrl || '/');

        } catch (err: any) {
            // Handle 401 Unauthorized specifically
            if (err.response?.status === 401) {
                setError("Wrong Email or Password. Try Again.");
            } else {
                setError("An error occurred. Please try again.");
            }
            setResponse(null);
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userId");
        }
    };

    return (
        <>
            <Header/>
            <main className="min-h-screen bg-[url('/hero-background.jpg')] bg-cover bg-fixed bg-center">
                <div className="min-h-screen w-full bg-white/[0.15] backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
                        <div className="w-full max-w-md bg-black/80 text-white rounded-xl border border-yellow-400/30 shadow-2xl">
                            <div className="p-8">
                                <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">Log In</h1>
                                
                                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={data.email} 
                                                onChange={handleChange} 
                                                className="w-full px-4 py-3 bg-gray-800/90 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                                            <input 
                                                type="password" 
                                                name="password" 
                                                value={data.password} 
                                                onChange={handleChange} 
                                                className="w-full px-4 py-3 bg-gray-800/90 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                                required 
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-sm text-center">{error}</div>
                                    )}

                                    <button 
                                        className="w-full py-3 px-4 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200 shadow-lg"
                                        type="submit"
                                    >
                                        Log In
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-gray-400">
                                    Don't have an account?{' '}
                                    <a href="/signup" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
                                        Sign up
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