// src/components/IdeesMobile.jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomFoldClass } from "../hooks/foldedCorner";
import ideesData from "../jsonFiles/ideesData.json"; // Importer les données JSON
import CategoryButton from "./CategoryButton"; // Assurez-vous d'avoir ce composant


const IdeesMobile = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [arrowExpanded, setArrowExpanded] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState([]); // Contrôle des catégories visibles
  const containerRef = useRef(null);
  const ideesContainerRef = useRef(null);

  // Mémoriser les catégories
  const categories = useMemo(() => Object.keys(ideesData), [ideesData]);

  // Debugging : Réduire les logs pour éviter la surcharge
  useEffect(() => {
    console.log("ideesData:", ideesData);
    console.log("categories:", categories);
  }, [categories, ideesData]);

  useEffect(() => {
    // Afficher les catégories après l'expansion de la flèche
    if (arrowExpanded && visibleCategories.length === 0) { // Ajouter une condition pour éviter les ajouts répétés
      categories.forEach((category, index) => {
        setTimeout(() => {
          setVisibleCategories((prev) => [...prev, category]);
        }, index * 300); // Ajustez le délai selon vos besoins
      });
    }
  }, [arrowExpanded, categories, visibleCategories.length]);

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
    if (!arrowExpanded) { // S'assurer que arrowExpanded n'est pas déjà true
      setArrowExpanded(true);
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
        {categories.map((category, index) => {
          const isVisible = visibleCategories.includes(category);
          const total = categories.length;
          const initialPos = { x: 0, y: 0, rotate: 0 }; // Vous pouvez ajuster cela si nécessaire
          return (
            <div key={category} className="category-section">
              <AnimatePresence>
                {isVisible && (
                  <CategoryButton
                    category={category}
                    index={index}
                    onClick={() => toggleCategory(category)}
                  />
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
                          transform: `rotate(${randomRotation}deg)`,
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
