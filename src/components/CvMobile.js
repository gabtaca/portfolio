import React, { useState, useEffect } from "react";
import "animate.css";
import cvInfos from "../jsonFiles/cvInfos.json";

export default function CvMobile() {
  const [activeSection, setActiveSection] = useState(null); // Section actuellement ouverte
  const [footerVisible, setFooterVisible] = useState(false); // Contrôle de la visibilité du pied de page

  useEffect(() => {
    // Affiche le footer avec l'animation lorsqu'un composant est monté
    setFooterVisible(true);
  }, []);

  // Gère l'ouverture et la fermeture des sections
  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section)); // Ouvre une section ou la ferme si elle est déjà ouverte
  };

  return (
    <div className="cv_container">
      {["Formations", "Emplois", "Hard Skills", "Soft Skills"].map(
        (section) => (
          <div key={section} className="cv_section">
            {/* En-tête de la section */}
            <div className="cv_section-header">
              <button
                className="cv_sections-button"
                onClick={() => toggleSection(section)}
              >
                {section}
              </button>
            </div>

            {/* Contenu de la section */}
            {activeSection === section && (
              <div className="cv_section-content animate__animated animate__fadeIn">
                {section === "Formations" &&
                  cvInfos.formations.map((item) => (
                    <div key={item.id} className="cv_section-item">
                      <h3 className="cv_item-title">{item.programName}</h3>
                      <p className="cv_item-meta">
                        <span className="cv_item-school">{item.school}</span>
                        <span className="cv_item-redDot">{item.redDot}</span>
                        <span className="cv_item-period">{item.period}</span>
                      </p>
                      <p className="cv_item-description">{item.description}</p>
                    </div>
                  ))}

                {section === "Emplois" &&
                  cvInfos.emplois.map((item) => (
                    <div key={item.id} className="cv_section-item">
                      <h3 className="cv_item-title">{item.jobTitle}</h3>
                      <p className="cv_item-meta">
                        <span className="cv_item-company">{item.company}</span>
                        <span className="cv_item-redDot">{item.redDot}</span>
                        <span className="cv_item-period">{item.period}</span>
                      </p>
                      <p className="cv_item-description">{item.description}</p>
                    </div>
                  ))}

                {section === "Hard Skills" &&
                  cvInfos.hard_skills.map((skill, index) => (
                    <p key={index} className="cv_item-skill">
                      {skill}
                    </p>
                  ))}

                {section === "Soft Skills" &&
                  cvInfos.soft_skills.map((skill, index) => (
                    <p key={index} className="cv_item-skill">
                      {skill}
                    </p>
                  ))}
              </div>
            )}
          </div>
        )
      )}
    <div className="footer_buffer"></div>
      {/* Pied de page avec bouton de téléchargement */}
      {footerVisible && (
        <footer className="cv_footer animate__animated animate__slideInUp">
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
      )}
    </div>
  );
}