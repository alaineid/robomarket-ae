"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaRobot, 
  FaLightbulb, 
  FaHandshake, 
  FaGlobe, 
  FaCheck 
} from 'react-icons/fa';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CallToAction from '@/components/ui/CallToAction';
import PageHero from '@/components/layout/PageHero';
import { commonLayoutStyles } from '@/styles/commonStyles';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className={commonLayoutStyles.mainContent}>
        {/* Hero Section */}
        <PageHero
          title={<>About <span className="text-[#4DA9FF]">RoboMarket</span></>}
          description="Your trusted destination for next-generation robotics technology in the UAE and beyond."
          breadcrumbItems={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about', active: true }
          ]}
        />
        
        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-[2400px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-6">
                  Founded in 2023, RoboMarket emerged from a vision to make advanced robotic companions accessible to households and businesses across the UAE. What started as a specialized boutique has quickly evolved into the region&apos;s premier destination for cutting-edge humanoid robots.
                </p>
                <p className="text-gray-600 mb-6">
                  We partner with the world&apos;s leading robotics manufacturers to bring you a curated selection of the highest quality assistive robots. Our team of experts rigorously tests and evaluates each product to ensure it meets our strict standards for performance, safety, and user experience.
                </p>
                <p className="text-gray-600">
                  At RoboMarket, we believe that robotic technology should enhance human potential, not replace it. This philosophy guides everything we do, from the products we select to the customer service we provide.
                </p>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                <Image 
                  src="/images/robot1.png"
                  alt="RoboMarket Showroom" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-[2400px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Mission & Vision</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                We&apos;re on a mission to revolutionize how people interact with technology in their daily lives.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Mission */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="w-16 h-16 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FaRobot className="text-3xl text-[#4DA9FF]" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-center">Our Mission</h3>
                <p className="text-gray-600 text-center mb-6">
                  To make advanced robotic technology accessible, understandable, and beneficial for everyday life through exceptional customer experience and continuous innovation.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FaCheck className="text-[#4DA9FF] mt-1 mr-3 flex-shrink-0" />
                    <span>Provide only the highest quality robotic companions</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-[#4DA9FF] mt-1 mr-3 flex-shrink-0" />
                    <span>Educate and support our customers throughout their journey</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-[#4DA9FF] mt-1 mr-3 flex-shrink-0" />
                    <span>Create a seamless shopping experience from browse to unbox</span>
                  </li>
                </ul>
              </motion.div>
              
              {/* Vision */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="w-16 h-16 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FaLightbulb className="text-3xl text-[#4DA9FF]" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-center">Our Vision</h3>
                <p className="text-gray-600 text-center mb-6">
                  To lead the integration of robotic companions into daily life, creating a future where advanced technology enhances human connection and productivity.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FaCheck className="text-[#4DA9FF] mt-1 mr-3 flex-shrink-0" />
                    <span>Become the most trusted robotics marketplace in the region</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-[#4DA9FF] mt-1 mr-3 flex-shrink-0" />
                    <span>Drive innovation in human-robot interaction and integration</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-[#4DA9FF] mt-1 mr-3 flex-shrink-0" />
                    <span>Foster a community of forward-thinking robot enthusiasts</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-[2400px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Core Values</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                These principles guide our business decisions and customer interactions every day.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Value 1 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="w-14 h-14 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FaUsers className="text-2xl text-[#4DA9FF]" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-center">Customer First</h3>
                <p className="text-gray-600 text-center">
                  We prioritize customer satisfaction in every interaction, offering personalized guidance and support throughout the entire journey.
                </p>
              </motion.div>
              
              {/* Value 2 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="w-14 h-14 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FaHandshake className="text-2xl text-[#4DA9FF]" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-center">Integrity</h3>
                <p className="text-gray-600 text-center">
                  We build trust through transparent business practices, honest product information, and ethical partnerships with manufacturers.
                </p>
              </motion.div>
              
              {/* Value 3 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="w-14 h-14 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FaGlobe className="text-2xl text-[#4DA9FF]" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-center">Innovation</h3>
                <p className="text-gray-600 text-center">
                  We continuously seek out and promote cutting-edge robotic technologies that meaningfully improve how people live and work.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-[2400px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Team</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Meet the robotics enthusiasts and experts who make RoboMarket possible.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-64 relative">
                  <Image 
                    src="/images/robot2.png" 
                    alt="Ahmed Al-Marzooqi" 
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1">Ahmed Al-Marzooqi</h3>
                  <p className="text-[#4DA9FF] mb-4">Founder & CEO</p>
                  <p className="text-gray-600 text-sm">
                    Robotics engineer with 10+ years of experience in the industry, passionate about making advanced technology accessible.
                  </p>
                </div>
              </motion.div>
              
              {/* Team Member 2 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-64 relative">
                  <Image 
                    src="/images/robot3.png" 
                    alt="Sara Kumar" 
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1">Sara Kumar</h3>
                  <p className="text-[#4DA9FF] mb-4">Head of Product</p>
                  <p className="text-gray-600 text-sm">
                    Former AI researcher who specializes in evaluating and sourcing the most advanced robotic companions.
                  </p>
                </div>
              </motion.div>
              
              {/* Team Member 3 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-64 relative">
                  <Image 
                    src="/images/robot4.png" 
                    alt="Mohammed Al-Hashimi" 
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1">Mohammed Al-Hashimi</h3>
                  <p className="text-[#4DA9FF] mb-4">Customer Experience</p>
                  <p className="text-gray-600 text-sm">
                    Dedicated to ensuring every customer receives personalized guidance throughout their robotics journey.
                  </p>
                </div>
              </motion.div>
              
              {/* Team Member 4 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-64 relative">
                  <Image 
                    src="/images/robot5.png" 
                    alt="Layla Chen" 
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1">Layla Chen</h3>
                  <p className="text-[#4DA9FF] mb-4">Technical Support Lead</p>
                  <p className="text-gray-600 text-sm">
                    Robotics technician with expertise in programming, maintenance, and optimization of all robot models.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
}