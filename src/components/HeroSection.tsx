"use client";

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      {/* Overlay with a dark gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"
        aria-hidden="true"
      ></div>
      
      {/* Background hero image */}
      <div 
        className="absolute inset-0 bg-center bg-cover opacity-30"
        aria-hidden="true"
        style={{ 
          backgroundImage: `url('/images/hero.png')`,
          filter: 'blur(3px)'
        }}
      ></div>
      
      <div className="relative z-20 container mx-auto px-4 lg:px-6 py-24 md:py-36 lg:py-40">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            RoboMarket: <span className="text-[#4DA9FF]">Your Partner</span> in Advanced Assistance
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mb-10">
            Discover the next generation of humanoid robots designed to enhance your life and productivity. From home assistance to professional settings, our verified partners offer the most advanced robot companions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/shop"
              className="bg-[#4DA9FF] hover:bg-[#3B8CD9] text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            >
              Explore Our Robots
              <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}