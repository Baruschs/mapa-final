// src/App.js

import React, { useState, useCallback } from "react";
import Map from "./components/Map";
import ScrollyPanel from "./components/ScrollyPanel";
import MapSwitcher from "./components/MapSwitcher";
import { chapters } from "./config/chapters";
import "./App.css";
import "./components/MapSwitcher.css";

const mapStyles = {
  Claro: "https://www.mapabase.atdt.gob.mx/style_3d.json",
  Oscuro: "https://www.mapabase.atdt.gob.mx/style_black_3d_places.json",
  Satelital: "https://www.mapabase.atdt.gob.mx/style_satellite.json",
};

function App() {
  const [activeChapterId, setActiveChapterId] = useState(
    Object.keys(chapters)[0]
  );

  const [styleUrl, setStyleUrl] = useState(mapStyles.Oscuro);
  const [isPulsing, setIsPulsing] = useState(false);

  const handleChapterEnter = useCallback((chapterId) => {
    setActiveChapterId(chapterId);
  }, []);

  const handleStyleChange = (newStyle) => {
    setStyleUrl(newStyle);
    setIsPulsing(true);
    setTimeout(() => {
      setIsPulsing(false);
    }, 400);
  };

  const activeChapter = chapters[activeChapterId];

  return (
    <div className="app-container">
      <div className="scrolly-column">
        {Object.values(chapters).map((chapter, index) => {
          // ---- LÓGICA DE CLASES DINÁMICAS ----
          // 1. Empezamos con las clases base.
          let classNames = [];
          // 2. Si es el primer capítulo, añadimos la clase de portada.
          if (index === 0) {
            classNames.push("is-title-card");
          }
          // 3. Si es el capítulo activo, añadimos la clase de actividad.
          if (chapter.id === activeChapterId) {
            classNames.push("is-active");
          }

          return (
            <ScrollyPanel
              key={chapter.id}
              chapter={chapter}
              onChapterEnter={handleChapterEnter}
              // 4. Unimos todas las clases en un solo string.
              className={classNames.join(" ")}
            />
          );
        })}
      </div>

      <div className={`map-column ${isPulsing ? "is-pulsing" : ""}`}>
        <MapSwitcher
          styles={mapStyles}
          activeStyle={styleUrl}
          onStyleChange={handleStyleChange}
        />
        <Map
          location={activeChapter.location}
          activeChapterId={activeChapterId}
          styleUrl={styleUrl}
        />
      </div>
    </div>
  );
}

export default App;
