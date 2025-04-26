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
                    <div className="flex flex-col items-center justify-center mx-auto h-screen px-6 py-8 drop-shadow-sm">
                        <div className="px-8 py-6 rounded-lg border border-solid border-grey border-10">
                            <h1 className="font-bold py-2 text-center mb-2 text-2xl">Login</h1>
                            <Form action="/login">
                                <div className="mb-4">
                                    <label className="block mb-2">Email</label>
                                    <input type="text" className="border border-solid border-grey w-full"></input>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Password</label>
                                    <input type="password" className="border border-solid border-grey w-full"></input>
                                </div>
                                <div className="flex justify-center">
                                    <button className="text-white rounded-lg border border-solid border-blue transition-colors flex items-center 
                                    justify-center bg-blue-600/70 text-background gap-2 dark:hover:bg-[#3f4391] text-base:text-base h-10 base:h-12 px-4 base:px-5
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