

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {Link} from "react-router-dom"

export default function Welcome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sections = [
    {
      title: "How It Works",
      items: [
        { icon: "🧾", title: "Create Profile", text: "Register and link your wallet to get started." },
        { icon: "💸", title: "Request or Offer Loan", text: "Engage in trust-based lending through smart contracts." },
        { icon: "📈", title: "Build Credit Score", text: "Improve your reputation by borrowing and repaying reliably." },
      ]
    },
    {
      title: "Why Credichain?",
      items: [
        { title: "Decentralized & Transparent", text: "No central authority. Everything is on-chain." },
        { title: "Secure & Private", text: "Built with audited smart contracts and user privacy in mind." },
        { title: "Open to All", text: "Anyone with a wallet can participate." },
      ]
    }
  ];

  const handlePrev = () => setCurrentSlide((prev) => (prev === 0 ? sections.length - 1 : prev - 1));
  const handleNext = () => setCurrentSlide((prev) => (prev === sections.length - 1 ? 0 : prev + 1));

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-10 px-4 bg-gradient-to-br from-green-400/10 to-white/5 sticky top-0 z-10 backdrop-blur-md ">
        <img src="/credichain_logo_white_and_green.png" alt="Logo" className="mx-auto mt-10 w-32" />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-400">Build Credit, Earn Trust</h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl text-gray-300">
          Peer-to-peer lending with on-chain reputation.
        </p>
        <Link to="/register">
        <button className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-2xl font-semibold shadow-md transition-all">
          Log in
        </button>
      </Link>
      </section>

      {/* Carousel Section */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-3xl font-bold mb-10">{sections[currentSlide].title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {sections[currentSlide].items.map((item, idx) => (
            <div key={idx}>
              {item.icon && <h3 className="text-xl font-semibold text-green-400 mb-2">{item.icon} {item.title}</h3>}
              {!item.icon && <h3 className="text-xl font-semibold text-green-400 mb-2">{item.title}</h3>}
              <p className="text-gray-400">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8 space-x-4">
          <button onClick={handlePrev} className="bg-white/10 hover:bg-white/20 p-2 rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={handleNext} className="bg-white/10 hover:bg-white/20 p-2 rounded-full">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center py-6 border-t border-gray-700">
        <p>© 2025 Credichain. Introduction to Blockchain Project.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-white">Docs</a>
          <a href="#" className="hover:text-white">GitHub</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </footer>
    </div>
  );
}