import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Target, Shield, Bell, ArrowRight, Brain, Droplets, Leaf, Lock, Users, Star } from 'lucide-react';
import Navbar from './Navbar';
import FloatingElements from './FloatingElements';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = cardsRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleLearnMore = () => {
    document.getElementById('what-is-sugar-sense')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Droplets className="w-8 h-8 text-emerald-400" />,
      title: "Smart Sugar Tracking",
      description: "Monitor your blood glucose levels with intelligent tracking that learns your patterns and provides personalized insights."
    },
    {
      icon: <Brain className="w-8 h-8 text-emerald-400" />,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations based on your health data, meal choices, and lifestyle patterns."
    },
    {
      icon: <Leaf className="w-8 h-8 text-emerald-400" />,
      title: "Personalized Healthy Recipes",
      description: "Discover delicious, diabetes-friendly recipes tailored to your taste preferences and dietary needs."
    },
    {
      icon: <Lock className="w-8 h-8 text-emerald-400" />,
      title: "Secure Health Records",
      description: "Your health data is protected with enterprise-grade security and privacy controls you can trust."
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Type 2 Diabetes",
      content: "Sugar Sense helped me understand my glucose patterns better than any app I've tried. The AI insights are incredibly accurate!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dr. Rajesh Kumar",
      role: "Endocrinologist",
      content: "I recommend Sugar Sense to my patients. The data visualization and trend analysis help both patients and doctors make better decisions.",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Amit Patel",
      role: "Type 1 Diabetes",
      content: "Finally, an app that doesn't make me feel guilty about my condition. The healthy alternatives section is a game-changer!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white overflow-hidden relative transition-colors duration-300">
      <FloatingElements />
      <Navbar onNavigateToLogin={handleNavigateToLogin} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div 
          ref={heroRef}
          className={`max-w-4xl mx-auto text-center z-10 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/assets/logo/Untitled_design__1_-removebg-preview.png"
              alt="Sugar Sense Logo"
              className="w-32 h-32 mx-auto mb-6 transition-all duration-300 filter dark:drop-shadow-none drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
              }}
            />
            
            {/* Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-emerald-500 to-green-500 bg-clip-text text-transparent leading-tight">
              Skip the guilt, taste immense — healthy sweet with Sugar Sense!
            </h1>
          </div>
          
          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Sugar Sense brings you smart sugar monitoring and healthy alternatives, so you can enjoy sweetness without compromise.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleNavigateToLogin}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
            >
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={handleLearnMore}
              className="group inline-flex items-center gap-3 border-2 border-gray-300 dark:border-white/20 hover:border-emerald-500 dark:hover:border-emerald-400 text-gray-700 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </button>
          </div>

          {/* 3D Floating Medical Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full animate-float-slow">
              <div className="w-full h-full flex items-center justify-center text-2xl">❤️</div>
            </div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-lg animate-float-medium transform rotate-45">
              <div className="w-full h-full flex items-center justify-center text-xl transform -rotate-45">🛡️</div>
            </div>
            <div className="absolute bottom-1/3 left-1/3 w-14 h-14 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full animate-float-fast">
              <div className="w-full h-full flex items-center justify-center text-xl">🍃</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Sugar Sense Section */}
      <section id="what-is-sugar-sense" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            What is Sugar Sense?
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-300 mb-8 leading-relaxed">
            A personal health companion that makes diabetes management simpler, smarter, and guilt-free.
          </p>
          
          {/* 3D Icons */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center animate-float-slow">
              <Droplets className="w-8 h-8 text-red-500" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center animate-float-medium">
              <Heart className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center animate-float-fast">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center animate-float-slow">
              <Leaf className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need for better health
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300">
              Comprehensive tools designed specifically for diabetes management
            </p>
          </div>

          <div 
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card opacity-0 translate-y-8 transition-all duration-700 group cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl group-hover:scale-110"></div>
                  <div className="relative h-full bg-white dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/15 hover:border-emerald-400/30 hover:transform hover:scale-105 hover:shadow-xl">
                    <div className="flex flex-col items-center text-center h-full">
                      <div className="mb-4 p-4 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-slate-300 leading-relaxed flex-grow">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Touch Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Built for people, not just numbers.
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
              We understand that behind every glucose reading is a real person with real life. 
              That's why Sugar Sense focuses on making diabetes management feel human, not clinical.
            </p>
          </div>

          {/* 3D Character Illustrations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Patients</h3>
              <p className="text-gray-600 dark:text-slate-300">Living their best life with confidence</p>
            </div>
            
            <div className="text-center group">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-16 h-16 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Families</h3>
              <p className="text-gray-600 dark:text-slate-300">Supporting loved ones with care and understanding</p>
            </div>
            
            <div className="text-center group">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Doctors</h3>
              <p className="text-gray-600 dark:text-slate-300">Providing better care with comprehensive data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Because health isn't just data—it's your life.
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300">
              Real stories from real people who've transformed their diabetes management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl group"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-emerald-400/20"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outro Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-emerald-500 to-green-500 bg-clip-text text-transparent leading-tight">
            Skip the guilt, taste immense — healthy sweet with Sugar Sense!
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
            Join thousands of people who've already started their journey to better health and guilt-free sweetness.
          </p>
          
          <button
            onClick={handleNavigateToLogin}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white px-10 py-5 rounded-full text-xl font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Start Your Health Journey Today</span>
            <ArrowRight className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-2" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;