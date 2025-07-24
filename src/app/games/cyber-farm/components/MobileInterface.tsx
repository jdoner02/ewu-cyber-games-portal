/**
 * MobileInterface Component
 * Mobile-optimized interface for CyberFarm
 */

'use client';

import React from 'react';
import { MOBILE_CONFIG, UI_STRINGS } from '../constants';

interface MobileInterfaceProps {
  isMobile: boolean;
  zoomLevel: number;
}

export const MobileInterface: React.FC<MobileInterfaceProps> = ({ isMobile, zoomLevel }) => {
  if (!isMobile) return null;

  return (
    <>
      {/* Mobile Farm Interface */}
      <div 
        data-testid={MOBILE_CONFIG.INTERFACE_ELEMENTS.FARM_INTERFACE} 
        className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40"
      >
        <div data-testid="swipe-navigation-area" className="text-center">
          <div data-testid="swipe-left-indicator">👈 Swipe to navigate</div>
          <div data-testid="swipe-right-indicator">👉 Explore farm</div>
        </div>
        <div data-testid="mobile-action-menu" className="flex justify-center gap-4 mt-2">
          <button 
            data-testid="mobile-plant-button" 
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {UI_STRINGS.BUTTONS.PLANT_CROP}
          </button>
          <button 
            data-testid="mobile-harvest-button" 
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            {UI_STRINGS.BUTTONS.HARVEST_CROP}
          </button>
        </div>
      </div>
      
      {/* Mobile Zoom Controls */}
      <div 
        data-testid={MOBILE_CONFIG.INTERFACE_ELEMENTS.ZOOM_CONTROLS} 
        className="fixed right-4 bottom-24 bg-white rounded-lg p-2 shadow-lg"
      >
        <button data-testid="zoom-in-button" className="block mb-2 p-2">🔍+</button>
        <button data-testid="zoom-out-button" className="block p-2">🔍-</button>
        <div data-testid="zoom-level-indicator" className="text-xs text-center mt-2">
          🔍 Zoom: {zoomLevel}%
        </div>
      </div>
    </>
  );
};
