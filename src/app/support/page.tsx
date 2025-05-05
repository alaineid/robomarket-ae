"use client";

import React from 'react';
import Link from 'next/link';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { commonButtonStyles } from '@/styles/commonStyles';

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Customer Support</h1>
              <Breadcrumbs className="justify-center" />
              <p className="text-xl text-gray-600 mt-6">
                How can we assist you today? Find answers to common questions or contact our support team.
              </p>
            </div>
          </div>
        </div>

        {/* Get in Touch Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our support team is ready to assist with any questions or concerns you may have.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-xl shadow-lg h-full">
                  <h3 className="font-bold text-xl mb-6 text-gray-800">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mr-4">
                        <FaEnvelope className="text-[#4DA9FF]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Email Us</h4>
                        <p className="text-[#4DA9FF]">support@robomarket.ae</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mr-4">
                        <FaPhone className="text-[#4DA9FF]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Call Us</h4>
                        <p className="text-[#4DA9FF]">+971 58 563 6277</p>
                        <p className="text-sm text-gray-500">Available 24/7</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-[#4DA9FF]/10 rounded-full flex items-center justify-center mr-4">
                        <FaMapMarkerAlt className="text-[#4DA9FF]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Visit Us</h4>
                        <p className="text-gray-600">Downtown Dubai,</p>
                        <p className="text-gray-600">United Arab Emirates</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-3">Operating Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9 AM - 10 PM</p>
                    <p className="text-gray-600">Saturday & Sunday: 10 AM - 8 PM</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="font-bold text-xl mb-6 text-gray-800">Send Us a Message</h3>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                        placeholder="What is your inquiry about?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Robot Model (Optional)</label>
                      <select
                        id="model"
                        name="model"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] bg-white"
                      >
                        <option value="">Select your robot model</option>
                        <option value="companion-x1">Companion X1</option>
                        <option value="homebot-pro">HomeBot Pro</option>
                        <option value="assistant-elite">Assistant Elite</option>
                        <option value="medic-care">Medic Care</option>
                        <option value="industrial-helper">Industrial Helper</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                        placeholder="Please describe your issue or question in detail"
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        className="w-4 h-4 rounded accent-[#4DA9FF]"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700 ml-2">
                        I agree to the <Link href="/terms" className="text-[#4DA9FF] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#4DA9FF] hover:underline">Privacy Policy</Link>
                      </label>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className={`flex items-center justify-center ${commonButtonStyles.primary}`}
                    >
                      <FaPaperPlane className="mr-2" />
                      Submit Request
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}