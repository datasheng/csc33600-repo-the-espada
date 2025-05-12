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
            
            // Check if response has user data
            if (!response.data?.user?.userID) {
                console.error('Invalid response format:', response.data);
                throw new Error('Invalid response from server');
            }

            // Store both isLoggedIn and userId in localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userId", response.data.user.userID.toString());
            
            console.log('Stored user data:', {
                isLoggedIn: true,
                userId: response.data.user.userID
            });
            
            setError(null);
            setIsLoggedIn(true);
            router.push("/");
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || err.message || "An error occurred");
            setResponse(null);
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userId");
        }
    };

    return (
        <>
            <Header/>
            <main>
                <div className='text-lg'>
                <div className='relative bg-[url("/hero-background.jpg")] bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center p-4'>
                <div className="absolute inset-0 bg-white/70 z-0"></div>

                        <div className=" relative bg-black/70 text-white px-8 py-6 rounded-lg border border-solid border-yellow-400 border-10">
                            <h1 className="font-bold py-2 text-center mb-2 text-2xl text-yellow-400">Login</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-2">Email</label>
                                    <input type="email" name="email" value={data.email} onChange = {handleChange} className="border border-solid text-black border-grey w-full" required></input>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Password</label>
                                    <input type="password" name="password" value={data.password} onChange = {handleChange} className="border border-solid text-black border-grey w-full" required></input>
                                </div>
                                <div className="flex justify-center">
                                    <button className="text-white rounded-lg border border-solid border-yellow-400  flex items-center 
                                    justify-center b hover:bg-yellow-400 hover:text-black transition-colors duration-300 h-10 base:h-12 px-4 base:px-5
                                    drop-shadow-sm"
                                    type="submit">Log In</button>
                                </div>
                            </form>
                            {response && <div className="text-green-500 mt-4">{response}</div>}
                            {error && <div className="text-red-500 mt-4">{error}</div>}
                            <div className="text-center">
                            <p className="text-sm m-2">
                            Don’t have an account yet? <a href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
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