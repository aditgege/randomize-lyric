// Loading screen component
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  loadingProgress: number;
  loadingStatus: string;
}

export const LoadingScreen = React.memo<LoadingScreenProps>(({ loadingProgress, loadingStatus }) => (
  <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black">
    {/* Animated background - monochrome */}
    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/30 to-white/10" />
    
    {/* Background noise effect - monochrome */}
    <div 
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        animation: 'noise 0.1s infinite'
      }}
    />
    
    {/* Loading content */}
    <div className="relative z-10 max-w-md p-8 text-center">
      {/* Main loader */}
      <div className="mb-8">
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Outer ring - monochrome */}
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
          
          {/* Progress ring - monochrome */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="url(#monochrome-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - loadingProgress / 100)}`}
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="monochrome-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#A3A3A3" />
                <stop offset="100%" stopColor="#525252" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-white">
                {Math.round(loadingProgress)}%
              </div>
              <div className="text-xs text-gray-400">
                LOADING
              </div>
            </div>
          </div>
          
          {/* Pulsing effect - monochrome */}
          <div className="absolute inset-0 border-4 rounded-full border-white/20 animate-ping"></div>
        </div>
      </div>
      
      {/* Status and progress */}
      <div className="space-y-4">
        {/* Progress bar - monochrome */}
        <div className="w-full h-2 overflow-hidden bg-gray-800 rounded-full">
          <div 
            className="h-full transition-all duration-300 ease-out bg-gradient-to-r from-white via-gray-300 to-gray-600"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        
        {/* Status text */}
        <div className="font-mono text-sm text-gray-300">
          {loadingStatus}
        </div>
        
        {/* Loading dots animation - monochrome */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
    
    {/* Background particles - monochrome */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gray-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
    
    {/* Additional CSS for loading screen */}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
      }
      
      @keyframes noise {
        0% { transform: translate3d(0, 0, 0); }
        10% { transform: translate3d(-1px, -1px, 0); }
        20% { transform: translate3d(1px, -1px, 0); }
        30% { transform: translate3d(-1px, 1px, 0); }
        40% { transform: translate3d(1px, 1px, 0); }
        50% { transform: translate3d(-1px, -1px, 0); }
        60% { transform: translate3d(1px, -1px, 0); }
        70% { transform: translate3d(-1px, 1px, 0); }
        80% { transform: translate3d(1px, 1px, 0); }
        90% { transform: translate3d(-1px, -1px, 0); }
        100% { transform: translate3d(0, 0, 0); }
      }
    `}</style>
  </div>
));
