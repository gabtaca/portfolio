import React, { useState, useEffect } from "react";

export default function ProjectsModal({
  project,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}) {
  if (!project || project.type === "blank") return null;

  const [isInitialOpen, setIsInitialOpen] = useState(true);
  const [animationClass, setAnimationClass] = useState("");
  const [hasSwiped, setHasSwiped] = useState(false);

  useEffect(() => {
    if (isInitialOpen && !hasSwiped) {
      setAnimationClass("modal-initial-open");
    }
  }, [project, isInitialOpen, hasSwiped]);

  const handleClose = () => {
    if (hasSwiped) {
      setAnimationClass("modal-close");
    } else {
      setAnimationClass("modal-close");
    }
    setTimeout(() => {
      onClose();
      setIsInitialOpen(true);
      setHasSwiped(false);
    }, 500);
  };

  const handleSwipe = (direction) => {
    setHasSwiped(true);

    if (direction === "left") {
      setAnimationClass("modal-swipe-out-left");
      setTimeout(() => {
        onNext();
        setAnimationClass("modal-swipe-in-right");
        setIsInitialOpen(false);
      }, 500);
    } else if (direction === "right") {
      setAnimationClass("modal-swipe-out-right");
      setTimeout(() => {
        onPrevious();
        setAnimationClass("modal-swipe-in-left");
        setIsInitialOpen(false);
      }, 500);
    }
  };

  return (
    <div
      className="overlay"
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        className={`modal-content ${animationClass}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#D2DDE8",
          padding: "20px",
          borderRadius: "8px",
          width: "70%",
          maxWidth: "400px",
          textAlign: "center",
          position: "relative",
          color: "#677684",
          zIndex: 1001,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          const startX = e.touches[0].clientX;
          e.target.startX = startX;
        }}
        onTouchEnd={(e) => {
          const endX = e.changedTouches[0].clientX;
          const swipeThreshold = 100;

          if (e.target.startX - endX > swipeThreshold) {
            handleSwipe("left");
          } else if (endX - e.target.startX > swipeThreshold) {
            handleSwipe("right");
          }
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            color: "#677684",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            backgroundImage: `url('/images/close.svg')`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            width: "24px",
            height: "24px",
          }}
          aria-label="Close button"
        />
        <h2 style={{ fontFamily: "Jockey One", fontWeight: "200" }}>{project.date}</h2>
        <img
          src={project.img}
          alt={project.imgAlt || "Project Image"}
          style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
        />
        <p style={{ fontFamily: "Inter, sans-serif", color: "#677684" }}>{project.description}</p>
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            gap: 6,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "10px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
          }}
        >
          {project.stack.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
        <a
          href={project.lien.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#3490dc",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Visiter
        </a>
        <img
          src="/images/swipe.svg"
          alt="Swipe icon"
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            width: "24px",
            height: "24px",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}
