"use client";

import { useEffect, useRef } from "react";

export default function VideoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error autoplay video:", error);
      });
    }
  }, []);

  return (
    <section className="w-full relative">
      <div className="relative w-full overflow-hidden" style={{ height: "60vh" }}>
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          autoPlay
          controls
        >
          <source src="/videos/robo_market.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Blue overlay with higher opacity */}
        <div 
          className="absolute top-0 left-0 right-0 bottom-0 bg-[#50a0ff] opacity-30 pointer-events-none"
        ></div>
       
      </div>
    </section>
  );
}
