"use client"
import { useEffect, useRef } from 'react';
import { Map as LeafletMap, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPreviewProps {
    latitude: number;
    longitude: number;
    height: number;
}

const MapPreview = ({ latitude, longitude, height }: MapPreviewProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<LeafletMap | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initMap = async () => {
            try {
                const L = (await import('leaflet')).default;

                if (!mapInstanceRef.current && mapRef.current) {
                    const map = L.map(mapRef.current, {
                        center: [latitude, longitude],
                        zoom: 15,
                        dragging: false,
                        scrollWheelZoom: false,
                        zoomControl: false,
                    });

                    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
                        attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>'
                    }).addTo(map);

                    // Add marker
                    const icon = L.icon({
                        iconUrl: "/map_images/gold-marker.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                    });

                    L.marker([latitude, longitude], { icon }).addTo(map);

                    mapInstanceRef.current = map;
                }
            } catch (error) {
                console.error('Error initializing map preview:', error);
            }
        };

        initMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [latitude, longitude]);

    return (
        <div 
            ref={mapRef} 
            style={{ height: `${height}px`, width: '100%' }}
            className="rounded-lg"
        />
    );
};

export default MapPreview;