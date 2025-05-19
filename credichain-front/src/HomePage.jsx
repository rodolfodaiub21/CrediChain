import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white font-sans">{/*Fondo */}
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 border-b border-gray-700">
        <div className="text-4xl font-bold text-green-400">Credichain</div>
        <div className="space-x-20 text-">
          <a href="#" className="hover:text-green-400">Home</a>
          <a href="#" className="hover:text-green-400">Loan History</a>
          <a href="#" className="hover:text-green-400">Profile</a>
          <a href="#" className="hover:text-green-400">View landlords</a>
        </div>
        <button className="bg-green-400 text-black px-4 py-2 rounded hover:bg-green-400">
          Connect Wallet
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between px-8 py-16">
        {/* Left Panel */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold">
            <span className="text-green-400">Build your credit</span><br />
            with decentralized P2P loans
          </h1>
          <p className="text-gray-300 max-w-md">
            Use Credichain to request or finance loans and  increase your credichain score.
          </p>
          <div>
            <div className="text-lg font-semibold">your actual balance</div>
            <div className="text-3xl">10,000.00 USD</div>
            <div className="text-gray-400 text-sm">= 9,700.00 EUR</div>
          </div>
          <div className="flex space-x-4">
            <button className="bg-green-400 text-black px-4 py-2 rounded hover:bg-yellow-300">request</button>
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">lend</button>
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Profile</button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/3 mt-12 md:mt-0 space-y-6">
          <div className="bg-[#1E2329] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Credichain Score</div>
            <div className="text-3xl font-bold">1</div>
          </div>
          <div className="bg-[#1E2329] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Active loans</div>
            <div className="text-xl">2</div>
            <div className="text-sm text-gray-400">7.500 USDT en total</div>
          </div>
          <div className="bg-[#1E2329] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Noticias o consejos</div>
            <div className="text-sm">Cómo asegurar tus activos en finanzas descentralizadas</div>
          </div>
        </div>
      </div>
    </div>
  );
}
