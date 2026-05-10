import React, { useState } from 'react';
import { MapPin, MapIcon as MapIconLucide, Navigation } from 'lucide-react';

interface Cafe {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  rating?: number;
}

interface MapVisualizationProps {
  cafes?: Cafe[];
  onCafeClick?: (cafe: Cafe) => void;
  center?: { lat: number; lng: number };
  title?: string;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({
  cafes = [],
  onCafeClick,
  center = { lat: 21.0285, lng: 105.8542 },
  title = 'Cafe Locations',
}) => {
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);

  // Calculate bounds
  const bounds = {
    minLat: Math.min(...cafes.map(c => c.lat), center.lat),
    maxLat: Math.max(...cafes.map(c => c.lat), center.lat),
    minLng: Math.min(...cafes.map(c => c.lng), center.lng),
    maxLng: Math.max(...cafes.map(c => c.lng), center.lng),
  };

  const latRange = bounds.maxLat - bounds.minLat || 0.01;
  const lngRange = bounds.maxLng - bounds.minLng || 0.01;

  // Calculate SVG viewBox
  const padding = 0.002;
  const viewBox = {
    x: bounds.minLng - padding,
    y: bounds.minLat - padding,
    width: lngRange + padding * 2,
    height: latRange + padding * 2,
  };

  const getXPercent = (lng: number) => {
    return ((lng - viewBox.x) / viewBox.width) * 100;
  };

  const getYPercent = (lat: number) => {
    return ((viewBox.y + viewBox.height - lat) / viewBox.height) * 100;
  };

  const selectedCafe = cafes.find(c => c.id === selectedCafeId);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center gap-2">
        <MapIconLucide className="size-5 text-blue-600" />
        <span className="font-semibold text-gray-800">{title}</span>
        <span className="text-sm text-gray-500 ml-auto">{cafes.length} locations</span>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        {cafes.length > 0 ? (
          <>
            {/* SVG Background Grid */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Cafe Markers */}
            <div className="absolute inset-0">
              {cafes.map((cafe) => (
                <div
                  key={cafe.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${getXPercent(cafe.lng)}%`,
                    top: `${getYPercent(cafe.lat)}%`,
                  }}
                  onClick={() => {
                    setSelectedCafeId(cafe.id);
                    if (onCafeClick) {
                      onCafeClick(cafe);
                    }
                  }}
                >
                  {/* Marker Pin */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                      selectedCafeId === cafe.id
                        ? 'bg-red-500 ring-2 ring-red-300 scale-125'
                        : 'bg-blue-500 group-hover:bg-blue-600 group-hover:scale-110'
                    }`}
                  >
                    <MapPin className="size-4 text-white" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white rounded-lg shadow-lg p-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none min-w-max">
                    <p className="text-sm font-semibold text-gray-800">{cafe.name}</p>
                    {cafe.rating && <p className="text-xs text-yellow-600">⭐ {cafe.rating}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Center Point Indicator */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${getXPercent(center.lng)}%`,
                top: `${getYPercent(center.lat)}%`,
              }}
            >
              <div className="w-4 h-4 border-2 border-green-500 rounded-full bg-green-100" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapIconLucide className="size-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No cafes to display</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Details Panel */}
      {selectedCafe && (
        <div className="bg-white border-t border-gray-200 p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-800">{selectedCafe.name}</h3>
              {selectedCafe.address && (
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="size-3" />
                  {selectedCafe.address}
                </p>
              )}
            </div>
            {selectedCafe.rating && (
              <div className="text-lg font-semibold text-yellow-600">⭐ {selectedCafe.rating}</div>
            )}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Navigation className="size-3" />
            Coordinates: {selectedCafe.lat.toFixed(4)}, {selectedCafe.lng.toFixed(4)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapVisualization;
