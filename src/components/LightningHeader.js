// src/components/LightningHeader.js

import { useEffect } from 'react';

export default function LightningHeader() {
  useEffect(() => {
    let clouds = [];
    let interval;

    // Définir la fonction handleResize en dehors du bloc if
    function handleResize() {
      clouds.forEach((cloud) => {
        positionCloud(cloud);
      });
    }

    // Définir la fonction positionCloud en dehors du bloc if pour qu'elle soit accessible
    function positionCloud(cloud) {
      const parentWidth = cloud.parentElement.clientWidth;
      const cloudWidth = cloud.clientWidth || 300; // Valeur par défaut si cloudWidth est 0

      // Calculer le décalage maximal pour que le nuage reste dans le conteneur
      const maxOffset = (parentWidth - cloudWidth) / 2;
      const minOffset = -maxOffset;

      // Générer une position aléatoire entre minOffset et maxOffset
      const randomOffset = Math.random() * (maxOffset - minOffset) + minOffset;

      // Définir la variable CSS --random-x pour chaque nuage
      cloud.style.setProperty('--random-x', `${randomOffset}px`);
    }

    if (typeof window !== 'undefined') {
      clouds = document.querySelectorAll('.cloud');

      // Positionner les nuages au chargement
      clouds.forEach((cloud) => {
        positionCloud(cloud);
      });

      // Ajouter l'écouteur d'événement
      window.addEventListener('resize', handleResize);

      // Code pour les éclairs
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

        // Possibilité de double éclair
        if (Math.random() < 0.3) {
          setTimeout(() => flashLightning(lastHueRotation), 200);
        }
      }

      interval = setInterval(triggerLightning, Math.random() * 5000 + 1000);
    }

    // Fonction de nettoyage
    return () => {
      if (interval) clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return (
    <div className="lightning-header">
      {/* Navigation */}
      <nav className="nav_header">
        <button className='btn_burger-header'>
          <img src='/images/menu_burger.svg' alt="Menu" />
        </button>
      </nav>

      {/* Conteneur des nuages */}
      <div className="clouds">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
        <div className="cloud cloud4"></div>
        <div className="cloud cloud5"></div>
        <div className="cloud cloud6"></div>
        <div className="cloud cloud7"></div>
        <div className="cloud cloud8"></div>
        </div>
    </div>
  );
}