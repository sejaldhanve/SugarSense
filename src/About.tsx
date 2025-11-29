import React from 'react';
import { Heart, Leaf, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <section id="about-us" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-[#06402b]">
          Why Choose DiaZone?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: <Heart className="h-12 w-12 text-[#29524A]" />,
              title: "Health-Focused",
              description: "All our products are specially crafted with the unique needs of diabetic individuals in mind. We use only natural, low-glycemic sweeteners and ingredients that are gentle on blood sugar levels, helping you maintain balance without sacrificing flavor."
            },
            {
              icon: <ShieldCheck className="h-12 w-12 text-[#29524A]" />,
              title: "Quality Assured",
              description: "Our products undergo rigorous testing to ensure both safety and consistency, particularly for individuals with diabetes. We carefully evaluate each batch to guarantee that the natural sweeteners and ingredients used are of the highest quality, free from additives or anything that might negatively affect blood sugar levels. "
            },
            {
              icon: <Leaf className="h-12 w-12 text-[#29524A]" />,
              title: "Natural Ingredients",
              description: "our products are made with carefully selected, natural alternatives that are ideal for people managing diabetes. We understand the importance of maintaining stable blood sugar levels, which is why we’ve designed our sweetener with natural, low-glycemic ingredients that won’t cause rapid spikes in blood sugar."
            }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;