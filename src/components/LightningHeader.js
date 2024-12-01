// src/components/LightningHeader.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAnimate, stagger, motion } from 'framer-motion';
import useTheme from '../hooks/useTheme';
import classNames from 'classnames';

export default function LightningHeader() {
  const { isDarkMode, toggleDarkMode, animationsEnabled, toggleAnimations } = useTheme(); // Accès au thème via le hook
  const [open, setOpen] = useState(false);
  const [scope, animate] = useAnimate();

  const dropdownRef = useRef(null);
  const burgerButtonRef = useRef(null); // Référence pour le bouton burger

  // Charger les préférences depuis localStorage (déjà géré dans ThemeContext)
  useEffect(() => {
    // Ce code peut être redondant si les préférences sont déjà chargées dans ThemeContext
  }, []);

  // Effet pour les animations du menu
  useEffect(() => {
    const staggerMenuItems = stagger(0.1, { startDelay: 0.25 });

    animate(
      ".dropdown-menu",
      {
        height: open ? 'auto' : 0,
        opacity: open ? 1 : 0
      },
      {
        type: "spring",
        bounce: 0,
        duration: animationsEnabled ? 0.4 : 0
      }
    );

    animate(
      ".dropdown-item",
      open
        ? { opacity: 1, scale: 1, x: 0 }
        : { opacity: 0, scale: 0.3, x: -50 },
      {
        duration: animationsEnabled ? 0.2 : 0,
        delay: open ? staggerMenuItems : 0
      }
    );
  }, [open, animationsEnabled, animate]);

  // Effet pour les éclairs (inchangé)
  useEffect(() => {
    let clouds = [];
    let interval;

    function handleResize() {
      clouds.forEach((cloud) => {
        positionCloud(cloud);
      });
    }

    function positionCloud(cloud) {
      const parentWidth = cloud.parentElement.clientWidth;
      const cloudWidth = cloud.clientWidth || 300;
      const maxOffset = (parentWidth - cloudWidth) / 2;
      const minOffset = -maxOffset;
      const randomOffset = Math.random() * (maxOffset - minOffset) + minOffset;
      cloud.style.setProperty('--random-x', `${randomOffset}px`);
    }

    if (typeof window !== 'undefined' && animationsEnabled) {
      clouds = document.querySelectorAll('.cloud');

      clouds.forEach((cloud) => {
        positionCloud(cloud);
      });

      window.addEventListener('resize', handleResize);

      let lastHueRotation = null;

      function getRandomHueRotation() {
        return Math.floor(Math.random() * 360);
      }

      function flashLightning(hueRotation) {
        const randomCloud = clouds[Math.floor(Math.random() * clouds.length)];

        if (randomCloud) {
          randomCloud.style.filter = `brightness(1.2) contrast(1.2) sepia(0.6) saturate(1.7) hue-rotate(${hueRotation}deg)`;

          setTimeout(() => {
            randomCloud.style.filter = 'none';
          }, 300);
        }
      }

      function triggerLightning() {
        const hueRotation = getRandomHueRotation();
        lastHueRotation = hueRotation;

        flashLightning(hueRotation);

        if (Math.random() < 0.3) {
          setTimeout(() => flashLightning(lastHueRotation), 200);
        }
      }

      interval = setInterval(triggerLightning, Math.random() * 5000 + 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [animationsEnabled]);

  // Effet pour gérer les clics en dehors du menu déroulant
  useEffect(() => {
    // Fonction pour gérer les clics en dehors du dropdown
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !burgerButtonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    // Ajouter l'écouteur d'événement si le menu est ouvert
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Nettoyer l'écouteur d'événement lorsque le menu est fermé
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="lightning-header" ref={scope}>
      {/* Navigation */}
      <nav className="nav_header">
      <button
          className={classNames("btn_burger-header", {
            "dark-mode": isDarkMode,
            "light-mode": !isDarkMode,
          })}
          onClick={() => setOpen(!open)}
          ref={burgerButtonRef} // Attacher la référence au bouton burger
          style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
        >
          {/* Utiliser un SVG ou une image comme icône de burger */}
          <img
            src={isDarkMode ? '/images/menu_burgerDarkMode.svg' : '/images/menu_burger.svg'}
            alt="Menu"
            className="burger-icon"
          />
        </button>
      </nav>

      {/* Menu déroulant */}
      <motion.div
        className="dropdown-menu"
        ref={dropdownRef} 
      >
        <div className="dropdown-item">
          <span>Mode Sombre</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode} // Utiliser la fonction toggleDarkMode du contexte
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="dropdown-item">
          <span>Animations</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={animationsEnabled}
              onChange={toggleAnimations} // Utiliser la fonction toggleAnimations du contexte
            />
            <span className="slider round"></span>
          </label>
        </div>
      </motion.div>

      {/* Conteneur des nuages */}
      <div className="clouds">
        {/* Vos nuages ici */}
      </div>
    </div>
  );
}
