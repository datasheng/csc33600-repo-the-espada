import Form from 'next/form'


export default function Signup() {
    return (
        <div className='text-lg'>
            <div className="flex flex-col items-center justify-center mx-auto h-screen px-10 py-8 drop-shadow-sm">
                <div className="px-14 py-8 rounded-lg border border-solid border-grey border-10">
                    <h1 className="font-bold py-2 text-center text-2xl mb-2">Sign Up</h1>
                    <Form action="/login">
                        <div className="mb-4">
                            <label className="block mb-2">First Name</label>
                            <input type="text" className="border border-solid border-grey w-full"></input>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Last Name</label>
                            <input type="text" className="border border-solid border-grey w-full"></input>
                        </div>
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
                            type="submit">Sign Up</button>
                        </div>
                    </Form>
                    <div className="text-center">
                    <p className="text-sm m-2">
                      Have an account yet already? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</a>
                    </p>
                    </div>
                </div>
            </div>
        </div>
    )
}