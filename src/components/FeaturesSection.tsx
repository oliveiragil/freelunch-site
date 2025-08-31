'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Shield, Rocket, Globe, Database, Code } from 'lucide-react';

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
    id: 'scale',
    title: 'Scale Instantly',
    description: 'From startup to unicorn, our platform grows with your business needs.',
    icon: Rocket,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    description: 'Bank-level security with compliance frameworks built-in from day one.',
    icon: Shield,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'global',
    title: 'Global Infrastructure',
    description: 'Deploy anywhere in the world with our distributed cloud infrastructure.',
    icon: Globe,
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'performance',
    title: 'Lightning Fast',
    description: 'Optimized performance that delivers results faster than traditional solutions.',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-500'
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
    <section className="bg-black text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            What You&apos;ll Unlock with Freelunch
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to transform your startup into a unicorn, all in one unified platform.
          </p>
        </motion.div>

        {/* Features Carousel */}
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gray-800 shadow-lg border border-gray-600 flex items-center justify-center transition-all duration-300 ${
              canScrollLeft 
                ? 'hover:bg-gray-700 text-white hover:shadow-xl' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gray-800 shadow-lg border border-gray-600 flex items-center justify-center transition-all duration-300 ${
              canScrollRight 
                ? 'hover:bg-gray-700 text-white hover:shadow-xl' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={checkScrollButtons}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="flex-shrink-0 w-80 h-96 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Icon with Gradient Background */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} p-4 mb-6`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <div className={`mt-8 h-1 w-16 bg-gradient-to-r ${feature.gradient} rounded-full`}></div>
              </motion.div>
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
