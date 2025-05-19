import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <div className="text-2xl font-bold text-yellow-400">Credichain</div>
        <div className="space-x-6 text-sm">
          <a href="#" className="hover:text-yellow-400">Inicio</a>
          <a href="#" className="hover:text-yellow-400">Solicitar</a>
          <a href="#" className="hover:text-yellow-400">Prestar</a>
          <a href="#" className="hover:text-yellow-400">Historial</a>
          <a href="#" className="hover:text-yellow-400">Perfil</a>
        </div>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300">
          Conectar Wallet
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between px-8 py-16">
        {/* Left Panel */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold">
            <span className="text-yellow-400">Construye tu crédito</span><br />
            con préstamos descentralizados
          </h1>
          <p className="text-gray-300 max-w-md">
            Usa Credichain para solicitar o financiar préstamos y mejorar tu puntuación de crédito.
          </p>
          <div>
            <div className="text-lg font-semibold">Tu saldo estimado</div>
            <div className="text-3xl">0.00 USD</div>
            <div className="text-gray-400 text-sm">= 0.00 EUR</div>
          </div>
          <div className="flex space-x-4">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300">Solicitar</button>
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Prestar</button>
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Ver perfil</button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/3 mt-12 md:mt-0 space-y-6">
          <div className="bg-[#1E2329] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Tu Score de Crédito</div>
            <div className="text-3xl font-bold">751</div>
          </div>
          <div className="bg-[#1E2329] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Préstamos activos</div>
            <div className="text-xl">2</div>
            <div className="text-sm text-gray-400">7.500 USDT en total</div>
          </div>
          <div className="bg-[#1E2329] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Noticias o consejos</div>
            <div className="text-sm">Cómo asegurar tus activos en finanzas descentralizadas</div>
          </div>
          <div className="bg-[#1E2329] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Próximo análisis del score</div>
            <div className="text-xl">14 h 26 min</div>
          </div>
        </div>
      </div>
    </div>
  );
}