// src/components/ProjectColumn.js
import React, { useState } from "react";

export default function ProjectColumn({ project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`project-column ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={project.img} alt={project.imgAlt} className="project-image" />
      <div className="project-info">
      </div>
    </button>
  );
}