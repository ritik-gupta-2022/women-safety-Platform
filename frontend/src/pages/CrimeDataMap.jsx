import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CrimeDataMap = () => {
  const mapRef = useRef(null);
  const [crimeData, setCrimeData] = useState([]);
  const [map, setMap] = useState(null);
  const API_KEY = '5eac95d30bbf42a9aaa2f2da137d5ae4';

  const getCrimeData = async () => {
    try {
      const res = await fetch('https://women-crime-data.onrender.com/api/data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Fetched crime data:', data);
      return data;
    } catch (err) {
      console.error('Error fetching crime data:', err);
      return [];
    }
  };

  const getMarkerColor = (crimeType) => {
    const colors = {
      'Assault': '#FF0000',
      'Theft': '#FFA500',
      'Robbery': '#800080',
      'default': '#FF0000'
    };
    return colors[crimeType] || colors.default;
  };

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${API_KEY}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const properties = data.features[0].properties;
        return {
          city: properties.city || properties.town || properties.village || 'Unknown City',
          district: properties.district || properties.suburb || '',
          state: properties.state || '',
          country: properties.country || ''
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  };

  const createCustomMarker = (crime) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `
      <div class="marker-icon" style="
        background-color: ${getMarkerColor(crime['Crime Type'])};
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
        !
      </div>
    `;
    return markerElement;
  };

  const createClusterMarker = (count) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'cluster-marker';
    markerElement.innerHTML = `
      <div style="
        background-color: #4A90E2;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
      ">
        ${count}
      </div>
    `;
    return markerElement;
  };

  const createPopupContent = (crime, location) => {
    return `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 10px 0; color: ${getMarkerColor(crime['Crime Type'])};">
          ${crime['Crime Type']}
        </h3>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${location.district ? `${location.district}, ` : ''}${location.city}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${crime['Reported Date']}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${crime['Time of Day']}</p>
      </div>
    `;
  };

  // First useEffect to load dependencies and initialize map
  useEffect(() => {
    const loadDependencies = () => {
      Promise.all([
        new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js';
          script.onload = resolve;
          document.head.appendChild(script);

          const link = document.createElement('link');
          link.href = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css';
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }),
        new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/supercluster@7.1.5/dist/supercluster.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        })
      ]).then(async () => {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const mapInstance = new window.maplibregl.Map({
            container: mapRef.current,
            style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${API_KEY}`,
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 13
          });

          mapInstance.addControl(new window.maplibregl.NavigationControl());
          setMap(mapInstance);

          // Fetch initial crime data
          const initialData = await getCrimeData();
          setCrimeData(initialData);
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      });
    };

    loadDependencies();

    return () => {
      const mapScript = document.querySelector('script[src*="maplibre-gl"]');
      const clusterScript = document.querySelector('script[src*="supercluster"]');
      const mapStyles = document.querySelector('link[href*="maplibre-gl"]');
      if (mapScript) mapScript.remove();
      if (clusterScript) clusterScript.remove();
      if (mapStyles) mapStyles.remove();
    };
  }, []);

  // Second useEffect to handle markers when map and data are ready
  useEffect(() => {
    if (!map || !crimeData || crimeData.length === 0) return;

    const markers = new Set();
    
    const supercluster = new window.Supercluster({
      radius: 40,
      maxZoom: 16
    });

    const points = crimeData.map((crime, index) => ({
      type: 'Feature',
      properties: { 
        id: index,
        crimeType: crime['Crime Type'],
        ...crime
      },
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(crime.Longitude), parseFloat(crime.Latitude)]
      }
    }));

    supercluster.load(points);

    const updateMarkers = () => {
      markers.forEach(marker => marker.remove());
      markers.clear();

      const bounds = map.getBounds();
      const zoom = Math.floor(map.getZoom());
      
      const clusters = supercluster.getClusters(
        [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
        zoom
      );

      clusters.forEach(async (cluster) => {
        if (cluster.properties.cluster) {
          const markerElement = createClusterMarker(cluster.properties.point_count);
          const marker = new window.maplibregl.Marker(markerElement)
            .setLngLat(cluster.geometry.coordinates)
            .addTo(map);

          markerElement.addEventListener('click', () => {
            const expansionZoom = supercluster.getClusterExpansionZoom(cluster.properties.cluster_id);
            map.flyTo({
              center: cluster.geometry.coordinates,
              zoom: expansionZoom
            });
          });

          markers.add(marker);
        } else {
          const crime = crimeData[cluster.properties.id];
          const markerElement = createCustomMarker(crime);
          
          const location = await fetchLocationName(
            parseFloat(crime.Latitude),
            parseFloat(crime.Longitude)
          );

          const popup = new window.maplibregl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: true
          }).setHTML(createPopupContent(crime, location || { city: 'Unknown Location' }));

          const marker = new window.maplibregl.Marker(markerElement)
            .setLngLat([crime.Longitude, crime.Latitude])
            .setPopup(popup)
            .addTo(map);

          markers.add(marker);
        }
      });
    };

    map.on('moveend', updateMarkers);
    updateMarkers();

    return () => {
      markers.forEach(marker => marker.remove());
      map.off('moveend', updateMarkers);
    };
  }, [map, crimeData]);

  
  return (
    <Card className="w-screen h-screen border-none rounded-none">
      <CardHeader className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md">
        <CardTitle>Crime Data Map</CardTitle>
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

export default CrimeDataMap;