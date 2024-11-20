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
      style={{
        minWidth: "55px",
        height: "350px",
        zIndex: zIndexValue, // Utiliser le z-index du bouton
        borderRadius: "2.5px",
        position: "relative", // Ensure the triangle is positioned relative to this
        margin: "0 10px",
        transformOrigin: "bottom",
      }}
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
            height: "345px",
            width: "60px",
            border: "0.5px solid #C9D5E1",
            borderRadius: "2.5px",
            objectFit: "cover",
            position: "relative", // Ensures the triangle is positioned relative to the image
            zIndex: zIndexValue + 1, // Ensure the image is always on top
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
              zIndex: triangleZIndex, // Ensure the triangle is behind the image
            }}
          />
        )}
      </div>
    </div>
  );
}