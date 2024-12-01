import React, { useState, useEffect, useRef } from "react";
import { getRandomFoldClass } from "../hooks/foldedCorner";
import ideesData from "../jsonFiles/ideesData.json"; // Import the JSON file


const categories = Object.keys(ideesData); // Get the categories from the JSON keys

const IdeesMobile = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [arrowExpanded, setArrowExpanded] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState([]); // Controls visible categories
  const containerRef = useRef(null);
  const ideesContainerRef = useRef(null);

  useEffect(() => {
    // Make categories visible after the arrow animation
    if (arrowExpanded) {
      categories.forEach((category, index) => {
        setTimeout(() => {
          setVisibleCategories((prev) => [...prev, category]);
        }, index * 300);
      });
    }
  }, [arrowExpanded]);

  // Handle closing the active category when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsidePostIts =
        containerRef.current && !containerRef.current.contains(event.target);
      const isOutsideCategories =
        ideesContainerRef.current &&
        !ideesContainerRef.current.contains(event.target);

      if (isOutsidePostIts && isOutsideCategories) {
        setActiveCategory(null); // Close the category if clicked outside both
      }
    };

    if (activeCategory) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeCategory]);

  const toggleCategory = (category) => {
    // Close the active category if it is the same; open a new one otherwise
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  const handleArrowAnimationEnd = () => {
    setArrowExpanded(true);
  };

  return (
    <div className="idees-container" ref={ideesContainerRef}>
      <p className="idees-subtitle">
        Un fourre-tout d'idées. Pas toujours de logique entre l'une et l'autre,
        mais un bel endroit pour relancer l'inspiration en cas de besoin !
      </p>

      {/* Conteneur des catégories au-dessus de la flèche */}
      <div className="categories-container">
        <div></div>
        {categories.map((category, index) => (
          <div key={category} className="category-section">
            <button
              className={`category-button ${
                visibleCategories.includes(category) ? "visible" : "hidden"
              }`}
              style={{
                animationDelay: `${index * 0.3}s`,
                animationName:
                  index % 2 === 0 ? "leafOpenLeft" : "leafOpenRight",
              }}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </button>
            {activeCategory === category && (
              <div className="post-it-container" ref={containerRef}>
                {ideesData[activeCategory].map((idea) => {
                  const postItColor = getRandomPostItColor();
                  const randomRotation = getRandomRotation();
                  return (
                    <div
                      key={idea.id}
                      className={`post-it ${getRandomFoldClass()}`}
                      style={{
                        backgroundColor: postItColor,
                        "--post-it-color": postItColor,
                        transform: `rotate(${randomRotation}deg)`, // Apply random rotation
                      }}
                    >
                      <div className="post-it-content">
                        <h3>{idea.title}</h3>
                        <div className="post-it_descCTRL">
                          <p>
                            <span className="postit_description">
                              Description
                            </span>
                            {idea.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        ))}
        
      </div>
            {/* Flèche en bas */}
            <div className="dashed-arrow">
        <img
          src="/images/arrow_up.svg"
          alt="image de fleche par en haut"
          className="dashed-arrow-head"
        />
        <div
          className="dashed-arrow-line"
          onAnimationEnd={handleArrowAnimationEnd}
        ></div>
      </div>
    </div>
  );
};

const getRandomPostItColor = () => {
  const colors = ["var(--postItPink)", "var(--postItYellow)", "var(--postItGreen)", "var(--postItBlue)", "var(--postItOrange)"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomRotation = () => {
  // Generate a random angle between -5 and 5 degrees
  return Math.random() * 5 - 4;
};

export default IdeesMobile;
