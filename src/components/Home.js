import React, { useState, useRef, useEffect } from "react";
import "animate.css";
import ProjectsSlider from "./ProjectsSlider";
import Cv from "./CvMobile";
import IdeesMobile from "./IdeesMobile"; // Import the Idées component

export default function Home() {
  const [activeSection, setActiveSection] = useState(null); // Track active sections
  const btnIdeasRef = useRef(null);
  const btnProjectsRef = useRef(null);
  const btnCvRef = useRef(null);
  const footerRef = useRef(null);

  const resetView = () => {
    const btnIdeas = btnIdeasRef.current;
    const btnProjects = btnProjectsRef.current;
    const btnCv = btnCvRef.current;

    // Reset buttons and animations
    btnIdeas.style.display = "block";
    btnProjects.style.display = "block";
    btnCv.style.display = "block";

    btnIdeas.classList.remove("animate__animated", "animate__rotateOutDownLeft");
    btnProjects.classList.remove(
      "animate__animated",
      "animate__rotateOutDownRight",
      "animate__rotateOutUpRight"
    );
    btnCv.classList.remove("animate__animated", "animate__fadeOutRight", "animate__fadeOutUp");

    footerRef.current.classList.add("animate__animated", "animate__backInUp");
    footerRef.current.style.display = "flex";

    setActiveSection(null); // Reset active section
  };

  const handleFooterHide = () => {
    const footer = footerRef.current;
    footer.classList.add("animate__animated", "animate__fadeOutDown");
    const handleAnimationEnd = (event) => {
      footer.style.display = "none";
      footer.classList.remove("animate__animated", "animate__fadeOutDown");
      footer.removeEventListener("animationend", handleAnimationEnd);
    };
    footer.addEventListener("animationend", handleAnimationEnd);
  };

  const handleSectionClick = (section) => {
    if (activeSection === section) {
      resetView(); // Close the section if it's already active
      return;
    }

    const btnIdeas = btnIdeasRef.current;
    const btnProjects = btnProjectsRef.current;
    const btnCv = btnCvRef.current;

    handleFooterHide();

    if (section === "CV") {
      btnIdeas.classList.add("animate__animated", "animate__rotateOutDownLeft");
      btnProjects.classList.add("animate__animated", "animate__rotateOutDownRight");
    } else if (section === "Projets") {
      btnIdeas.classList.add("animate__animated", "animate__fadeOutLeft");
      btnCv.classList.add("animate__animated", "animate__fadeOutRight");
    } else if (section === "Idées") {
      btnCv.classList.add("animate__animated", "animate__fadeOutUp");
      btnProjects.classList.add("animate__animated", "animate__rotateOutUpRight");
    }

    const handleAnimationEnd = (event) => {
      event.target.style.display = "none";
      event.target.removeEventListener("animationend", handleAnimationEnd);
      setActiveSection(section); // Show the selected section after animations end
    };

    btnIdeas.addEventListener("animationend", handleAnimationEnd);
    btnProjects.addEventListener("animationend", handleAnimationEnd);
    btnCv.addEventListener("animationend", handleAnimationEnd);
  };

  return (
    <div className="home_container">
      <nav className="nav_main-home">
        <button
          ref={btnCvRef}
          className="btn_cv-main-home text-h2-100 text-28 hover-underline font-italiana"
          onClick={() => handleSectionClick("CV")}
        >
          CV
        </button>
        <button
          ref={btnProjectsRef}
          className="btn_projets-main-home text-h2-100 text-28 hover-underline font-italiana"
          onClick={() => handleSectionClick("Projets")}
        >
          Projets
        </button>
        <button
          ref={btnIdeasRef}
          className="btn_idees-main-home text-h2-100 text-28 hover-underline font-italiana"
          onClick={() => handleSectionClick("Idées")}
        >
          Idées
        </button>
      </nav>
      <div className="content-container">
        {activeSection === "CV" && <Cv />}
        {activeSection === "Projets" && <ProjectsSlider />}
        {activeSection === "Idées" && <IdeesMobile />} 
      </div>
      <footer ref={footerRef} className="home_footer">
        <a
          href="https://www.linkedin.com/in/gabriel-taca-7a65961a/?originalSubdomain=ca"
          target="_blank"
          rel="noopener noreferrer"
          className="footer_link"
        >
          <img
            src="/images/LinkedIn_icon.svg"
            alt="LinkedIn"
            className="footer_icon"
          />
        </a>
        <a href="mailto:gabrieltaca117@gmail.com" className="footer_link">
          <img src="/images/mail.svg" alt="Email" className="footer_icon" />
        </a>
        <a href="tel:+14199303703" className="footer_link">
          <img src="/images/call.svg" alt="Call" className="footer_icon" />
        </a>
      </footer>
    </div>
  );
}
