/**
 * NeighborFarmsList Component
 * Displays friend neighbor farms for social features
 */

'use client';

import React from 'react';
import { SOCIAL_FEATURES, UI_STRINGS } from '../constants';

interface NeighborFarmsListProps {
  className?: string;
}

export const NeighborFarmsList: React.FC<NeighborFarmsListProps> = ({ 
  className = "fixed left-4 top-1/4 bg-white rounded-lg p-4 shadow-lg z-30" 
}) => {
  return (
    <div className={className} data-testid="neighbor-farms-list">
      <h3 className="font-bold text-lg mb-3">
        👥 {UI_STRINGS.LABELS.NEIGHBOR_FARMS}
      </h3>
      {SOCIAL_FEATURES.NEIGHBOR_FARMS.map((neighbor) => (
        <div 
          key={neighbor.name}
          className="mb-2" 
          data-testid={`neighbor-farm-${neighbor.name.toLowerCase()}`}
        >
          <div className="flex items-center justify-between">
            <span>
              {neighbor.name} (Lv. {neighbor.level})
            </span>
            <button className="text-blue-600 text-sm hover:underline">
              Visit {neighbor.name}'s Farm
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
