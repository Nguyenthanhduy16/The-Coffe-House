import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Loader, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface Cafe {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  rating?: number;
}

interface MapAreaProps {
  cafes?: Cafe[];
  onCafeClick?: (cafe: Cafe) => void;
  zoom?: number;
}

const MapArea: React.FC<MapAreaProps> = ({
  cafes = [],
  onCafeClick,
  zoom = 14,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Request geolocation
  const requestGeolocation = (showError = true) => {
    setLoading(true);
    setGeoError(null);

    console.log('[MapArea] Starting geolocation request...');
    
    if (navigator.geolocation) {
      const timeoutId = setTimeout(() => {
        console.log('[MapArea] Geolocation timeout - using fallback');
        setUserLocation({ lat: 21.0285, lng: 105.8542 });
        setLoading(false);
        if (showError) setGeoError('Không thể lấy vị trí (timeout)');
      }, 10000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          const { latitude, longitude } = position.coords;
          console.log('[MapArea] Geolocation success:', { latitude, longitude });
          setUserLocation({ lat: latitude, lng: longitude });
          setLoading(false);
          setGeoError(null);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.log('[MapArea] Geolocation error:', error.code, error.message);
          const fallbackLocation = { lat: 21.0285, lng: 105.8542 };
          setUserLocation(fallbackLocation);
          setLoading(false);
          
          if (showError) {
            if (error.code === 1) {
              setGeoError('Bạn đã từ chối quyền truy cập vị trí');
            } else if (error.code === 2) {
              setGeoError('Không thể xác định vị trí');
            } else {
              setGeoError('Lỗi: ' + error.message);
            }
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.log('[MapArea] Geolocation not supported - using fallback');
      setUserLocation({ lat: 21.0285, lng: 105.8542 });
      setLoading(false);
      if (showError) setGeoError('Trình duyệt không hỗ trợ geolocation');
    }
  };

  // Auto-request geolocation on component mount
  useEffect(() => {
    requestGeolocation(false); // Don't show errors on initial load
  }, []);

  // Initialize map when user location is available
  useEffect(() => {
    if (!userLocation || !mapContainer.current || map.current) {
      return;
    }

    // Create map
    map.current = L.map(mapContainer.current).setView(
      [userLocation.lat, userLocation.lng],
      zoom
    );

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add user location marker (blue circle)
    const userIcon = L.divIcon({
      html: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#4F46E5" stroke="#fff" stroke-width="2"/>
        </svg>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: 'leaflet-user-marker',
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
    }).addTo(map.current);

    userMarkerRef.current = userMarker;
    userMarker.bindPopup('Vị trí của bạn');

    // Add cafe markers
    cafes.forEach((cafe) => {
      const marker = L.marker([cafe.lat, cafe.lng]).addTo(map.current!);

      // Add tooltip that shows on hover
      marker.bindTooltip(cafe.name, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'cafe-tooltip',
      });

      let popupContent = `<div class="font-bold">${cafe.name}</div>`;
      if (cafe.address) {
        popupContent += `<div class="text-sm text-gray-600">${cafe.address}</div>`;
      }
      if (cafe.rating) {
        popupContent += `<div class="text-sm text-yellow-600">⭐ ${cafe.rating}</div>`;
      }

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onCafeClick) {
          onCafeClick(cafe);
        }
      });
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation, cafes, onCafeClick, zoom]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Loader className="size-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Đang tải vị trí...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden">
      {/* Error message */}
      {geoError && (
        <div className="bg-amber-50 border border-amber-200 p-2 text-sm text-amber-700 flex items-center gap-2">
          <MapPin className="size-4 flex-shrink-0" />
          <span>{geoError}</span>
          <button
            onClick={() => requestGeolocation(true)}
            className="ml-auto px-2 py-1 bg-amber-200 hover:bg-amber-300 rounded text-sm font-medium"
          >
            Thử lại
          </button>
        </div>
      )}
      
      {/* Map container */}
      <div ref={mapContainer} className="flex-1 rounded-lg overflow-hidden" style={{ minHeight: '400px' }} />
    </div>
  );
};

export default MapArea;
