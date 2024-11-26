import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import ProjectColumn from "./ProjectColumn";
import ProjectsModal from "./ProjectsModal";
import projectsData from "../jsonFiles/projects.json";
import bookendsData from "../jsonFiles/bookends.json";
import { AnimatePresence, motion } from "framer-motion";
import ProjectsDatesFooter from "./ProjectsDatesFooterPortrait";
import ProjectsDatesFooterLandscape from "./ProjectsDatesFooterLandscape";

const ProjectsSlider = forwardRef(({ setHighlightedDate }, ref) => {
  const sliderRef = useRef(null);
  const [scales, setScales] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [buttonPositions, setButtonPositions] = useState({});
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const inactivityTimeout = useRef(null);
  const lastCenteredIndexRef = useRef(null);
  const hasInitialized = useRef(false);

  const combinedData = [
    ...bookendsData.slice(0, 2),
    ...projectsData,
    ...bookendsData.slice(2),
  ];

  const startProjectIndex = Math.floor(projectsData.length / 2) + 2;

  const scrollToProjectIndex = useCallback((index, smooth = true) => {
    const project = sliderRef.current?.children[index];
    if (project) {
      const offset =
        project.offsetLeft -
        sliderRef.current.offsetWidth / 2 +
        project.offsetWidth / 2;

      sliderRef.current.scrollTo({
        left: offset,
        behavior: smooth ? "smooth" : "auto",
      });

      lastCenteredIndexRef.current = index;
    }
  }, []);

  useImperativeHandle(ref, () => ({
    scrollToProjectIndex,
  }));

  const centerCurrentHighlightedProject = useCallback(() => {
    if (highlightedIndex !== null) {
      scrollToProjectIndex(highlightedIndex, true);
    }
  }, [scrollToProjectIndex, highlightedIndex]);

  const resetInactivityTimeout = useCallback(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(() => {
        centerCurrentHighlightedProject();
      }, 2000);
    }
  }, [centerCurrentHighlightedProject]);

  const calculateScalesAndHighlight = useCallback(() => {
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
    setHighlightedIndex(calculatedCenterIndex);
    lastCenteredIndexRef.current = calculatedCenterIndex;

    if (setHighlightedDate && combinedData[calculatedCenterIndex]) {
      const projectDataIndex = calculatedCenterIndex - 2;
      if (projectsData[projectDataIndex]) {
        setHighlightedDate(projectsData[projectDataIndex].date);
      }
    }
  }, [setHighlightedDate, combinedData]);

  const updateButtonPositions = useCallback(() => {
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
  }, []);

  useEffect(() => {
    if (!hasInitialized.current) {
      scrollToProjectIndex(startProjectIndex, false);
      calculateScalesAndHighlight();
      updateButtonPositions();
      hasInitialized.current = true;
    }
  }, [
    scrollToProjectIndex,
    startProjectIndex,
    calculateScalesAndHighlight,
    updateButtonPositions,
  ]);

  const handleScroll = useCallback(() => {
    calculateScalesAndHighlight();
    resetInactivityTimeout();
    updateButtonPositions();
  }, [
    calculateScalesAndHighlight,
    resetInactivityTimeout,
    updateButtonPositions,
  ]);

  const handleResize = useCallback(() => {
    setIsLandscape(window.innerWidth > window.innerHeight);
    calculateScalesAndHighlight();
    updateButtonPositions();
  }, [calculateScalesAndHighlight, updateButtonPositions]);

  useEffect(() => {
    sliderRef.current?.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      sliderRef.current?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <>
      <div
        ref={sliderRef}
        className="projects-slider-menu"
        style={{
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {combinedData.map((project, index) => {
          const isHighlighted = highlightedIndex === index;
          const distanceFromCenter = Math.abs(index - highlightedIndex);
          const buttonZIndex = combinedData.length + 15 - distanceFromCenter;

          return (
            <motion.div
              key={project.id}
              className="project-motion-wrapper"
              style={{
                transformOrigin: "bottom",
                position: "relative",
                zIndex: buttonZIndex,
              }}
              animate={{
                scale: scales[index] || 1,
                transition: { type: "spring", stiffness: 600, damping: 25 },
              }}
            >
              <ProjectColumn
                project={project}
                zIndexValue={buttonZIndex}
                centerIndex={highlightedIndex}
                index={index}
                isHighlighted={isHighlighted}
                scale={scales[index] || 1}
                onClick={() => {
                  if (!project.id.startsWith("blank")) {
                    scrollToProjectIndex(index);
                    setTimeout(() => setSelectedProjectIndex(index - 2), 300); 
                  }
                }}
              />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedProjectIndex !== null && (
          <ProjectsModal
            project={projectsData[selectedProjectIndex]}
            currentIndex={selectedProjectIndex}
            onClose={() => setSelectedProjectIndex(null)}
            onNext={() => {
              setSelectedProjectIndex((prevIndex) => {
                const newIndex = Math.min(
                  prevIndex + 1,
                  projectsData.length - 1
                );
                scrollToProjectIndex(newIndex + 2);
                lastCenteredIndexRef.current = newIndex + 2;
                return newIndex;
              });
            }}
            onPrevious={() => {
              setSelectedProjectIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                scrollToProjectIndex(newIndex + 2);
                lastCenteredIndexRef.current = newIndex + 2;
                return newIndex;
              });
            }}
            projectsData={projectsData}
          />
        )}
      </AnimatePresence>
{/* change le footer avec l'orientation */}
{isLandscape ? (
  <ProjectsDatesFooterLandscape
    projectsData={combinedData} 
    buttonPositions={buttonPositions}
  />
) : (
  <ProjectsDatesFooter
    projectsData={projectsData} 
    buttonPositions={buttonPositions}
    highlightedIndex={highlightedIndex - 2}
    scrollToProjectIndex={scrollToProjectIndex}
  />
)}
    </>
  );
});

export default ProjectsSlider;
