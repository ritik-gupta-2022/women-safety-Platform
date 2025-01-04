import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SafeLocationMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = '5eac95d30bbf42a9aaa2f2da137d5ae4';

  const createCustomMarker = (color, type) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `
      <div class="marker-icon" style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        ${type[0]}
      </div>
    `;
    return markerElement;
  };

  const markerConfigs = {
    'service.police': {
      color: '#1e3a8a',
      title: 'Police Station',
      symbol: 'P'
    },
    'healthcare': {
      color: '#dc2626',
      title: 'Healthcare Facility',
      symbol: 'H'
    },
    'accommodation': {
      color: '#047857',
      title: 'Accommodation',
      symbol: 'A'
    }
  };

  useEffect(() => {
    const loadMap = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        });

        const coords = [position.coords.longitude, position.coords.latitude];
        setCurrentLocation(coords);

        const mapInstance = new window.maplibregl.Map({
          container: mapRef.current,
          style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${API_KEY}`,
          center: coords,
          zoom: 13,
        });

        mapInstance.addControl(new window.maplibregl.NavigationControl());
        setMap(mapInstance);

        const currentLocationMarker = document.createElement('div');
        currentLocationMarker.innerHTML = `
          <div style="
            background-color: #3b82f6;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            cursor: pointer;
          "></div>
        `;
        new window.maplibregl.Marker({ element: currentLocationMarker })
          .setLngLat(coords)
          .addTo(mapInstance);

        const categories = ['service.police', 'healthcare', 'accommodation'];
        for (const category of categories) {
          const response = await fetch(
            `https://api.geoapify.com/v2/places?` +
            `categories=${category}` +
            `&filter=circle:${coords[0]},${coords[1]},15000` +
            `&bias=proximity:${coords[0]},${coords[1]}` +
            `&limit=10` +
            `&apiKey=${API_KEY}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch ${category} locations`);
          }

          const data = await response.json();
          const config = markerConfigs[category];

          data.features.forEach((place) => {
            const markerElement = createCustomMarker(config.color, config.title);
            new window.maplibregl.Marker({ element: markerElement })
              .setLngLat(place.geometry.coordinates)
              .setPopup(
                new window.maplibregl.Popup({ offset: 25 }).setHTML(`
                  <div style="padding: 10px; max-width: 200px;">
                    <h3 style="margin: 0 0 10px 0; color: ${config.color};">
                      ${place.properties.name || config.title}
                    </h3>
                    <p style="margin: 5px 0;">
                      ${place.properties.formatted || 'No address available'}
                    </p>
                  </div>
                `)
              )
              .addTo(mapInstance);
          });
        }

      } catch (err) {
        console.error(err);
        setError('Failed to load the map. Please enable location services and reload.');
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

  return (
    <Card className="w-full h-screen border-none rounded-none">
      <CardHeader className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md">
        <CardTitle>Safe Locations</CardTitle>
      </CardHeader>
      {error && (
        <Alert variant="destructive" className="absolute top-4 left-4 z-10 w-80">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <CardContent className="p-0 w-full h-full">
        <div ref={mapRef} className="w-full h-full" />
      </CardContent>
    </Card>
  );
};

export default SafeLocationMap;