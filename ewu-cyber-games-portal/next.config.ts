import type { NextConfig } from "next";

/*
🛡️ CYBERSECURITY LEARNING OPPORTUNITY! 🛡️

Hey future cybersecurity experts! This file shows you how we protect websites
from common attacks. Every line here demonstrates real security practices!

Want to know why we need all these security headers? Check out the 
OWASP Top 10 vulnerabilities - this config helps prevent many of them!
*/

const nextConfig: NextConfig = {
  // 🎯 EDUCATIONAL NOTE: Development mode configuration
  // For development, we'll enable all features and checks
  // For production build, we can switch to static export
  
  // 🚀 GitHub Pages deployment configuration
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/ewu-cyber-games-portal' : '',
  
  // 🔧 Image optimization settings
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
  },
  
  // 🔧 DEVELOPMENT CONFIGURATION
  // These settings help during development and learning
  eslint: {
    // During development, show linting errors but don't block builds
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  typescript: {
    // Show TypeScript errors during development
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // 🎯 EXPERIMENTAL FEATURES
  // Next.js has cool experimental features we can use for learning
  experimental: {
    // Enable TypeScript plugin for better IntelliSense
    typedRoutes: true,
  },
};

export default nextConfig;
