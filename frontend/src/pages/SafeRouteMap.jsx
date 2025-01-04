import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SafeRouteMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [destination, setDestination] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const destinationMarkerRef = useRef(null);
  const API_KEY = '5eac95d30bbf42a9aaa2f2da137d5ae4';

  

  const searchPlaces = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&format=geojson&apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResults(data.features || []);
    } catch (error) {
      console.error('Error searching places:', error);
      setError('Failed to search places. Please try again.');
    }
  };

  const getRoute = async (start, end) => {
    try {
      const startCoord = `${start[1]},${start[0]}`;
      const endCoord = `${end[1]},${end[0]}`;
      
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${startCoord}|${endCoord}&mode=walk&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch route');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting route:', error);
      setError('Failed to calculate route. Please try again.');
      return null;
    }
  };

  useEffect(() => {
    const loadMap = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        const coords = [position.coords.longitude, position.coords.latitude];
        setCurrentLocation(coords);

        const mapInstance = new window.maplibregl.Map({
          container: mapRef.current,
          style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${API_KEY}`,
          center: coords,
          zoom: 14,
          maxZoom: 18
        });

        mapInstance.addControl(new window.maplibregl.NavigationControl());
        
        mapInstance.on('load', () => {
          const element = document.createElement('div');
          element.className = 'current-location-marker';
          element.innerHTML = `
            <div style="
              background-color: #3b82f6;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `;

          new window.maplibregl.Marker(element)
            .setLngLat(coords)
            .addTo(mapInstance);

          const bounds = mapInstance.getBounds();
         

          setMap(mapInstance);
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to access location. Please enable location services and reload.');
      }
    };

    if (!window.maplibregl) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js';
      script.onload = loadMap;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    } else {
      loadMap();
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (destination) {
      const timeoutId = setTimeout(() => {
        searchPlaces(destination);
      }, 300);
      setSearchTimeout(timeoutId);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [destination]);

  

  useEffect(() => {
    if (!map || !selectedDestination || !currentLocation) return;

    const drawRoute = async () => {
      try {
        // Remove existing route layer and source
        if (map.getSource('route')) {
          map.removeLayer('route-layer');
          map.removeSource('route');
        }

        // Remove existing destination marker
        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.remove();
          destinationMarkerRef.current = null;
        }

        setLoading(true);
        const routeData = await getRoute(
          currentLocation,
          selectedDestination.geometry.coordinates
        );

        if (routeData && routeData.features && routeData.features.length > 0) {
          const routeFeature = routeData.features[0];
          
          if (!routeFeature.geometry || !routeFeature.geometry.coordinates) {
            throw new Error('Invalid route data received');
          }

          const bounds = new window.maplibregl.LngLatBounds();

          routeFeature.geometry.coordinates.forEach(coord => {
            bounds.extend(coord);
          });

          map.addSource('route', {
            type: 'geojson',
            data: routeFeature
          });

          map.addLayer({
            id: 'route-layer',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.8
            }
          });

          // Create and store the destination marker reference
          destinationMarkerRef.current = new window.maplibregl.Marker({ color: '#ef4444' })
            .setLngLat(selectedDestination.geometry.coordinates)
            .addTo(map);

          bounds.extend(currentLocation);
          bounds.extend(selectedDestination.geometry.coordinates);

          map.fitBounds(bounds, {
            padding: 50
          });
        }
      } catch (error) {
        console.error('Error drawing route:', error);
        setError(error.message || 'Failed to draw route. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    drawRoute();

    // Cleanup function to remove marker when component unmounts or destination changes
    return () => {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
      }
    };
  }, [map, selectedDestination, currentLocation]);

  return (
    <Card className="w-full h-screen border-none rounded-none">
      <CardHeader className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md w-80">
        <CardTitle className="mb-4">Safe Route Navigation</CardTitle>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter destination..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto z-20">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedDestination(result);
                      setDestination(result.properties.formatted);
                      setSearchResults([]);
                    }}
                  >
                    {result.properties.formatted}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          
        </div>
      </CardHeader>
      <CardContent className="p-0 w-full h-full">
        <div 
          ref={mapRef} 
          className="w-full h-full"
        />
      </CardContent>
    </Card>
  );
};

export default SafeRouteMap;