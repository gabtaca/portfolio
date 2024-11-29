// src/components/Home.js

import React, { useState, useRef } from "react";
import "animate.css";
import ProjectsSlider from "./ProjectsSlider";
import CvMobile from "./CvMobile";
import IdeesMobile from "./IdeesMobile";
import LightningHeader from "./LightningHeader";

export default function Home() {
  const [activeSection, setActiveSection] = useState(null);
  const btnIdeasRef = useRef(null);
  const btnProjectsRef = useRef(null);
  const btnCvRef = useRef(null);
  const homeFooterRef = useRef(null);
  const cvFooterRef = useRef(null);

  // Function to show the home_footer with entrance animation
  const showHomeFooter = () => {
    if (homeFooterRef.current) {
      homeFooterRef.current.style.display = "flex";
      homeFooterRef.current.classList.add(
        "animate__animated",
        "animate__backInUp"
      );
      const handleAnimationEnd = () => {
        if (homeFooterRef.current) {
          homeFooterRef.current.classList.remove(
            "animate__animated",
            "animate__backInUp"
          );
          homeFooterRef.current.removeEventListener(
            "animationend",
            handleAnimationEnd
          );
        }
      };
      homeFooterRef.current.addEventListener("animationend", handleAnimationEnd);
    }
  };

  // Function to hide the home_footer with exit animation
  const hideHomeFooter = () => {
    if (homeFooterRef.current) {
      homeFooterRef.current.classList.add(
        "animate__animated",
        "animate__backOutDown"
      );
      const handleAnimationEnd = () => {
        if (homeFooterRef.current) {
          homeFooterRef.current.style.display = "none";
          homeFooterRef.current.classList.remove(
            "animate__animated",
            "animate__backOutDown"
          );
          homeFooterRef.current.removeEventListener(
            "animationend",
            handleAnimationEnd
          );
        }
      };
      homeFooterRef.current.addEventListener("animationend", handleAnimationEnd);
    }
  };

  // Function to show the cv_footer with entrance animation
  const showCvFooter = () => {
    if (cvFooterRef.current) {
      cvFooterRef.current.style.display = "flex";
      cvFooterRef.current.classList.add(
        "animate__animated",
        "animate__slideInUp"
      );
      const handleAnimationEnd = () => {
        if (cvFooterRef.current) {
          cvFooterRef.current.classList.remove(
            "animate__animated",
            "animate__slideInUp"
          );
          cvFooterRef.current.removeEventListener(
            "animationend",
            handleAnimationEnd
          );
        }
      };
      cvFooterRef.current.addEventListener("animationend", handleAnimationEnd);
    }
  };

  // Function to hide the cv_footer with exit animation
  const hideCvFooter = () => {
    if (cvFooterRef.current) {
      cvFooterRef.current.classList.add(
        "animate__animated",
        "animate__slideOutDown"
      );
      const handleAnimationEnd = () => {
        if (cvFooterRef.current) {
          cvFooterRef.current.style.display = "none";
          cvFooterRef.current.classList.remove(
            "animate__animated",
            "animate__slideOutDown"
          );
          cvFooterRef.current.removeEventListener(
            "animationend",
            handleAnimationEnd
          );
        }
      };
      cvFooterRef.current.addEventListener("animationend", handleAnimationEnd);
    }
  };

  // Handle section button clicks
  const handleSectionClick = (section) => {
    if (activeSection === section) {
      resetView();
      return;
    }

    // Manage footers based on the section
    if (section === "CV") {
      hideHomeFooter();
    } else {
      if (activeSection === "CV") {
        hideCvFooter();
        showHomeFooter();
      } else {
        hideHomeFooter();
      }
    }

    // Animate buttons out based on the selected section
    if (section === "CV") {
      btnIdeasRef.current.classList.add(
        "animate__animated",
        "animate__rotateOutDownLeft"
      );
      btnProjectsRef.current.classList.add(
        "animate__animated",
        "animate__rotateOutDownRight"
      );
    } else if (section === "Projets") {
      btnIdeasRef.current.classList.add(
        "animate__animated",
        "animate__fadeOutLeft"
      );
      btnCvRef.current.classList.add(
        "animate__animated",
        "animate__fadeOutRight"
      );
    } else if (section === "Idées") {
      btnCvRef.current.classList.add(
        "animate__animated",
        "animate__fadeOutUp"
      );
      btnProjectsRef.current.classList.add(
        "animate__animated",
        "animate__rotateOutUpRight"
      );
    }

    // After animations end, hide buttons and show the section
    const handleAnimationEnd = (event) => {
      event.target.style.display = "none";
      event.target.removeEventListener("animationend", handleAnimationEnd);
      setActiveSection(section);

      // Show the cv_footer if the CV section is active
      if (section === "CV") {
        showCvFooter();
      }
    };

    btnIdeasRef.current.addEventListener("animationend", handleAnimationEnd);
    btnProjectsRef.current.addEventListener("animationend", handleAnimationEnd);
    btnCvRef.current.addEventListener("animationend", handleAnimationEnd);
  };

  // Reset the view to the initial state
  const resetView = () => {
    // Reset buttons
    btnIdeasRef.current.style.display = "block";
    btnProjectsRef.current.style.display = "block";
    btnCvRef.current.style.display = "block";

    btnIdeasRef.current.classList.remove(
      "animate__animated",
      "animate__rotateOutDownLeft"
    );
    btnProjectsRef.current.classList.remove(
      "animate__animated",
      "animate__rotateOutDownRight",
      "animate__rotateOutUpRight"
    );
    btnCvRef.current.classList.remove(
      "animate__animated",
      "animate__fadeOutRight",
      "animate__fadeOutUp"
    );

    // Show the home_footer with entrance animation
    showHomeFooter();

    // Hide the cv_footer with exit animation
    hideCvFooter();

    setActiveSection(null);
  };

  return (
    <>
      <LightningHeader />
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
          {activeSection === "CV" && <CvMobile />}
          {activeSection === "Projets" && <ProjectsSlider />}
          {activeSection === "Idées" && <IdeesMobile />}
        </div>

        {/* Always render both footers */}
        <footer ref={homeFooterRef} className="home_footer">
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

        <footer
          ref={cvFooterRef}
          className="cv_footer"
          style={{ display: "none" }}
        >
          <a
            href="/pdf/CV-Gabriel_Taca.pdf"
            download="CV-Gabriel_Taca.pdf"
            className="cv_footer-download"
          >
            <img
              src="/images/download.svg"
              alt="Télécharger le CV"
              className="cv_footer-download-icon"
            />
          </a>
        </footer>
      </div>
    </>
  );
}
