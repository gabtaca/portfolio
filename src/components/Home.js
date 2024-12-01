// src/components/Home.js

import React, { useState, useRef, useEffect } from "react";
import "animate.css";
import { motion, AnimatePresence } from "framer-motion"; // Importation de Framer Motion
import ProjectsSlider from "./ProjectsSlider";
import CvMobile from "./CvMobile";
import IdeesMobile from "./IdeesMobile";
import LightningHeader from "./LightningHeader";
import classNames from "classnames";
import useTheme from "../hooks/useTheme";

export default function Home() {
  const { isDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState(null);

  // État pour gérer la visibilité de la bulle de dialogue
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

  // Références pour les boutons
  const btnIdeasRef = useRef(null);
  const btnProjectsRef = useRef(null);
  const btnCvRef = useRef(null);

  // Référence pour le footer de la page d'accueil
  const homeFooterRef = useRef(null);

  // Référence pour le footer du CV
  const cvFooterRef = useRef(null);

  // Références pour la bulle et l'icône du téléphone
  const bubbleRef = useRef(null);
  const phoneIconRef = useRef(null);

  // Fonction pour afficher le home_footer avec animation d'entrée
  const showHomeFooter = () => {
    if (
      homeFooterRef.current &&
      homeFooterRef.current.style.display !== "flex"
    ) {
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
      homeFooterRef.current.addEventListener(
        "animationend",
        handleAnimationEnd
      );
    }
  };

  // Fonction pour cacher le home_footer avec option d'immédiateté
  const hideHomeFooter = (immediate = false) => {
    if (
      homeFooterRef.current &&
      homeFooterRef.current.style.display !== "none"
    ) {
      if (immediate) {
        // Cacher immédiatement sans animation
        homeFooterRef.current.style.display = "none";
        homeFooterRef.current.classList.remove(
          "animate__animated",
          "animate__backInUp",
          "animate__backOutDown"
        );
      } else {
        // Cacher avec animation
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
        homeFooterRef.current.addEventListener(
          "animationend",
          handleAnimationEnd
        );
      }
    }
  };

  // Utiliser useEffect pour détecter quand la section CV est active
  useEffect(() => {
    if (activeSection === "CV") {
      // Ajouter l'animation "slideInUp" au cv_footer
      if (cvFooterRef.current) {
        cvFooterRef.current.classList.add(
          "animate__animated",
          "animate__slideInUp"
        );

        // Supprimer l'animation après qu'elle ait joué une fois
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
        cvFooterRef.current.addEventListener(
          "animationend",
          handleAnimationEnd
        );
      }
    }
  }, [activeSection]);

  // Utiliser useEffect pour gérer le clic en dehors de la bulle
  useEffect(() => {
    if (isBubbleVisible) {
      const handleClickOutside = (event) => {
        if (
          bubbleRef.current &&
          !bubbleRef.current.contains(event.target) &&
          phoneIconRef.current &&
          !phoneIconRef.current.contains(event.target)
        ) {
          setIsBubbleVisible(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isBubbleVisible]);

  // Gérer le clic sur les boutons des sections
  const handleSectionClick = (section) => {
    if (activeSection === section) {
      resetView();
      return;
    }

    // Cacher les footers en fonction de la section
    if (section === "CV") {
      // On ouvre la section CV
      hideHomeFooter(); // Cacher le home_footer avec animation
    } else {
      // On ouvre Projets ou Idées
      // Cacher le home_footer immédiatement sans animation
      hideHomeFooter(true);
    }

    // Animer les boutons en fonction de la section sélectionnée
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
      btnCvRef.current.classList.add("animate__animated", "animate__fadeOutUp");
      btnProjectsRef.current.classList.add(
        "animate__animated",
        "animate__rotateOutUpRight"
      );
    }

    // Après les animations, cacher les boutons et afficher la section
    const handleAnimationEnd = (event) => {
      event.target.style.display = "none";
      event.target.removeEventListener("animationend", handleAnimationEnd);

      // Mettre à jour la section active
      setActiveSection(section);
    };

    btnIdeasRef.current.addEventListener("animationend", handleAnimationEnd);
    btnProjectsRef.current.addEventListener("animationend", handleAnimationEnd);
    btnCvRef.current.addEventListener("animationend", handleAnimationEnd);
  };

  // Réinitialiser la vue à l'état initial
  const resetView = () => {
    // Réinitialiser les boutons
    btnIdeasRef.current.style.display = "block";
    btnProjectsRef.current.style.display = "block";
    btnCvRef.current.style.display = "block";

    btnIdeasRef.current.classList.remove(
      "animate__animated",
      "animate__rotateOutDownLeft",
      "animate__fadeOutLeft"
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

    // Afficher le home_footer avec animation
    showHomeFooter();

    // Mettre la section active à null
    setActiveSection(null);
  };

  // Fonction pour copier le numéro de téléphone dans le presse-papiers
  const copyPhoneNumber = () => {
    navigator.clipboard.writeText("+1 (418) 930-3703");
    alert("Numéro copié dans le presse-papiers !");
  };

  // Fonction pour gérer le clic sur l'icône du téléphone
  const handlePhoneClick = () => {
    setIsBubbleVisible(!isBubbleVisible);
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

        {/* Afficher le home_footer seulement si aucune section n'est active */}
        {!activeSection && (
          <footer ref={homeFooterRef} className="home_footer">
            {/* Contenu du home_footer */}
            <button
              className={classNames("svg-icon home-linkedin", {
                "dark-mode": isDarkMode,
                "light-mode": !isDarkMode,
              })}
              title="LinkedIn"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/gabriel-taca-7a65961a/?originalSubdomain=ca",
                  "_blank"
                )
              }
              style={{ cursor: "pointer", marginRight: "10px" }}
            ></button>
            <button
              className={classNames("svg-icon home-mail", {
                "dark-mode": isDarkMode,
                "light-mode": !isDarkMode,
              })}
              title="Email"
              onClick={() =>
                (window.location.href = "mailto:gabrieltaca117@gmail.com")
              }
              style={{ cursor: "pointer" }}
            ></button>

            {/* Modifier l'icône du téléphone pour ajouter l'événement onClick */}
            <button
              className={classNames("svg-icon home-call", {
                "dark-mode": isDarkMode,
                "light-mode": !isDarkMode,
              })}
              onClick={handlePhoneClick}
              style={{ cursor: "pointer" }}
              ref={phoneIconRef}
            >
              {/* Utiliser AnimatePresence pour l'animation de la bulle */}
              <AnimatePresence>
                {isBubbleVisible && (
                  <motion.div
                    ref={bubbleRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="comic_bubble"
                    style={{
                      position: "absolute",
                      bottom: "80px",
                      right: "10%",
                      background: "var(--btnBlankEnd)",
                      borderRadius: "30px",
                      padding: "10px",
                      paddingBottom: "25px",
                      zIndex: 1,
                      width: "290px",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: "600" }}>Gabriel Taca</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "5px",
                      }}
                    >
                      <a
                        href="tel:+14189303703"
                        style={{ textDecoration: "none", flexGrow: 1 }}
                      >
                        +1 (418) 930-3703
                      </a>
                      <div
                        className={classNames("svg-icon home-copy-call", {
                          "dark-mode": isDarkMode,
                          "light-mode": !isDarkMode,
                        })}
                        title="Copy"
                        onClick={copyPhoneNumber}
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </footer>
        )}

        {/* Afficher le cv_footer seulement dans la section CV */}
        {activeSection === "CV" && (
          <footer ref={cvFooterRef} className="cv_footer">
            <button
              href="/pdf/CV-Gabriel_Taca.pdf"
              download="CV-Gabriel_Taca.pdf"
              className="cv_footer-download"
            >
            </button>
          </footer>
        )}
      </div>
    </>
  );
}
