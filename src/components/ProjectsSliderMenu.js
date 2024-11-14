import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import ProjectColumn from "./ProjectColumn";
import ProjectsModal from "./ProjectsModal";
import projectsData from "../jsonFiles/projects.json";
import { motion, AnimatePresence } from "framer-motion";

const ProjectsSliderMenu = forwardRef(
  ({ setHighlightedIndex, setButtonPositions }, ref) => {
    const sliderRef = useRef(null);
    const [scales, setScales] = useState([]);
    const [centerIndex, setCenterIndex] = useState(null);
    const [highlightedIndex, setHighlightedIndexState] = useState(null);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
    const inactivityTimeout = useRef(null);
    const lastCenteredIndexRef = useRef(null);

    const startProjectIndex = Math.floor(projectsData.length / 2);

    const scrollToProjectIndex = (index) => {
      const project = sliderRef.current.children[index];
      if (project) {
        const offset =
          project.offsetLeft -
          sliderRef.current.offsetWidth / 2 +
          project.offsetWidth / 2;
        sliderRef.current.scrollTo({ left: offset, behavior: "smooth" });
        setHighlightedIndexState(index); // Update the highlighted index here
        lastCenteredIndexRef.current = index;
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToProjectIndex,
    }));

    const centerCurrentHighlightedProject = () => {
      if (lastCenteredIndexRef.current !== null) {
        scrollToProjectIndex(lastCenteredIndexRef.current);
      }
    };

    const resetInactivityTimeout = () => {
      clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(
        centerCurrentHighlightedProject,
        2000
      );
    };

    useEffect(() => {
      scrollToProjectIndex(startProjectIndex);
      calculateInitialScales();
      updateButtonPositions();

      const handleScroll = () => {
        calculateInitialScales();
        updateButtonPositions();
        calculateHighlightedIndex();
        resetInactivityTimeout();
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

    const calculateInitialScales = () => {
      const projects = Array.from(sliderRef.current?.children || []);
      const sliderCenter =
        sliderRef.current.scrollLeft + sliderRef.current.offsetWidth / 2;
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
        const scaleIndex = Math.min(
          Math.abs(index - calculatedCenterIndex),
          baseScales.length - 1
        );
        calculatedScales[index] = baseScales[scaleIndex];
      });

      setScales(calculatedScales);
      setCenterIndex(calculatedCenterIndex);
    };

    const calculateHighlightedIndex = () => {
      const projects = Array.from(sliderRef.current?.children || []);
      const sliderCenter =
        sliderRef.current.scrollLeft + sliderRef.current.offsetWidth / 2;
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

      setHighlightedIndexState(closestIndex); // Ensure state update
      lastCenteredIndexRef.current = closestIndex;
    };

    const updateButtonPositions = () => {
      const projects = Array.from(sliderRef.current?.children || []);
      const newPositions = {};

      projects.forEach((project, index) => {
        const rect = project.getBoundingClientRect();
        const xOffset =
          rect.left +
          rect.width / 2 -
          sliderRef.current.getBoundingClientRect().left;
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
          transition={{ duration: 0.3 }}
        >
          {projectsData.map((project, index) => {
            const isHighlighted = highlightedIndex === index;
            const isBlankStart = project.id === "blank-start";
            const isBlankEnd = project.id === "blank-end";
            const isBlankStart2 = project.id === "blank-start2";
            const isBlankEnd2 = project.id === "blank-end2";
            const isBookend = isBlankStart || isBlankEnd || isBlankStart2 || isBlankEnd2;
            const buttonZIndex = centerIndex - Math.abs(index - centerIndex);
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
                  delay: index * 0.02,
                }}
                style={{
                  position: "relative",
                  transformOrigin: "bottom",
                  minWidth: "60px",
                  height: "350px",
                  zIndex: buttonZIndex,
                  borderRadius: "2.5px",
                }}
                className="project-column-container h-100"
                onClick={() => !isBookend && setSelectedProjectIndex(index)}
              >
                <div style={{ position: "relative", zIndex: buttonZIndex }}>
                  {isBlankStart || isBlankEnd ? (
                    <img
                      src={project.img}
                      alt={project.date}
                      style={{
                        height: "345px",
                        width: "60px",
                        border: "0.5px solid #C9D5E1",
                        borderRadius: "2.5px",
                      }}
                    />
                  ) : (
                    <img
                      src={isHighlighted ? project.img : project.still}
                      alt={project.imgAlt || "Project Image"}
                      style={{
                        height: "345px",
                        width: "60px",
                        border: "0.5px solid #C9D5E1",
                        borderRadius: "2.5px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>

                {(index !== centerIndex || isBlankStart || isBlankEnd) && (
                  <div
                    className={`triangle ${
                      index < centerIndex ? "triangle-right" : "triangle-left"
                    }`}
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

        <AnimatePresence>
          {selectedProjectIndex !== null && (
            <ProjectsModal
              project={projectsData[selectedProjectIndex]}
              currentIndex={selectedProjectIndex}
              onClose={() => setSelectedProjectIndex(null)}
              onNext={() =>
                setSelectedProjectIndex((prevIndex) =>
                  Math.min(prevIndex + 1, projectsData.length - 1)
                )
              }
              onPrevious={() =>
                setSelectedProjectIndex((prevIndex) =>
                  Math.max(prevIndex - 1, 0)
                )
              }
              projectsData={projectsData}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
);

export default ProjectsSliderMenu;
