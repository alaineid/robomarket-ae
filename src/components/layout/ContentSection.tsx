"use client";

import Image from "next/image";
import Container from "./Container";
import { useState } from "react";

interface ContentItem {
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
}

interface ContentSectionProps {
  title?: string;
  subtitle?: string;
  items?: ContentItem[];
  reversed?: boolean;
}

export default function ContentSection({
  title = "Features",
  subtitle = "Discover what makes our platform stand out",
  items = [
    {
      title: "Responsive Design",
      description:
        "Our layouts work perfectly on any device, from mobile to desktop.",
      imageUrl: "/placeholder-1.jpg",
      alt: "Responsive design illustration",
    },
    {
      title: "Modern Stack",
      description:
        "Built with Next.js and Tailwind CSS for optimal performance and developer experience.",
      imageUrl: "/placeholder-2.jpg",
      alt: "Modern tech stack illustration",
    },
    {
      title: "Dark Mode Support",
      description:
        "Easy on the eyes with perfect light and dark mode implementations.",
      imageUrl: "/placeholder-3.jpg",
      alt: "Dark mode illustration",
    },
  ],
}: ContentSectionProps) {
  // State to track loaded images for animation
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>(
    {},
  );

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  return (
    <section className="py-16 md:py-24  dark:bg-gray-950">
      <Container>
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-indigo-600 dark:bg-indigo-400 mx-auto mb-6 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className={`bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-5px] group animate-scaleIn`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-48 sm:h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {item.imageUrl ? (
                  <>
                    <div className="absolute inset-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        className={`object-cover transform transition-all duration-500 group-hover:scale-110 ${
                          loadedImages[index] ? "opacity-100" : "opacity-0"
                        }`}
                        quality={85}
                        priority={index < 2}
                        onLoad={() => handleImageLoad(index)}
                      />
                    </div>
                    {!loadedImages[index] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-4 h-full flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gray-500 dark:text-gray-400 mb-2">
                      {item.title[0]}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.alt}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {item.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-300"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
