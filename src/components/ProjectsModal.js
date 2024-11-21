import React, { useState, useEffect, useRef } from "react";

export default function ProjectsModalV2({
  project,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  projectsData,
}) {
  if (!project || project.type === "blank") return null;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [animationClass, setAnimationClass] = useState("modal-initial-open");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const modalRef = useRef(null);
  const swipeThreshold = 100;

  const validProjects = projectsData.filter((project) => !isNaN(project.id));
  const validIndex = validProjects.findIndex((p) => p.id === project.id);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const handleDragStart = (e) => {
    if (isTransitioning) return;

    const startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    modalRef.current = { startX, startY };
    setAnimationClass(""); // Reset animation during drag
  };

  const handleDragMove = (e) => {
    if (!modalRef.current || isTransitioning) return;

    const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const currentY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    const deltaX = currentX - modalRef.current.startX;
    const deltaY = currentY - modalRef.current.startY;

    setPosition({
      x: Math.max(-200, Math.min(deltaX, 200)),
      y: Math.max(-200, Math.min(deltaY, 200)),
    });
  };

  const handleDragEnd = () => {
    if (isTransitioning) return;

    const { x, y } = position;

    if (Math.abs(x) > Math.abs(y)) {
      // Horizontal swipe detection
      if (Math.abs(x) > swipeThreshold) {
        if (x > 0 && validIndex > 0) {
          triggerSwipeAnimation("modal-swipe-out-right", onPrevious, "modal-swipe-in-left");
        } else if (x < 0 && validIndex < validProjects.length - 1) {
          triggerSwipeAnimation("modal-swipe-out-left", onNext, "modal-swipe-in-right");
        } else {
          handleShake(x > 0 ? "left" : "right");
        }
      } else {
        setPosition({ x: 0, y: 0 }); // Reset position for invalid swipe
      }
    } else if (Math.abs(y) > swipeThreshold && y > 0) {
      // Vertical swipe down to close
      triggerSwipeAnimation("modal-close", onClose);
    } else {
      setPosition({ x: 0, y: 0 }); // Reset position for invalid swipe
    }
  };

  const triggerSwipeAnimation = (outClass, action, inClass = null) => {
    setIsTransitioning(true);
    setAnimationClass(outClass);
    setTimeout(() => {
      action();
      if (inClass) setAnimationClass(inClass);
      setPosition({ x: 0, y: 0 });
      setTimeout(() => setIsTransitioning(false), 500); // Match CSS animation duration
    }, 500);
  };

  const handleShake = (direction) => {
    setAnimationClass("modal-shake");
    setTimeout(() => setAnimationClass(""), 300); // Match shake animation duration
  };

  const closeModalWithAnimation = () => {
    triggerSwipeAnimation("modal-close", onClose);
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
      onClick={closeModalWithAnimation}
    >
      <div
        className={`modal-content ${animationClass}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bgModal)",
          borderRadius: "10px",
          textAlign: "center",
          position: "relative",
          zIndex: 1050,
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.3s ease",
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onMouseMove={handleDragMove}
        onTouchMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button and Date */}
        <div
          className="date_modal"
          style={{
            position: "absolute",
            top: "-32px",
            zIndex: -10,
            width: "80%",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "var(--btnBlankEnd)",
            color: "var(--datesColor)",
            textAlign: "center",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <button
            onClick={closeModalWithAnimation}
            style={{
              position: "absolute",
              top: "-30px",
              right: "-50px",
              background: "transparent",
              color: "var(--bgModal)",
              border: "none",
              cursor: "pointer",
              backgroundImage: `url("/images/close.svg")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "24px",
              height: "24px",
            }}
            aria-label="Bouton fermer le modal"
          />
          <p
            style={{
              fontFamily: "Jockey One",
              fontSize: "24px",
              fontWeight: "200",
              margin: "0",
            }}
          >
            {project.date}
          </p>
        </div>
        {/* Modal Content */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            maxWidth: "100%",
            maxHeight: "40%",
          }}
        >
          <img
            src={project.img}
            alt={project.imgAlt || "Project Image"}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: "10px 10px 0px 0px",
            }}
          />
        </div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            color: "var(--textColor)",
            borderRadius: "0px 0px 10px 10px",
          }}
        >
          {project.description}
        </p>
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
            color: "var(--h2Color)",
          }}
        >
          {project.stack.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Scroll Index */}
          <div
            className="modal_scrollIndex"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "80%",
              padding: "20px",
            }}
          >
            <img
              src="/images/arrow_left_modal.svg"
              alt="Arrow Left"
              style={{ cursor: "pointer" }}
              onClick={() => onPrevious()}
            />
            <div
              className="modal_scrollIndex-cells"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${validProjects.length}, 1fr)`,
                gap: "0",
                width: "100%",
              }}
            >
              {validProjects.map((_, index) => (
                <div
                  key={index}
                  className={`scrollIndex-cell ${
                    index === validIndex ? "active" : ""
                  }`}
                  style={{
                    justifySelf: "center",
                    transition: "all 0.3s ease",
                    width: index === validIndex ? "20px" : "6px",
                    height: index === validIndex ? "4px" : "1.5px",
                  }}
                ></div>
              ))}
            </div>
            <img
              src="/images/arrow_right_modal.svg"
              alt="Arrow Right"
              style={{ cursor: "pointer" }}
              onClick={() => onNext()}
            />
          </div>
          {/* Project Link */}
          <a
            href={project.lien?.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
            onClick={(e) => {
              e.preventDefault();
              closeModalWithAnimation();
              window.open(project.lien?.github, "_blank");
            }}
          >
            Voir le projet
          </a>
        </div>
      </div>
    </div>
  );
}
