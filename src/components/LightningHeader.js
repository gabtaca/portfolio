import React, { useState, useEffect } from 'react';
import { useAnimate, stagger, motion } from 'framer-motion';


export default function LightningHeader() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [scope, animate] = useAnimate();

  // Charger les préférences depuis localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedAnimationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
    setDarkMode(savedDarkMode);
    setAnimationsEnabled(savedAnimationsEnabled);

    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
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
  }, [open, animationsEnabled]);

  // Gestion du mode sombre
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);

    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Gestion de l'activation des animations
  const handleAnimationsToggle = () => {
    const newAnimationsEnabled = !animationsEnabled;
    setAnimationsEnabled(newAnimationsEnabled);
    localStorage.setItem('animationsEnabled', newAnimationsEnabled);
  };

  // Effet pour les éclairs
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

  return (
    <div className="lightning-header" ref={scope}>
      {/* Navigation */}
      <nav className="nav_header">
        <button className='btn_burger-header' onClick={() => setOpen(!open)}>
          <img src='/images/menu_burger.svg' alt="Menu" />
        </button>
      </nav>

      {/* Menu déroulant */}
      <motion.div className="dropdown-menu">
        <div className="dropdown-item">
          <span>Mode Sombre</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleDarkModeToggle}
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
              onChange={handleAnimationsToggle}
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
