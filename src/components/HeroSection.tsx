"use client";

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section 
      className="relative overflow-hidden text-white bg-gray-900"
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Digital Wave Pattern overlay - positioned absolutely */}
      <div
        className="wave-overlay"
        aria-hidden="true"
      />
      
      <div className="relative z-20 container mx-auto px-4 lg:px-6 py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight">
            Meet <span className="text-[#4A8FE7]">Your</span> Companion
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mb-5 sm:mb-6">
            Intelligent robots that assist, entertain, and transform the way you live and work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/shop"
              className="bg-[#4A8FE7] hover:bg-[#3B8CD9] text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            >
              Explore Our Robots
              <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Add the wave animation styles */}
      <style jsx global>{`
        .wave-overlay {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%25' gradientTransform='rotate(240)'%3E%3Cstop offset='0' stop-color='%23ffffff' stop-opacity='0.1'/%3E%3Cstop offset='1' stop-color='%23ffffff' stop-opacity='0'/%3E%3C/linearGradient%3E%3Cpattern patternUnits='userSpaceOnUse' id='b' width='540' height='450' x='0' y='0' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='0.05'%3E%3Cpath fill='%23444' d='M90 150L0 300h180z'/%3E%3Cpath d='M90 150L180 0H0z'/%3E%3Cpath fill='%23AAA' d='M270 150L360 0H180z'/%3E%3Cpath fill='%23DDD' d='M450 150l-90 150h180z'/%3E%3Cpath fill='%23999' d='M450 150L540 0H360z'/%3E%3Cpath d='M630 150l-90 150h180z'/%3E%3Cpath fill='%23DDD' d='M630 150L720 0H540z'/%3E%3Cpath fill='%23444' d='M810 150l-90 150h180z'/%3E%3Cpath fill='%23FFF' d='M810 150L900 0H720z'/%3E%3Cpath fill='%23DDD' d='M990 150l-90 150h180z'/%3E%3Cpath fill='%23999' d='M990 150l90-150H900z'/%3E%3Cpath fill='%23999' d='M90 450L0 600h180z'/%3E%3Cpath d='M90 450l90-150H0z'/%3E%3Cpath fill='%23DDD' d='M270 450l-90 150h180z'/%3E%3Cpath fill='%23444' d='M270 450l90-150H180z'/%3E%3Cpath fill='%23FFF' d='M450 450l-90 150h180z'/%3E%3Cpath fill='%23999' d='M450 450l90-150H360z'/%3E%3Cpath fill='%23999' d='M630 450l-90 150h180z'/%3E%3Cpath fill='%23FFF' d='M630 450l90-150H540z'/%3E%3Cpath fill='%23DDD' d='M810 450l-90 150h180z'/%3E%3Cpath fill='%23AAA' d='M810 450l90-150H720z'/%3E%3Cpath fill='%23DDD' d='M990 450l-90 150h180z'/%3E%3Cpath fill='%23444' d='M990 450l90-150H900z'/%3E%3Cpath fill='%23222' d='M90 750L0 900h180z'/%3E%3Cpath d='M270 750l-90 150h180z'/%3E%3Cpath fill='%23DDD' d='M270 750l90-150H180z'/%3E%3Cpath d='M450 750l90-150H360zM630 750l-90 150h180z'/%3E%3Cpath fill='%23444' d='M630 750l90-150H540z'/%3E%3Cpath fill='%23AAA' d='M810 750l-90 150h180z'/%3E%3Cpath fill='%23666' d='M810 750l90-150H720z'/%3E%3Cpath fill='%23999' d='M990 750l-90 150h180zM180 0L90 150h180z'/%3E%3Cpath fill='%23444' d='M360 0l-90 150h180z'/%3E%3Cpath fill='%23FFF' d='M540 0l-90 150h180z'/%3E%3Cpath d='M900 0l-90 150h180z'/%3E%3Cpath fill='%23222' d='M0 300l-90 150H90z'/%3E%3Cpath fill='%23FFF' d='M0 300l90-150H-90zM180 300L90 450h180z'/%3E%3Cpath fill='%23666' d='M180 300l90-150H90z'/%3E%3Cpath fill='%23222' d='M360 300l-90 150h180z'/%3E%3Cpath fill='%23FFF' d='M360 300l90-150H270z'/%3E%3Cpath fill='%23444' d='M540 300l-90 150h180z'/%3E%3Cpath fill='%23222' d='M540 300l90-150H450z'/%3E%3Cpath fill='%23AAA' d='M720 300l-90 150h180z'/%3E%3Cpath fill='%23666' d='M720 300l90-150H630z'/%3E%3Cpath fill='%23FFF' d='M900 300l-90 150h180z'/%3E%3Cpath fill='%23999' d='M900 300l90-150H810z'/%3E%3Cpath d='M0 600l-90 150H90z'/%3E%3Cpath fill='%23666' d='M0 600l90-150H-90z'/%3E%3Cpath fill='%23AAA' d='M180 600l-90 150h180z'/%3E%3Cpath fill='%23444' d='M180 600l90-150H90z'/%3E%3Cpath fill='%23444' d='M360 600l-90 150h180z'/%3E%3Cpath fill='%23999' d='M360 600l90-150H270z'/%3E%3Cpath fill='%23666' d='M540 600l90-150H450z'/%3E%3Cpath fill='%23222' d='M720 600l-90 150h180z'/%3E%3Cpath fill='%23FFF' d='M900 600l-90 150h180z'/%3E%3Cpath fill='%23222' d='M900 600l90-150H810z'/%3E%3Cpath fill='%23DDD' d='M0 900l90-150H-90z'/%3E%3Cpath fill='%23444' d='M180 900l90-150H90z'/%3E%3Cpath fill='%23FFF' d='M360 900l90-150H270z'/%3E%3Cpath fill='%23AAA' d='M540 900l90-150H450z'/%3E%3Cpath fill='%23FFF' d='M720 900l90-150H630z'/%3E%3Cpath fill='%23222' d='M900 900l90-150H810zM1080 300l-90 150h180z'/%3E%3Cpath fill='%23FFF' d='M1080 300l90-150H990z'/%3E%3Cpath d='M1080 600l-90 150h180z'/%3E%3Cpath fill='%23666' d='M1080 600l90-150H990z'/%3E%3Cpath fill='%23DDD' d='M1080 900l90-150H990z'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect x='0' y='0' fill='url(%23b)' width='100%25' height='100%25'/%3E%3C/svg%3E");
          background-size: cover;
          background-position: center;
          opacity: 0.2;
          z-index: 1;
          animation: waveMove 30s linear infinite;
        }
        
        @keyframes waveMove {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </section>
  );
}