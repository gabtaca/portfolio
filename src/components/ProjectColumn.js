import React from "react";

export default function ProjectColumn({
  project,
  scale,
  isHighlighted,
  onClick,
  index,
  centerIndex,
  zIndexValue, // z-index du bouton
  triangleZIndex, // z-index du triangle
}) {
  const isBookend = project.id.startsWith("blank");

  // Déterminer la direction du triangle (décoration)
  const triangleDirection =
    index < centerIndex ? "triangle-right" : "triangle-left";

  return (
    <div
      className="project-column"

      onClick={!isBookend ? onClick : undefined}
    >
      <div className="project-container" style={{ position: 'relative' }}>
        <img
          src={
            isHighlighted && !isBookend ? project.img : project.still || project.img
          }
          alt={project.imgAlt || "Project Image"}
          className="project-image"
          style={{

          }}
        />
        {!isHighlighted && (
          <div
            className={`triangle ${triangleDirection}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "50px",
              height: "350px",
              backgroundImage: `url("/images/triangle.svg")`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              zIndex: triangleZIndex, 
            }}
          />
        )}
      </div>
    </div>
  );
}