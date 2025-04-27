"use client"
import Form from 'next/form'
import Header from '../components/Header';
import Footer from '../components/Footer'

export default function Login() {
    return (
        <>
            <Header />
            <main>
                <div className='text-lg'>
                <div className='relative bg-[url("/hero-background.jpg")] bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center p-4'>
                <div className="absolute inset-0 bg-white/70 z-0"></div>

                        <div className=" relative bg-black/70 text-gray-100 px-8 py-6 rounded-lg border border-solid border-yellow-400 border-10">
                            <h1 className="font-bold py-2 text-center mb-2 text-2xl text-yellow-400">Login</h1>
                            <Form action="/login">
                                <div className="mb-4">
                                    <label className="block mb-2">Email</label>
                                    <input type="text" className="border border-solid border-gray-400 w-full"></input>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Password</label>
                                    <input type="password" className="border border-solid border-gray-400 w-full"></input>
                                </div>
                                <div className="flex justify-center">
                                    <button className="text-white rounded-lg border border-solid border-yellow-400  flex items-center 
                                    justify-center b hover:bg-yellow-400 hover:text-black transition-colors duration-300 h-10 base:h-12 px-4 base:px-5
                                    drop-shadow-sm"
                                    type="submit">Log In</button>
                                </div>
                            </Form>
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