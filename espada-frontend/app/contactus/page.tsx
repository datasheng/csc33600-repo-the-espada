export default function AboutUs(){
  return(
  <div className="h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
    <div className="bg-[url('/background.jpg.jpg')] h-screen w-[2000px] bg-cover flex items-center flex-col "
    >
    <h1 className="text-4xl font-extrabold mb-6 ">About US</h1>
    <p className="text-black-600 mb-6">Welcome to our website!!!</p>
    <button className="bg-indigo-600 text-white rounded-full px-6 py-3 hover:bg-indigo-700 hover:scale-105 transition duration-300 ">Contact US</button>
  </div>
  </div>
  );
}