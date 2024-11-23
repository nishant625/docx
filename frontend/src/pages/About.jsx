// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="bg-gradient-to-b from-blue-500 to-indigo-700 text-white min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h1 className="text-4xl font-bold mb-4 animate-fade-in">
          About MyApp
        </h1>
        <p className="text-lg leading-relaxed mb-6">
          MyApp is a cutting-edge application designed to simplify file uploads and 
          convert them into password-protected PDFs. With a sleek design and powerful features, 
          MyApp ensures a seamless user experience.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-blue-600 font-bold px-6 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-all">
            Learn More
          </button>
          <button className="bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg hover:bg-blue-800 transition-all">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
