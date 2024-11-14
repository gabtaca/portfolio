import React, { useState, useRef } from 'react';
import ProjectsSliderMenu from './ProjectsSliderMenu';
import ProjectDatesFooter from './ProjectsDatesFooter';
import projectsData from '../jsonFiles/projects.json';

export default function Home() {
  const [showProjectsSlider, setShowProjectsSlider] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [buttonPositions, setButtonPositions] = useState({});
  const sliderRef = useRef(null);  // Référence pour le slider
  const btnIdeasRef = useRef(null);
  const btnProjectsRef = useRef(null);
  const btnCVRef = useRef(null);

  // Définir scrollToProjectIndex pour recentrer un projet spécifique
  const scrollToProjectIndex = (index) => {
    if (sliderRef.current) {
      sliderRef.current.scrollToProjectIndex(index);
    }
  };

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
    <main className="display-flex flex-col justify-between align-center">
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
        {showProjectsSlider && (
          <ProjectsSliderMenu
            ref={sliderRef}  // Référence pour accéder à scrollToProjectIndex
            setHighlightedIndex={setHighlightedIndex}
            setButtonPositions={setButtonPositions}
          />
        )}
      </div>
      {showProjectsSlider && (
        <ProjectDatesFooter
          projectsData={projectsData}
          buttonPositions={buttonPositions}
          highlightedIndex={highlightedIndex}
          scrollToProjectIndex={scrollToProjectIndex}
        />
      )}
    </main>
  );
}
