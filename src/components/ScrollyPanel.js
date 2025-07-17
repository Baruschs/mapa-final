// src/components/ScrollyPanel.js

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import "./ScrollyPanel.css";

const ScrollyPanel = ({ chapter, onChapterEnter, className }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      onChapterEnter(chapter.id);
    }
  }, [inView, chapter.id, onChapterEnter]);

  const panelClasses = `scrolly-panel ${className || ""}`;

  const renderTitle = () => {
    // Capítulo especial con stats
    if (chapter.stats) {
      return (
        <div className="custom-title">
          <div className="main-title">{chapter.title}</div>
          <ul className="custom-list">
            {chapter.stats.map((stat, index) => (
              <li key={index} className="custom-item">
                <span className="icon">&#8226;</span> {stat.value} {stat.label}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // Capítulo título principal
    if (chapter.id === "titulo") {
      return (
        <div className="custom-title">
          <div className="main-title">MESAS DE PAZ</div>
          <div className="subtitle-bold">CELAYA, GUANAJUATO</div>
          <div className="subtitle-normal">
            DIRECCIÓN GENERAL DE PARTICIPACIÓN Y CONSULTAS
          </div>
          <div className="subtitle-bold">SECRETARÍA DE GOBERNACIÓN</div>
        </div>
      );
    }

    // Otros capítulos normales
    return <h2>{chapter.title}</h2>;
  };

  return (
    <section ref={ref} className={panelClasses}>
      <div className="scrolly-panel-content">
        {renderTitle()}
        {!chapter.stats && (
          <div
            dangerouslySetInnerHTML={{
              __html: formatDescription(chapter.description),
            }}
          />
        )}
      </div>
    </section>
  );
};

function formatDescription(text) {
  let paragraphs = text.split(/\n\s*\n/);

  return paragraphs
    .map((paragraph) => {
      const isList = paragraph.trim().startsWith("- ");
      if (!isList) {
        return `<p>${paragraph.trim()}</p>`;
      }

      const items = paragraph
        .split("\n")
        .map((item) => item.trim().replace(/^- /, ""))
        .filter(Boolean);

      const listItems = items
        .map(
          (item) => `<li class=""><span class="icon">&#8226;</span>${item}</li>`
        )
        .join("");

      return `<ul class="styled-list">${listItems}</ul>`;
    })
    .join("");
}

export default ScrollyPanel;
