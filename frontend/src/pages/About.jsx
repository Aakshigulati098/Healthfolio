
import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="bg-gray-100 py-12 px-10">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-12 px-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          About <span className="text-green-600">Us</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Your trusted partner in healthcare management. Discover how we make healthcare simple and accessible for you.
        </p>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 items-center gap-12 px-6 lg:px-0 px-6">
        <div className="relative">
          <img
            className="rounded-full shadow-lg border border-primary"
            src={assets.about_image}
            alt="About HealthFolio"
          />
          <div className="absolute inset-0 bg-green-50 bg-opacity-10 rounded-lg pointer-events-none"></div>
        </div>
        <div className="space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to <strong>HealthFolio</strong>, your reliable partner in managing healthcare with ease and efficiency. 
            We strive to make scheduling appointments and maintaining health records seamless and stress-free.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            With continuous innovation and a focus on user-centric design, we are dedicated to improving your experience 
            and supporting your healthcare journey every step of the way.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-600 mb-2">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              Our vision is to bridge the gap between patients and healthcare providers, creating a seamless healthcare
              experience for everyone. We aim to make healthcare accessible, efficient, and personalized.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mt-16 bg-green-50 py-12 px-5 ">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Why Choose <span className="text-green-600">Us</span>
          </h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 lg:px-0">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <span className="bg-green-600 text-white p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h11M9 21H6a2 2 0 01-2-2v-5a2 2 0 012-2h3m3-10h4a2 2 0 012 2v5a2 2 0 01-2 2h-4m0 0a2 2 0 012-2m0 0a2 2 0 012 2v5a2 2 0 01-2 2h-4"
                  />
                </svg>
              </span>
              <h3 className="text-lg font-bold text-gray-800 ml-4">Efficiency</h3>
            </div>
            <p className="text-gray-600">
              Streamlined appointment scheduling designed to fit your busy lifestyle.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <span className="bg-green-600 text-white p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <h3 className="text-lg font-bold text-gray-800 ml-4">Convenience</h3>
            </div>
            <p className="text-gray-600">
              Access a network of trusted healthcare providers in your area effortlessly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <span className="bg-green-600 text-white p-3 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M5.05 16.05A7.007 7.007 0 0112 5c3.87 0 7 3.13 7 7s-3.13 7-7 7a7.007 7.007 0 01-6.95-5.95z"
                  />
                </svg>
              </span>
              <h3 className="text-lg font-bold text-gray-800 ml-4">Personalization</h3>
            </div>
            <p className="text-gray-600">
              Tailored recommendations and reminders to help you stay on top of your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;