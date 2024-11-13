import React, { useEffect, useRef, useState } from "react";
import ProjectColumn from "./ProjectColumn";
import ProjectDatesFooter from "./ProjectsDatesFooter";
import ProjectsModal from "./ProjectsModal";
import projectsData from "../jsonFiles/projects.json";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsSliderMenu() {
  const sliderRef = useRef(null);
  const [scales, setScales] = useState([]);
  const [centerIndex, setCenterIndex] = useState(null);
  const [buttonPositions, setButtonPositions] = useState({});
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);

  const augmentedProjectsData = [
    { id: "blank-start", type: "blank", name: "", date: "Début", img: "/images/projects/column_end_btn.png", description: "" },
    { id: "blank-start2", type: "blank", name: "", date: ".", img: "/images/projects/column_pre-end_btn.png", description: "" },
    ...projectsData,
    { id: "blank-end2", type: "blank", name: "", date: ".", img: "/images/projects/column_pre-end_btn.png", description: "" },
    { id: "blank-end", type: "blank", name: "", date: "Fin", img: "/images/projects/column_end_btn.png", description: "" },
  ];

  const onNext = () => {
    if (selectedProjectIndex < augmentedProjectsData.length - 1) {
      setSelectedProjectIndex((prevIndex) => prevIndex + 1);
    }
  };

  const onPrevious = () => {
    if (selectedProjectIndex > 0) {
      setSelectedProjectIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    centerProjectInView();
    calculateInitialScales();
    updateButtonPositions();

    const handleScroll = () => {
      calculateInitialScales();
      updateButtonPositions();
      calculateHighlightedIndex();
    };

    const handleResize = () => {
      calculateInitialScales();
      updateButtonPositions();
      calculateHighlightedIndex();
    };

    sliderRef.current?.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      sliderRef.current?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (highlightedIndex !== null) {
        scrollToHighlighted();
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [highlightedIndex]);

  const calculateInitialScales = () => {
    const projects = Array.from(sliderRef.current?.children || []);
    const sliderCenter = sliderRef.current.scrollLeft + sliderRef.current.offsetWidth / 2;
    const baseScales = [1, 0.9, 0.8, 0.7];
    let calculatedScales = [];
    let calculatedCenterIndex = null;
    let minDistance = Infinity;

    projects.forEach((project, index) => {
      const projectCenter = project.offsetLeft + project.offsetWidth / 2;
      const distanceFromCenter = Math.abs(sliderCenter - projectCenter);

      if (distanceFromCenter < minDistance) {
        minDistance = distanceFromCenter;
        calculatedCenterIndex = index;
      }
    });

    projects.forEach((_, index) => {
      const scaleIndex = Math.min(Math.abs(index - calculatedCenterIndex), baseScales.length - 1);
      calculatedScales[index] = baseScales[scaleIndex];
    });

    setScales(calculatedScales);
    setCenterIndex(calculatedCenterIndex);
  };

  const calculateHighlightedIndex = () => {
    const projects = Array.from(sliderRef.current?.children || []);
    const sliderCenter = sliderRef.current.scrollLeft + sliderRef.current.offsetWidth / 2;
    let closestIndex = null;
    let minDistance = Infinity;

    projects.forEach((project, index) => {
      const projectCenter = project.offsetLeft + project.offsetWidth / 2;
      const distanceFromCenter = Math.abs(sliderCenter - projectCenter);

      if (distanceFromCenter < minDistance) {
        minDistance = distanceFromCenter;
        closestIndex = index;
      }
    });

    setHighlightedIndex(closestIndex);
  };

  const scrollToHighlighted = () => {
    const projects = Array.from(sliderRef.current?.children || []);
    if (highlightedIndex !== null && projects[highlightedIndex]) {
      const highlightedProject = projects[highlightedIndex];
      const offset = highlightedProject.offsetLeft - sliderRef.current.offsetWidth / 2 + highlightedProject.offsetWidth / 2;
      sliderRef.current.scrollTo({
        left: offset,
        behavior: "smooth",
      });
    }
  };

  const centerProjectInView = () => {
    const projects = Array.from(sliderRef.current?.children || []);
    const centerIndex = Math.floor(projects.length / 2);
    const centerProject = projects[centerIndex];
    const offset = centerProject.offsetLeft - sliderRef.current.offsetWidth / 2 + centerProject.offsetWidth / 2;

    sliderRef.current.scrollTo({
      left: offset,
      behavior: "smooth",
    });
  };

  const updateButtonPositions = () => {
    const projects = Array.from(sliderRef.current?.children || []);
    const newPositions = {};

    projects.forEach((project, index) => {
      const rect = project.getBoundingClientRect();
      const xOffset = rect.left + rect.width / 2 - sliderRef.current.getBoundingClientRect().left;
      newPositions[index] = { x: xOffset, y: rect.top };
    });

    setButtonPositions(newPositions);
  };

  return (
    <>
      <motion.div
        ref={sliderRef}
        className="projects-slider-menu flex flex-row gap-20 overflow-hidden overflow-scroll"
        style={{ position: "relative" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {augmentedProjectsData.map((project, index) => {
          const isBlankStart = project.id === "blank-start";
          const isBlankEnd = project.id === "blank-end";
          const distanceFromCenter = Math.abs(index - centerIndex);
          const buttonZIndex = centerIndex - Math.abs(index - centerIndex); // Adjust z-index for right-side elements
          const triangleZIndex = buttonZIndex - 1;

          return (
            <motion.div
              key={project.id}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: scales[index] || 1 }}
              transition={{
                type: "spring",
                bounce: 0.5,
                duration: 0.3,
                delay: index * 0.05,
              }}
              style={{
                position: "relative",
                transformOrigin: "bottom",
                minWidth: "60px",
                height: "350px",
                zIndex: buttonZIndex,
              }}
              className="project-column-container h-100"
              onClick={() => !isBlankStart && !isBlankEnd && setSelectedProjectIndex(index)} 
            >
              <div style={{ position: "relative", zIndex: buttonZIndex }}>
                {isBlankStart || isBlankEnd ? (
                  <img
                    src={project.img}
                    alt={project.date}
                    style={{
                      height: "345px",
                      width: "60px",
                    }}
                  />
                ) : (
                  <ProjectColumn project={project} />
                )}
              </div>

              {(index !== centerIndex || isBlankStart || isBlankEnd) && (
                <div
                  className={`triangle ${index < centerIndex ? "triangle-right" : "triangle-left"}`}
                  style={{
                    position: "absolute",
                    zIndex: triangleZIndex,
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <ProjectDatesFooter
        projectsData={augmentedProjectsData}
        buttonPositions={buttonPositions}
        highlightedIndex={highlightedIndex}
      />

      <AnimatePresence>
        {selectedProjectIndex !== null && (
          <ProjectsModal
            project={augmentedProjectsData[selectedProjectIndex]}
            onClose={() => setSelectedProjectIndex(null)}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        )}
      </AnimatePresence>
    </>
  );
}
