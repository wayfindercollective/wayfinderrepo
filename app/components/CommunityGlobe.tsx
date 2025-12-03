'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
});

interface CountryData {
  name: string;
  count: number;
  lat: number;
  lng: number;
}

const countries: CountryData[] = [
  { name: 'United States', count: 73, lat: 39.8283, lng: -98.5795 },
  { name: 'United Kingdom', count: 11, lat: 54.7024, lng: -3.2766 },
  { name: 'Australia', count: 6, lat: -25.2744, lng: 133.7751 },
  { name: 'Canada', count: 4, lat: 56.1304, lng: -106.3468 },
  { name: 'Mexico', count: 4, lat: 23.6345, lng: -102.5528 },
  { name: 'Germany', count: 3, lat: 51.1657, lng: 10.4515 },
  { name: 'France', count: 3, lat: 46.2276, lng: 2.2137 },
  { name: 'Sweden', count: 3, lat: 60.1282, lng: 18.6435 },
  { name: 'Switzerland', count: 3, lat: 46.8182, lng: 8.2275 },
  { name: 'Greece', count: 2, lat: 39.0742, lng: 21.8243 },
  { name: 'Netherlands', count: 2, lat: 52.1326, lng: 5.2913 },
  { name: 'Singapore', count: 2, lat: 1.3521, lng: 103.8198 },
  { name: 'Finland', count: 2, lat: 61.9241, lng: 25.7482 },
  { name: 'Romania', count: 2, lat: 45.9432, lng: 24.9668 },
  { name: 'Denmark', count: 1, lat: 56.2639, lng: 9.5018 },
  { name: 'Bulgaria', count: 1, lat: 42.7339, lng: 25.4858 },
  { name: 'Croatia', count: 1, lat: 45.1000, lng: 15.2000 },
  { name: 'New Zealand', count: 1, lat: -40.9006, lng: 174.8860 },
  { name: 'Italy', count: 1, lat: 41.8719, lng: 12.5674 },
  { name: 'Hungary', count: 1, lat: 47.1625, lng: 19.5033 },
  { name: 'Ukraine', count: 1, lat: 48.3794, lng: 31.1656 },
  { name: 'India', count: 1, lat: 20.5937, lng: 78.9629 },
];

