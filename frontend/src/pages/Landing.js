import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-animated text-white min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-500">TradeOn</h1>

        <div className="space-x-6">
          <Link to="/signin" className="hover:text-blue-400">Sign In</Link>
          <Link
            to="/signup"
            className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-10 px-10 py-20 items-center flex-1">

        {/* Left Side */}
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            AI Powered <span className="text-blue-500">Crypto Trading</span>
          </h1>

          <p className="text-gray-400 mb-8 text-lg">
            Smart signals, real-time analytics, and automated insights to help
            you trade like professionals.
          </p>

          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300"
            >
              Start Trading
            </Link>

            <Link
              to="/signin"
              className="border border-gray-600 px-8 py-3 rounded-lg hover:border-blue-500 transition-all duration-300"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Side Dashboard Preview */}
        <div className="bg-[#121826] rounded-xl p-6 shadow-lg border border-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0f172a] p-6 rounded-lg">
              <p className="text-gray-400">BTC Price</p>
              <h2 className="text-2xl font-bold">$63,240</h2>
            </div>

            <div className="bg-[#0f172a] p-6 rounded-lg">
              <p className="text-gray-400">Market Trend</p>
              <h2 className="text-green-400 font-bold">Bullish</h2>
            </div>

            <div className="bg-[#0f172a] p-6 rounded-lg">
              <p className="text-gray-400">Signals</p>
              <h2 className="text-blue-400 font-bold">12 Active</h2>
            </div>

            <div className="bg-[#0f172a] p-6 rounded-lg">
              <p className="text-gray-400">Accuracy</p>
              <h2 className="text-purple-400 font-bold">87%</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 text-center py-10 text-gray-500">
        © 2026 TradeOn — AI Crypto Trading Platform
      </footer>

    </div>
  );
}
