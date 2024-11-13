import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "animate.css";

export default function ProjectDatesFooter({
  projectsData,
  buttonPositions,
  highlightedIndex,
  arcWidth = 375,
  arcHeight = 80,
  yOffsetAdjustment = 150,
  visibilityThreshold = 400,
}) {
  const [datePositions, setDatePositions] = useState([]);

  useEffect(() => {
    const calculatePositions = () => {
      const calculatedPositions = projectsData.map((_, index) => {
        const buttonPosX = buttonPositions[index]?.x || 0;
        const xNormalized = (buttonPosX / window.innerWidth) * arcWidth;
        const xPosition = xNormalized;
        const yPosition =
          -arcHeight *
            (1 - Math.pow((xNormalized - arcWidth / 2) / (arcWidth / 2), 2)) +
          yOffsetAdjustment;

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
    yOffsetAdjustment,
    arcWidth,
    arcHeight,
    visibilityThreshold,
  ]);

  return (
    <div
      className="project-dates-footer"
      style={{
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Affichage du type de projet le plus centré */}
      {highlightedIndex != null && projectsData[highlightedIndex] && (
        <div
          style={{
            position: "absolute",
            top: `${yOffsetAdjustment - arcHeight / 1.5}px`,
            textAlign: "center",
            color: "#555",
          }}
        >
          <motion.p
            className="project-type"
            style={{ fontWeight: "bold", fontSize: "1em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {projectsData[highlightedIndex].type}
          </motion.p>
          <motion.p
            className="project-name"
            style={{ fontSize: "1.6em", marginTop: "5px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {projectsData[highlightedIndex].name}
          </motion.p>
        </div>
      )}

      {/* Positionnement des dates en suivant l'arc concave */}
      {datePositions.map((pos, index) => {
        const project = projectsData[index];

        return (
          pos.isVisible && (
            <AnimatePresence key={project.id}>
              <motion.div
                className="date"
                style={{
                  position: "absolute",
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {project.date}
              </motion.div>
            </AnimatePresence>
          )
        );
      })}
    </div>
  );
}
