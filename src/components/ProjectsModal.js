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

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [animationClass, setAnimationClass] = useState("modal-initial-open");
  const [borderSide, setBorderSide] = useState("");
  const modalRef = useRef(null);
  const swipeThreshold = 40;
  const dragLimits = { x: 200, y: 200 };

  const validProjects = projectsData.filter((project) => !isNaN(project.id));
  const validIndex = validProjects.findIndex((p) => p.id === project.id);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const startDrag = (e) => {
    setIsDragging(true);
    const startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    modalRef.current.startX = startX;
    modalRef.current.startY = startY;
    setAnimationClass("");
  };

  const onDrag = (e) => {
    if (!isDragging) return;

    const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const currentY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    const deltaX = currentX - modalRef.current.startX;
    const deltaY = currentY - modalRef.current.startY;

    setPosition({
      x: Math.max(-dragLimits.x, Math.min(deltaX, dragLimits.x)),
      y: Math.max(-dragLimits.y, Math.min(deltaY, dragLimits.y)),
    });
  };

  const endDrag = () => {
    setIsDragging(false);

    const { x, y } = position;

    if (Math.abs(x) > Math.abs(y)) {
      if (Math.abs(x) > swipeThreshold) {
        if (x > 0) {
          // Swipe Right
          if (validIndex > 0) {
            setAnimationClass("modal-swipe-out-right");
            setTimeout(() => {
              onPrevious();
              setAnimationClass("modal-swipe-in-left");
            }, 10);
          } else {
            handleShake("left");
          }
        } else {
          // Swipe Left
          if (validIndex < validProjects.length - 1) {
            setAnimationClass("modal-swipe-out-left");
            setTimeout(() => {
              onNext();
              setAnimationClass("modal-swipe-in-right");
            }, 10);
          } else {
            handleShake("right");
          }
        }
      }
    } else if (Math.abs(y) > swipeThreshold) {
      if (y > 0) {
        closeModalWithAnimation();
      }
    }

    setPosition({ x: 0, y: 0 });
  };

  const handleShake = (direction) => {
    setBorderSide(direction === "left" ? "left" : "right");
    setAnimationClass("modal-shake");
    setTimeout(() => {
      setBorderSide("");
      setAnimationClass("");
    }, 300);
  };

  const closeModalWithAnimation = () => {
    setAnimationClass("modal-close");
    setTimeout(onClose, 500);
  };

  const handleArrowClick = (direction) => {
    if (direction === "left") {
      if (validIndex > 0) {
        onPrevious();
      } else {
        handleShake("left");
      }
    } else if (direction === "right") {
      if (validIndex < validProjects.length - 1) {
        onNext();
      } else {
        handleShake("right");
      }
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
      onClick={closeModalWithAnimation}
    >
      <div
        ref={modalRef}
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
          transition: isDragging ? "none" : "transform 0.3s ease",
          borderLeft: borderSide === "left" ? `4px solid var(--errors)` : "",
          borderRight: borderSide === "right" ? `4px solid var(--errors)` : "",
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onMouseMove={onDrag}
        onTouchMove={onDrag}
        onMouseUp={endDrag}
        onTouchEnd={endDrag}
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
          display:"flex",
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
            onClick={() => handleArrowClick("left")}
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
            onClick={() => handleArrowClick("right")}
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
  )
}

