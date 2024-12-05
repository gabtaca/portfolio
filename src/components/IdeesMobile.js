// src/components/IdeesMobile.js

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { getRandomFoldClass } from "../hooks/foldedCorner";
import ideesData from "../jsonFiles/ideesData.json"; // Import du fichier JSON

const categories = Object.keys(ideesData); // Obtenir les catégories depuis les clés JSON

const IdeesMobile = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [arrowExpanded, setArrowExpanded] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState([]); // Contrôle des catégories visibles
  const containerRef = useRef(null);
  const ideesContainerRef = useRef(null);

  useEffect(() => {
    // Rendre les catégories visibles après l'animation de la flèche
    if (arrowExpanded) {
      categories.forEach((category, index) => {
        setTimeout(() => {
          setVisibleCategories((prev) => [...prev, category]);
        }, index * 300); // Ajustez le délai selon vos besoins
      });
    }
  }, [arrowExpanded]);

  // Gérer la fermeture de la catégorie active lors d'un clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsidePostIts =
        containerRef.current && !containerRef.current.contains(event.target);
      const isOutsideCategories =
        ideesContainerRef.current &&
        !ideesContainerRef.current.contains(event.target);

      if (isOutsidePostIts && isOutsideCategories) {
        setActiveCategory(null); // Fermer la catégorie si clic en dehors des deux
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
    // Fermer la catégorie active si c'est la même; ouvrir une nouvelle sinon
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  const handleArrowAnimationEnd = () => {
    setArrowExpanded(true);
  };

  // Définir les positions initiales pour la forme en V
  const getInitialPosition = (index, total) => {
    const middle = Math.floor(total / 2);
    if (total % 2 === 1) { // nombre impair de boutons
      if (index < middle) return { x: -50, y: -50, rotate: -45 };
      if (index > middle) return { x: 50, y: -50, rotate: 45 };
      return { x: 0, y: -50, rotate: 0 };
    } else { // nombre pair de boutons
      if (index < total / 2 - 1) return { x: -100, y: -50, rotate: -45 };
      if (index >= total / 2) return { x: 100, y: -50, rotate: 45 };
      return { x: 0, y: -50, rotate: 0 };
    }
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
        {categories.map((category, index) => {
          const isVisible = visibleCategories.includes(category);
          const total = categories.length;
          const initialPos = getInitialPosition(index, total);
          return (
            <div key={category} className="category-section">
              <AnimatePresence>
                {isVisible && (
                  <motion.button
                    className="category-button"
                    onClick={() => toggleCategory(category)}
                    custom={initialPos}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={buttonVariants}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  >
                    {category}
                  </motion.button>
                )}
                
              </AnimatePresence>
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
                              <span className="postit_description">Description</span>
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
          );
        })}
      </div>

      {/* Flèche en pointillés qui pointe en haut */}
      <motion.div
        className="dashed-arrow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <img
          src="/images/arrow_up.svg"
          alt="image de flèche pointant en haut"
          className="dashed-arrow-head"
        />
        <motion.div
          className="dashed-arrow-line"
          onAnimationEnd={handleArrowAnimationEnd}
          initial={{ height: 0 }}
          animate={{ height: 120 }}
          transition={{ duration: 1 }}
        ></motion.div>
      </motion.div>
    </div>
  );
};

const buttonVariants = {
  hidden: (custom) => ({
    rotate: custom.rotate,
    opacity: 0,
    y: custom.y,
    x: custom.x,
  }),
  visible: {
    rotate: 0,
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: (custom) => ({
    rotate: custom.rotate,
    opacity: 0,
    y: custom.y,
    x: custom.x,
    transition: {
      duration: 0.3,
    },
  }),
};

const getRandomPostItColor = () => {
  const colors = [
    "var(--postItPink)",
    "var(--postItYellow)",
    "var(--postItGreen)",
    "var(--postItBlue)",
    "var(--postItOrange)",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomRotation = () => {
  // Générer un angle aléatoire entre -5 et 5 degrés
  return Math.random() * 10 - 5;
};

export default IdeesMobile;
