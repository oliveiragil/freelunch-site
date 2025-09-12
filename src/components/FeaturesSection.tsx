'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shield, Database, Code, Brain } from 'lucide-react';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const features: FeatureCard[] = [
  {
    id: 'devops',
    title: 'DevOps Simplified',
    description: 'Streamline your development and operations with intelligent automation and monitoring.',
    icon: Code,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'mlops',
    title: 'MLOps Excellence',
    description: 'Deploy and manage machine learning models with enterprise-grade reliability.',
    icon: Database,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'ai-assistance',
    title: 'AI Assistance',
    description: 'Achieve high-level code with AI Assistance, increasing your productivity and accuracy.',
    icon: Brain,
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    description: 'Bank-level security with compliance frameworks built-in from day one.',
    icon: Shield,
    gradient: 'from-green-500 to-emerald-500'
  }
];

export default function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="bg-green-100 text-gray-800 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1E6091' }}>
            What You&apos;ll Unlock with Freelunch
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#1E6091' }}>
            Everything you need to transform your startup into a unicorn, all in one unified platform.
          </p>
        </motion.div>

        {/* Features Carousel */}
        <div className="relative">
          {/* Left Scroll Button - Hidden on mobile */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-300 items-center justify-center transition-all duration-300 ${
              canScrollLeft 
                ? 'hover:bg-gray-50 text-gray-700 hover:shadow-xl' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Scroll Button - Hidden on mobile */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-300 items-center justify-center transition-all duration-300 ${
              canScrollRight 
                ? 'hover:bg-gray-50 text-gray-700 hover:shadow-xl' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 md:px-12 py-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={checkScrollButtons}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="flex-shrink-0 w-72 sm:w-80 h-80 sm:h-96 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 snap-start"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Icon with Gradient Background */}
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 sm:p-4 mb-4 sm:mb-6`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <div className={`mt-6 sm:mt-8 h-1 w-12 sm:w-16 bg-gradient-to-r ${feature.gradient} rounded-full`}></div>
              </motion.div>
            ))}
          </div>
          
          {/* Mobile scroll indicators */}
          <div className="flex md:hidden justify-center mt-6 space-x-2">
            {features.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-400 transition-colors duration-300"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
