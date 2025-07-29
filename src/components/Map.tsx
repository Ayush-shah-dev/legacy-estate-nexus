import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  address?: string;
}

const Map: React.FC<MapProps> = ({ 
  center = [72.8347, 19.1136], // Lokhandwala Complex coordinates
  zoom = 15,
  address = "Regal Estate Consultants"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    // Check if we have a token saved in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setShowTokenInput(false);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add marker for office location
    const marker = new mapboxgl.Marker({
      color: '#D4AF37', // Gold color matching the brand
      scale: 1.5
    })
    .setLngLat(center)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-3">
            <h3 class="font-bold text-lg mb-2">${address}</h3>
            <p class="text-sm text-gray-600">Shop No. 3, Bharat Altavistas<br/>
            next to ICICI Bank<br/>
            Lokhandwala Complex, Andheri West<br/>
            Mumbai, Maharashtra 400053</p>
            <div class="mt-3">
              <a href="https://maps.google.com/?q=Shop+No.+3,+Bharat+Altavistas,+next+to+ICICI+Bank,+Lokhandwala+Complex,+Andheri+West,+Mumbai,+Maharashtra+400053" 
                 target="_blank" 
                 class="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                Get Directions
              </a>
            </div>
          </div>
        `)
    )
    .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, center, zoom, address]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken.trim());
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-brand-classic-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                Enter Mapbox Token
              </h3>
              <p className="text-sm text-brand-grey">
                To display the interactive map, please enter your Mapbox public token.{" "}
                <a 
                  href="https://mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-classic-gold hover:underline"
                >
                  Get one here
                </a>
              </p>
            </div>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="font-mono text-sm"
              />
              <Button 
                type="submit" 
                className="w-full bg-brand-classic-gold text-primary hover:bg-brand-soft-gold"
                disabled={!mapboxToken.trim()}
              >
                Load Map
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-lg" />
    </div>
  );
};

export default Map;