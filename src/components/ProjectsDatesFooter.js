import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "animate.css";

export default function ProjectDatesFooter({
  projectsData,
  buttonPositions,
  highlightedIndex,
  scrollToProjectIndex,
  arcWidth = 375,
  arcHeight = 80,
  yOffsetAdjustment = 150,
  visibilityThreshold = 400,
}) {
  const [datePositions, setDatePositions] = useState([]);
  const [responsiveArcWidth, setResponsiveArcWidth] = useState(arcWidth);
  const [responsiveArcHeight, setResponsiveArcHeight] = useState(arcHeight);
  const [responsiveYOffset, setResponsiveYOffset] = useState(yOffsetAdjustment);

  useEffect(() => {
    const updateResponsiveValues = () => {
      const width = window.innerWidth;
      setResponsiveArcWidth(width * 1);
    };

    updateResponsiveValues();
    window.addEventListener("resize", updateResponsiveValues);
    return () => window.removeEventListener("resize", updateResponsiveValues);
  }, []);

  useEffect(() => {
    const calculatePositions = () => {
      const calculatedPositions = projectsData.map((_, index) => {
        const buttonPosX = buttonPositions[index]?.x || 0;
        const xNormalized =
          (buttonPosX / window.innerWidth) * responsiveArcWidth;
        const xPosition = xNormalized;
        const yPosition =
          -responsiveArcHeight *
            (1 -
              Math.pow(
                (xNormalized - responsiveArcWidth / 2) /
                  (responsiveArcWidth / 2),
                2
              )) +
          responsiveYOffset;

        return {
          x: xPosition,
          y: yPosition,
          isVisible: Math.abs(buttonPosX) < visibilityThreshold,
        };
      });

      setDatePositions(calculatedPositions);
    };

    calculatePositions();
  }, [
    projectsData,
    buttonPositions,
    responsiveArcWidth,
    responsiveArcHeight,
    responsiveYOffset,
    visibilityThreshold,
  ]);

  const handleDateClick = (index) => {
    if (scrollToProjectIndex) {
      scrollToProjectIndex(index);
    }
  };

  return (
    <div
      className="project-dates-footer"
      style={{
        overflow: "hidden",
        width: "100%",
        padding: "0 0",
      }}
    >
      {highlightedIndex != null && projectsData[highlightedIndex] && (
        <div
          style={{
            position: "absolute",
            top: responsiveYOffset - responsiveArcHeight / 1 + "px",
            textAlign: "center",
            color: "#555",
          }}
        >
          <motion.p
            className="project-type"
            style={{
              fontWeight: "bold",
              fontSize: "24px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {projectsData[highlightedIndex].type}
          </motion.p>
          <motion.p
            className="project-name"
            style={{ fontSize: window.innerWidth > 768 ? "1.6em" : "32px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {projectsData[highlightedIndex].name}
          </motion.p>
        </div>
      )}

      {datePositions.map((pos, index) => {
        const project = projectsData[index];

        return (
          pos.isVisible && (
            <AnimatePresence key={project.id}>
              <motion.button
                className="date-button"
                style={{
                  position: "absolute",
                  left: pos.x + "px",
                  top: pos.y + "px",
                  transform: "translate(-50%, -120%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: window.innerWidth > 768 ? "1.7em" : "24px",
                }}
                onClick={() => handleDateClick(index)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {project.date}
              </motion.button>
            </AnimatePresence>
          )
        );
      })}
    </div>
  );
}
