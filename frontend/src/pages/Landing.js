import React from "react";
import { Link } from "react-router-dom";
import chartImage from "../assets/trading.mp4";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#0b0f1a] text-white flex flex-col">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-12 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-500">TradeOn</h1>

        <div className="space-x-6">
          <Link to="/signin" className="hover:text-blue-400 transition">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 items-center px-12 py-24 flex-1">

        {/* LEFT SIDE */}
        <div>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            AI Powered <br />
            <span className="text-blue-500">Crypto Trading</span>
          </h1>

          <p className="text-gray-400 text-lg mb-8 max-w-lg">
            Trade smarter with intelligent signals, automated execution,
            and real-time analytics designed for serious traders.
          </p>

          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-blue-600 px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition font-semibold shadow-lg"
            >
              Start Trading
            </Link>

            <Link
              to="/signin"
              className="border border-gray-600 px-8 py-4 rounded-lg text-lg hover:border-blue-500 transition"
            >
              Login
            </Link>
          </div>

          {/* TRUST INDICATORS */}
          <div className="flex space-x-8 mt-10 text-gray-500 text-sm">
            <div>✔ Secure Binance Integration</div>
            <div>✔ AI Risk Management</div>
            <div>✔ 24/7 Automation</div>
          </div>
        </div>

        {/* RIGHT SIDE CHART */}
        <div className="relative mt-16 md:mt-0">
          <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 rounded-xl"></div>

          <img
            src={chartImage}
            alt=""
            className="relative rounded-xl shadow-2xl border border-gray-800"
          />
          <video
  autoPlay
  loop
  muted
  playsInline
  className="relative rounded-xl shadow-2xl border border-gray-800"
>
  <source src={require("../assets/trading.mp4")} type="video/mp4" />
</video>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="px-12 py-20 border-t border-gray-800 bg-[#0d1324]">
        <h2 className="text-3xl font-bold text-center mb-16  text-blue-500">
          Why Choose TradeOn?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-[#121826] p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition">
            <h3 className="text-xl font-bold mb-4 text-blue-500">AI Signal Engine</h3>
            <p className="text-gray-400">
              Advanced ML models analyze market data and generate high-probability
              trade signals.
            </p>
          </div>

          <div className="bg-[#121826] p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition">
            <h3 className="text-xl font-bold mb-4 text-blue-500">Smart Risk Control</h3>
            <p className="text-gray-400">
              Built-in capital protection and dynamic risk management
              for sustainable growth.
            </p>
          </div>

          <div className="bg-[#121826] p-8 rounded-xl border border-gray-800 hover:border-blue-500 transition">
            <h3 className="text-xl font-bold mb-4 text-blue-500">Automated Execution</h3>
            <p className="text-gray-400">
              Connect Binance and let AI execute trades 24/7 without manual
              intervention.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-12 text-blue-500 border-t border-gray-800">
        © 2026 TradeOn — AI Crypto Trading Platform
      </footer>

    </div>
  );
}