export default function CommunityGlobe() {
  const globeRef = useRef<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [continentsData, setContinentsData] = useState<any[]>([]);
  const autoRotateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoRotatingRef = useRef(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    if (!controls) return;

    // Enable auto-rotation with slow speed
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5; // Slow rotation

    // Handle drag start
    const handleStart = () => {
      setIsDragging(true);
      isAutoRotatingRef.current = false;
      controls.autoRotate = false;
      
      // Clear any pending timeout
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
    };

    // Handle drag end - resume auto-rotation after delay
    const handleEnd = () => {
      setIsDragging(false);
      
      // Clear any pending timeout
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
      
      // Resume auto-rotation after 2 seconds
      autoRotateTimeoutRef.current = setTimeout(() => {
        isAutoRotatingRef.current = true;
        controls.autoRotate = true;
      }, 2000);
    };

    controls.addEventListener('start', handleStart);
    controls.addEventListener('end', handleEnd);

    return () => {
      controls.removeEventListener('start', handleStart);
      controls.removeEventListener('end', handleEnd);
      if (autoRotateTimeoutRef.current) {
        clearTimeout(autoRotateTimeoutRef.current);
      }
    };
  }, []);

  const handlePointHover = (point: any, prevPoint: any, event?: MouseEvent | any) => {
    if (point) {
      // Find the country that matches this point
      const country = countries.find(c => 
        Math.abs(c.lat - point.lat) < 5 && Math.abs(c.lng - point.lng) < 5
      ) || countries.find(c => point.name === c.name);
      
      if (country) {
        setHoveredCountry(country);
        if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
          setMousePos({ x: event.clientX, y: event.clientY });
        } else if (typeof window !== 'undefined') {
          // Fallback to current mouse position if event doesn't have coordinates
          const rect = document.body.getBoundingClientRect();
          setMousePos({ x: rect.width / 2, y: rect.height / 2 });
        }
      }
    } else {
      setHoveredCountry(null);
    }
  };

  // Handle hover on HTML elements (magenta dots)
  const handleHtmlElementHover = (event: MouseEvent, country: CountryData) => {
    setHoveredCountry(country);
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  // Load proper world map GeoJSON data
  useEffect(() => {
    if (!isMounted) return;
    
    // Fetch world map GeoJSON from a reliable source
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(data => {
        // Use all countries/continents from the GeoJSON - keep ALL data
        // Filtering will happen in render to show only front-facing ones
        setContinentsData(data.features || []);
        console.log('Loaded', data.features?.length || 0, 'countries/continents');
      })
      .catch(err => {
        console.error('Failed to load world map data:', err);
        setContinentsData([]);
      });
  }, [isMounted]);

  // Filter to only show front-facing hemisphere based on current camera view
  // This will be called dynamically as the globe rotates
  const filterFrontFacing = (lat: number, lng: number): boolean => {
    // Convert to 3D coordinates on unit sphere
    const latRad = lat * Math.PI / 180;
    const lngRad = lng * Math.PI / 180;
    const x = Math.cos(latRad) * Math.cos(lngRad);
    const y = Math.sin(latRad);
    const z = Math.cos(latRad) * Math.sin(lngRad);
    
    // For default camera view (lat:0, lng:0, altitude:2)
    // Camera looks along negative Z axis
    // Points with z < 0 are on front-facing hemisphere
    // Use threshold to show front hemisphere clearly
    return z < 0.3;
  };

  // Filter continents data to only show front-facing polygons
  // Check if ANY point in the polygon is on the front-facing side
  const continentsDataToUse = continentsData.length > 0 
    ? continentsData.filter((feature: any) => {
        if (!feature.geometry || !feature.geometry.coordinates) return false;
        
        const coords = feature.geometry.coordinates[0];
        if (!coords || coords.length === 0) return false;
        
        // Check if any coordinate in the polygon is on front-facing side
        // This ensures we show polygons that span the front hemisphere
        let hasFrontFacingPoint = false;
        for (let i = 0; i < Math.min(coords.length, 10); i++) { // Sample points for performance
          const coord = coords[i];
          if (coord && coord.length >= 2) {
            const lng = coord[0]; // lng is first in GeoJSON
            const lat = coord[1]; // lat is second
            if (filterFrontFacing(lat, lng)) {
              hasFrontFacingPoint = true;
              break;
            }
          }
        }
        
        // Also check center point
        if (!hasFrontFacingPoint) {
          let sumLat = 0, sumLng = 0, count = 0;
          coords.forEach((coord: number[]) => {
            if (coord && coord.length >= 2) {
              sumLng += coord[0];
              sumLat += coord[1];
              count++;
            }
          });
          if (count > 0) {
            const centerLat = sumLat / count;
            const centerLng = sumLng / count;
            hasFrontFacingPoint = filterFrontFacing(centerLat, centerLng);
          }
        }
        
        return hasFrontFacingPoint;
      })
    : [];

  if (!isMounted) {
    return (
      <div className="relative flex items-center justify-center w-full" style={{ minHeight: '500px' }}>
        <div className="w-[450px] h-[450px] border-2 border-cyan-500 rounded-full flex items-center justify-center">
          <div className="text-cyan-500">Loading globe...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-full" style={{ minHeight: '500px' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe@2.32.0/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="https://unpkg.com/three-globe@2.32.0/example/img/night-sky.png"
        onGlobeReady={() => {
          const globe = globeRef.current;
          if (globe) {
            globe.pointOfView({ lat: 0, lng: 0, altitude: 2 });
            
            // Access Three.js scene to adjust lighting and hide back faces
            try {
              const scene = globe.scene();
              if (scene) {
                // Find and enhance lights
                scene.traverse((child: any) => {
                  if (child.type === 'AmbientLight') {
                    child.intensity = 1.0;
                  }
                  if (child.type === 'DirectionalLight') {
                    child.intensity = 1.5;
                    child.position.set(5, 3, 5);
                  }
                  // Ensure globe mesh is visible and only show front faces
                  if (child.type === 'Mesh' && child.material) {
                    if (Array.isArray(child.material)) {
                      child.material.forEach((mat: any) => {
                        mat.side = 2; // FrontSide only - hide back faces
                        mat.color.set('#2a2a5e');
                        mat.emissive.set('#00ffff');
                        mat.emissiveIntensity = 0.4;
                      });
                    } else {
                      child.material.side = 2; // FrontSide only - hide back faces
                      child.material.color.set('#2a2a5e');
                      child.material.emissive.set('#00ffff');
                      child.material.emissiveIntensity = 0.4;
                    }
                  }
                });
              }
            } catch (e) {
              console.log('Could not adjust lighting:', e);
            }
          }
        }}
        polygonsData={continentsDataToUse}
        polygonStrokeColor={() => '#00ffff'}
        polygonFillColor={() => 'transparent'}
        polygonAltitude={0.001}
        polygonCapColor={() => 'transparent'}
        polygonSideColor={() => 'transparent'}
        polygonLabel={(d: any) => d.name}
        polygonStrokeWidth={1.5}
        polygonCapMaterial={() => ({
          side: 2, // FrontSide only - hide back faces
        })}
        htmlElementsData={countries.filter(country => {
          // Only show dots on front-facing hemisphere
          return filterFrontFacing(country.lat, country.lng);
        })}
        htmlElement={(d: any) => {
          const country = countries.find(c => c.name === d.name);
          if (!country) return null;
          
          const el = document.createElement('div');
          const size = Math.max(6, Math.min(16, country.count / 5));
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.borderRadius = '50%';
          el.style.backgroundColor = '#ff00ff';
          el.style.opacity = hoveredCountry?.name === country.name ? '1' : '0.8';
          el.style.boxShadow = hoveredCountry?.name === country.name ? '0 0 12px rgba(255, 0, 255, 0.9)' : '0 0 6px rgba(255, 0, 255, 0.6)';
          el.style.cursor = 'pointer';
          el.style.border = 'none';
          el.style.pointerEvents = 'auto';
          
          // Add hover event listeners for tooltip
          el.addEventListener('mouseenter', (e: Event) => {
            const mouseEvent = e as MouseEvent;
            setHoveredCountry(country);
            setMousePos({ x: mouseEvent.clientX, y: mouseEvent.clientY });
          });
          el.addEventListener('mouseleave', () => {
            setHoveredCountry(null);
          });
          el.addEventListener('mousemove', (e: Event) => {
            const mouseEvent = e as MouseEvent;
            if (hoveredCountry?.name === country.name) {
              setMousePos({ x: mouseEvent.clientX, y: mouseEvent.clientY });
            }
          });
          
          return el;
        }}
        htmlLat={(d: any) => {
          // Ensure we get the correct lat from country data
          const country = countries.find(c => c.name === d.name);
          return country ? country.lat : (d.lat || 0);
        }}
        htmlLng={(d: any) => {
          // Ensure we get the correct lng from country data
          const country = countries.find(c => c.name === d.name);
          return country ? country.lng : (d.lng || 0);
        }}
        htmlAltitude={0}
        htmlTransitionDuration={0}
        onPointHover={handlePointHover}
        globeMaterial={{
          color: '#1a1a3e',
          emissive: '#00ffff',
          emissiveIntensity: 0.4,
          metalness: 0.0,
          roughness: 1.0,
        }}
        showAtmosphere={true}
        atmosphereColor="#00ffff"
        atmosphereAltitude={0.15}
        showGlobe={true}
        width={450}
        height={450}
      />
      {hoveredCountry && (
        <div
          className="absolute pointer-events-none z-10 bg-black/90 border border-cyan-500 px-4 py-2 rounded"
          style={{
            left: `${mousePos.x + 15}px`,
            top: `${mousePos.y - 10}px`,
            transform: 'translateY(-100%)',
            fontFamily: 'var(--font-mono), monospace',
            color: '#00ffff',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
          }}
        >
          <div className="font-bold">{hoveredCountry.name}</div>
          <div className="text-sm opacity-80">{hoveredCountry.count} {hoveredCountry.count === 1 ? 'member' : 'members'}</div>
        </div>
      )}
      <style jsx global>{`
        canvas {
          outline: 2px solid #00ffff !important;
        }
      `}</style>
    </div>
  );
}
