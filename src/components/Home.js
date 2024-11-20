// src/components/Home.js

import React, { useState, useRef } from 'react';
import 'animate.css';
import ProjectsSlider from './ProjectsSlider';

export default function Home() {
  const [showProjectsSlider, setShowProjectsSlider] = useState(false);
  const [highlightedDate, setHighlightedDate] = useState('');
  const sliderRef = useRef(null); // Reference for the slider
  const btnIdeasRef = useRef(null);
  const btnProjectsRef = useRef(null);
  const btnCVRef = useRef(null);

  const handleProjectsClick = () => {
    const btnIdeas = btnIdeasRef.current;
    const btnCV = btnCVRef.current;

    btnIdeas.classList.add('animate__animated', 'animate__fadeOutLeft');
    btnCV.classList.add('animate__animated', 'animate__fadeOutRight');

    const handleAnimationEnd = (event) => {
      event.target.style.display = 'none';
      event.target.removeEventListener('animationend', handleAnimationEnd);
      setShowProjectsSlider(true);
    };

    btnIdeas.addEventListener('animationend', handleAnimationEnd);
    btnCV.addEventListener('animationend', handleAnimationEnd);
  };

  return (
    <main className="main_home">
      <nav className="nav_main display-flex flex-col align-center justify-between w-full text-24 ">
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
      <div className='flex w-100'>
        {showProjectsSlider && (
          <ProjectsSlider
            ref={sliderRef}
            setHighlightedDate={setHighlightedDate}
          />
        )}
      </div>
    </main>
  );
}
