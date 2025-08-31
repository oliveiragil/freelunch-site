'use client';

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';

export default function VideoPlaceholder() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const handleClick = () => {
    setIsPlaying(!isPlaying);
    setShowIcon(true);
    
    // Hide the icon after a brief moment
    setTimeout(() => {
      setShowIcon(false);
    }, 800);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Video Container */}
      <div 
        className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden cursor-pointer group shadow-2xl border border-gray-700"
        onClick={handleClick}
      >
        {/* Thumbnail Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
        
        {/* Tech Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-32 h-32 border border-orange-500/30 rounded-full" />
          <div className="absolute bottom-12 right-12 w-24 h-24 border border-orange-500/20 rounded" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-orange-500/25 rotate-45" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          {/* Logo Area */}
          <div className="flex items-center mb-6">
            <div className="mr-4">
              <Image
                src="/logo_freelunch.svg"
                alt="Freelunch Logo"
                width={48}
                height={48}
                className="md:scale-125"
              />
            </div>
            <div className="text-right">
              <h3 className="text-3xl md:text-4xl font-bold text-orange-500">Freelunch</h3>
              <p className="text-sm md:text-base text-gray-300">AI Productivity Platform</p>
            </div>
          </div>

          {/* Main Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
            Build Unicorns with AI
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 text-center mb-8 max-w-2xl">
            From Startup to Scale: How 2-Person Teams Create Billion-Dollar Companies
          </p>

          {/* Play Button */}
          <div className="relative">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-400 transition-all duration-300 group-hover:scale-110">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
            
            {/* Duration Badge */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="bg-black/80 text-white px-3 py-1 rounded-full text-sm">
                03:42
              </span>
            </div>
          </div>
        </div>

        {/* YouTube-style elements */}
        <div className="absolute top-4 right-4">
          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
            YouTube
          </div>
        </div>

        {/* Animated Play/Pause Icon Overlay */}
        {showIcon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 rounded-full p-6 animate-ping">
              {isPlaying ? (
                <Pause className="w-12 h-12 text-white" fill="currentColor" />
              ) : (
                <Play className="w-12 h-12 text-white" fill="currentColor" />
              )}
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Video Info Below */}
      <div className="mt-6 text-center">
        <h4 className="text-2xl font-bold text-white mb-2">
          The Future of Startup Success
        </h4>
        <p className="text-gray-400 text-lg">
          Discover how AI-powered platforms are enabling small teams to build massive companies
        </p>
      </div>
    </div>
  );
}
