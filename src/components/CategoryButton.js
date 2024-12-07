// src/components/CategoryButton.jsx

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import PropTypes from "prop-types";

const CategoryButton = ({ category, index, onClick }) => {
  const pathRef = useRef(null);
  const controls = useAnimation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger visibility after mount
    setVisible(true);

    const textElement = pathRef.current?.parentNode.querySelector("textPath");

    if (textElement) {
      const textLength = textElement.getComputedTextLength();

      // Calculate initial and final paths based on text length and angle
      const angle = 10; // Adjust the angle as needed
      const { initialPath, finalPath } = calculatePaths(textLength, angle);

      // Initialize the path with the initialPath
      controls
        .start({
          d: initialPath,
          transition: { duration: 0 },
        })
        .then(() => {
          // Start the animation towards the finalPath
          controls.start({
            d: finalPath,
            transition: { duration: 0.5, ease: "easeInOut" }, // Increased duration for smoother animation
          });
        });
    }
  }, [category, controls]);

  /**
   * Calculates the initial V-shaped path (pointing downward) and the final horizontal path
   * based on the text length and desired angle.
   */
  const calculatePaths = (
    textLength,
    angleDegrees,
    svgWidth = 200,
    finalLegY = 25 // Position of the hinge point from the top
  ) => {
    const angleRad = (angleDegrees * Math.PI) / 180;
    const armAngleRad = angleRad / 2;
    const armLength = textLength / (2 * Math.sin(armAngleRad));
    let deltaY = armLength * Math.cos(armAngleRad);

    if (deltaY > finalLegY) {
      deltaY = finalLegY;
    }

    const centerX = svgWidth / 2;
    const hingeX = centerX;
    const hingeY = finalLegY;
    const leftX = centerX - textLength / 2;
    const leftY = hingeY + deltaY; // Changed from hingeY - deltaY to hingeY + deltaY
    const rightX = centerX + textLength / 2;
    const rightY = hingeY + deltaY; // Changed from hingeY - deltaY to hingeY + deltaY

    const initialPath = `M${leftX},${hingeY} L${hingeX},${hingeY + deltaY} L${rightX},${hingeY}`; // Pointing downward
    const finalPath = `M${leftX},${hingeY} L${hingeX},${hingeY} L${rightX},${hingeY}`; // Horizontal line

    return { initialPath, finalPath };
  };

  return (
    <button
      className={`category-button ${visible ? "visible" : ""}`}
      onClick={onClick}
    >
      <svg
        className="svg-animation"
        viewBox="0 0 200 60" // Adjusted to match the button's height
        aria-labelledby={`title-${category}-${index} desc-${category}-${index}`}
        role="img"
      >
        <title id={`title-${category}-${index}`}>
          {`Animated Text Path for ${category}`}
        </title>
        <desc id={`desc-${category}-${index}`}>
          {`Text animates from a closed V-shape to a horizontal line for ${category}.`}
        </desc>
        <motion.path
          id={`animatedPath-${category}-${index}`} // Unique identifier
          className="animatedPath"
          d={`M${20},${25 + 10} L${100},${25 + 10 + 15} L${180},${25 + 10}`} // Example initial path (adjust as needed)
          fill="none"
          stroke="none" // Initially no stroke
          ref={pathRef}
          animate={controls}
        />
        <text className="text">
          <textPath
            href={`#animatedPath-${category}-${index}`}
            className="textPathRef"
            startOffset="50%" // Center the text on the path
          >
            {category}
          </textPath>
        </text>
      </svg>
    </button>
  );
};

CategoryButton.propTypes = {
  category: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CategoryButton;
