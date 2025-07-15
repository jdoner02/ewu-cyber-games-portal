import type { NextConfig } from "next";

/*
🛡️ CYBERSECURITY LEARNING OPPORTUNITY! 🛡️

Hey future cybersecurity experts! This file shows you how we protect websites
from common attacks. Every line here demonstrates real security practices!

Want to know why we need all these security headers? Check out the 
OWASP Top 10 vulnerabilities - this config helps prevent many of them!
*/

const nextConfig: NextConfig = {
  // 🎯 EDUCATIONAL NOTE: Static export for GitHub Pages deployment
  // This tells Next.js to generate static HTML files that can be hosted
  // on any web server without needing a backend. Perfect for open source!
  output: 'export',
  
  // 🔧 Disable image optimization for static export
  // GitHub Pages doesn't support Next.js image optimization API
  images: {
    unoptimized: true,
  },
  
  // 🛡️ SECURITY HEADERS - This is where the real cybersecurity magic happens!
  // These headers protect users from many common web attacks
  async headers() {
    return [
      {
        // Apply these security headers to all pages
        source: '/(.*)',
        headers: [
          // 🛡️ LESSON: Content Security Policy (CSP)
          // This is like a whitelist for your website - it tells the browser
          // what content is allowed to load and run. Prevents XSS attacks!
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'", // Only load content from our own domain
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts (needed for React)
              "style-src 'self' 'unsafe-inline'", // Allow inline styles (needed for CSS-in-JS)
              "img-src 'self' data: blob:", // Allow images from our domain and data URIs
              "font-src 'self'", // Only load fonts from our domain
              "connect-src 'self'", // Only make network requests to our domain
              "frame-ancestors 'none'", // Prevent clickjacking attacks
            ].join('; '),
          },
          
          // 🛡️ LESSON: X-Frame-Options
          // Prevents other websites from embedding our site in an iframe
          // This stops "clickjacking" attacks where attackers trick users
          // into clicking on hidden elements
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          
          // 🛡️ LESSON: X-Content-Type-Options
          // Prevents MIME-type sniffing attacks where browsers try to
          // "guess" what type of file something is instead of trusting the server
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          
          // 🛡️ LESSON: Referrer Policy
          // Controls how much information is sent to other sites when users
          // click links. Protects user privacy!
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          
          // 🛡️ LESSON: Permissions Policy
          // Controls which browser features our site can use
          // Following the "principle of least privilege" - only allow what we need!
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()', // We don't need camera access
              'microphone=()', // We don't need microphone access
              'geolocation=()', // We don't need location access
              'payment=()' // We don't process payments
            ].join(', '),
          },
          
          // 🛡️ LESSON: Cross-Origin Embedder Policy
          // Enables advanced security features and helps isolate our site
          // from potentially malicious cross-origin content
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none', // Relaxed for compatibility with educational content
          },
          
          // 🔒 EDUCATIONAL SECURITY HEADER
          // This is a custom header that identifies our educational purpose
          // Real cybersecurity professionals often add custom headers for monitoring
          {
            key: 'X-Educational-Purpose',
            value: 'EWU-Cyber-Games-Portal-Learning-Platform',
          },
        ],
      },
    ];
  },
  
  // 🔧 DEVELOPMENT CONFIGURATION
  // These settings help during development and learning
  eslint: {
    // During builds, we want to continue even with linting errors
    // so students can see their work in progress
    ignoreDuringBuilds: false,
  },
  
  typescript: {
    // We want to catch TypeScript errors during build
    // This teaches good coding practices!
    ignoreBuildErrors: false,
  },
  
  // 🎯 EXPERIMENTAL FEATURES
  // Next.js has cool experimental features we can use for learning
  experimental: {
    // Enable TypeScript plugin for better IntelliSense
    typedRoutes: true,
  },
};

export default nextConfig;
