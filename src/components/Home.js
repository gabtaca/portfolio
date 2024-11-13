// src/components/Home.js

import React, { useState, useRef } from 'react';
import ProjectsSliderMenu from './ProjectsSliderMenu'; // Correction du chemin

export default function Home() {
  const [showProjectsSlider, setShowProjectsSlider] = useState(false);
  const btnIdeasRef = useRef(null);
  const btnProjectsRef = useRef(null);
  const btnCVRef = useRef(null);

  const handleProjectsClick = () => {
    const btnIdeas = btnIdeasRef.current;
    const btnCV = btnCVRef.current;

    // Ajouter les animations de disparition
    btnIdeas.classList.add('animate__animated', 'animate__fadeOutLeft');
    btnCV.classList.add('animate__animated', 'animate__fadeOutRight');

    // Masquer les boutons une fois l'animation terminée
    const handleAnimationEnd = (event) => {
      event.target.style.display = 'none';
      event.target.removeEventListener('animationend', handleAnimationEnd);
      setShowProjectsSlider(true); // Afficher le ProjectsSliderMenu après l'animation
    };

    btnIdeas.addEventListener('animationend', handleAnimationEnd);
    btnCV.addEventListener('animationend', handleAnimationEnd);
  };

  return (
    <main className="display-flex flex-col justify-between align-center h-100">
      <div className="ctrl_rain">
        <nav className="nav_main display-flex flex-col py-10 align-center justify-between w-full text-24 ">
          <button ref={btnIdeasRef} className="text-h2-100 text-24 hover-underline font-italiana">
            Ideas
          </button>
          <button
            ref={btnProjectsRef}
            className="text-h2-100 text-24 hover-underline font-italiana"
            onClick={handleProjectsClick}
          >
            Projects
          </button>
          <button ref={btnCVRef} className="text-h2-100 text-24 hover-underline font-italiana">
            CV
          </button>
        </nav>
      </div>
      <div className='flex w-100'>
      {/* Affiche ProjectsSliderMenu une fois que showProjectsSlider est activé */}
      {showProjectsSlider && <ProjectsSliderMenu />}
      </div>
    </main>
  );
}
