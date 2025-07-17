// src/components/Map.js

import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { chapters } from "../config/chapters";
import "maplibre-gl/dist/maplibre-gl.css";
import "./Map.css";

const Map = ({ location, activeChapterId, styleUrl }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const prevChapterIdRef = useRef();
  const isInitialMount = useRef(true);

  const addChapterLayers = (map, chapterId) => {
    if (!map.isStyleLoaded()) return;
    const chapterData = chapters[chapterId];
    if (chapterData && chapterData.geojsonUrl) {
      const sourceId = `source-${chapterId}`;
      if (map.getSource(sourceId)) return;
      map.addSource(sourceId, {
        type: "geojson",
        data: chapterData.geojsonUrl,
      });
      map.addLayer({
        id: `${sourceId}-fill`,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": "#a57f2c",
          "fill-opacity-transition": { duration: 800 },
          "fill-opacity": 0.5,
        },
      });
      map.addLayer({
        id: `${sourceId}-line`,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 2,
          "line-opacity-transition": { duration: 500 },
          "line-opacity": 1,
        },
      });
    }
  };

  // Efecto 1: Inicialización del mapa.
  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: location.center,
      zoom: location.zoom,
      // --- LÍNEA CORREGIDA ---
      // Esta línea es crucial para que el scroll funcione en la página.
      interactive: false,
    });
    mapRef.current.on("load", () => {
      addChapterLayers(mapRef.current, activeChapterId);
    });
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Efecto 2: Mueve la cámara.
  useEffect(() => {
    mapRef.current?.flyTo({ ...location, duration: 2000, essential: true });
  }, [location]);

  // Efecto 3: Gestiona capas.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const prevChapterId = prevChapterIdRef.current;
    if (prevChapterId && prevChapterId !== activeChapterId) {
      const prevChapterData = chapters[prevChapterId];
      if (prevChapterData?.geojsonUrl) {
        const prevSourceId = `source-${prevChapterId}`;
        if (map.getLayer(`${prevSourceId}-fill`)) {
          map.setPaintProperty(`${prevSourceId}-fill`, "fill-opacity", 0);
          map.setPaintProperty(`${prevSourceId}-line`, "line-opacity", 0);
          setTimeout(() => {
            if (map.getLayer(`${prevSourceId}-fill`))
              map.removeLayer(`${prevSourceId}-fill`);
            if (map.getLayer(`${prevSourceId}-line`))
              map.removeLayer(`${prevSourceId}-line`);
            if (map.getSource(prevSourceId)) map.removeSource(prevSourceId);
          }, 500);
        }
      }
    }
    addChapterLayers(map, activeChapterId);
    prevChapterIdRef.current = activeChapterId;
  }, [activeChapterId]);

  // Efecto 4: Cambia el estilo del mapa.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(styleUrl);
    map.once("load", () => {
      addChapterLayers(map, activeChapterId);
    });
  }, [styleUrl]);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
