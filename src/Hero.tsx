import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#F5F5DC]">
            Healthy Living Made Sweet
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover our range of diabetic-friendly products that don't compromise on taste
          </p>
          <button className="bg-[#319795] text-white px-8 py-3 rounded-full flex items-center gap-2 mx-auto hover:bg-[#1f3d37] transition-colors duration-200">
            Explore Our Products
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;