import React, { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext"; 
import ProjectsSlider from "./ProjectsSlider";
import IdeesMobile from "./IdeesMobile"; // <-- import your ideas component

const HomeDesktop = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  // Manage drawers
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isIdeesOpen, setIsIdeesOpen] = useState(false);

  // Chain pulled for dark mode
  const [chainPulled, setChainPulled] = useState(false);

  // Toggle only one drawer at a time
  const toggleDrawer = (drawerName) => {
    if (drawerName === "cv") {
      setIsCvOpen(!isCvOpen);
      setIsProjectsOpen(false);
      setIsIdeesOpen(false);
    } else if (drawerName === "projects") {
      setIsProjectsOpen(!isProjectsOpen);
      setIsCvOpen(false);
      setIsIdeesOpen(false);
    } else if (drawerName === "idees") {
      setIsIdeesOpen(!isIdeesOpen);
      setIsCvOpen(false);
      setIsProjectsOpen(false);
    }
  };

  // Pull chain click => toggle dark mode
  const handlePullChain = () => {
    setChainPulled(true);
    toggleDarkMode();
  };

  // Reset chainPulled after 1s so user can reclick
  useEffect(() => {
    let timer;
    if (chainPulled) {
      timer = setTimeout(() => {
        setChainPulled(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [chainPulled]);

  return (
    <div className="home_desktop-main">
      {/* HEADER */}
      <div className="home_desktop-header">
        <div className="home_desktop-titles">
          <h1>Gabriel Taca</h1>
          <p>Idéation créative en mode solution</p>
        </div>

        {/* Pull-chain button */}
        <div className="ctrl_darkmode-pull">
          <button className="btn_pull-chain" onClick={handlePullChain}>
            <motion.img
              src={
                isDarkMode
                  ? "/images/lamp_pull-dark.png"
                  : "/images/lamp_pull-light.png"
              }
              alt="Chaine de lampe pour interupteur"
              initial="idle"
              animate={chainPulled ? "pull" : "idle"}
              variants={{
                idle: {
                  rotate: 0,
                  transformOrigin: "top center",
                },
                pull: {
                  rotate: [0, 5, -5, 2, -2, 2, -5, 0],
                  transformOrigin: "top center",
                  transition: {
                    duration: 0.75,
                    ease: "easeInOut",
                  },
                },
              }}
            />
          </button>
        </div>
      </div>

      {/* NAV / SECTIONS */}
      <nav className="home_desktop-nav">
        {/* === CV SECTION === */}
        <section className="section_desktop-cv">
          <AnimatePresence>
            {isCvOpen && (
              <motion.div
                className="drawer drawer-cv"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <button
                  className="close-drawer-btn"
                  onClick={() => setIsCvOpen(false)}
                >
                  X
                </button>

                <div className="cv-content">
                  <iframe
                    src="/pdf/CV-Gabriel_Taca.pdf"
                    width="100%"
                    height="1200px"
                    style={{ border: "none" }}
                    title="CV Gabriel Taca"
                  ></iframe>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button className="home_desktop-cv" onClick={() => toggleDrawer("cv")}>
            <h2 className="btn_cv-homeDesktop">CV</h2>
          </button>
        </section>

        {/* === PROJECTS SECTION === */}
        <section className="section_desktop-projects">
          <AnimatePresence>
            {isProjectsOpen && (
              <motion.div
                className="drawer drawer-projects"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <button
                  className="close-drawer-btn"
                  onClick={() => setIsProjectsOpen(false)}
                >
                  X
                </button>

                <ProjectsSlider forceLandscapeFooter />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="home_desktop-projects"
            onClick={() => toggleDrawer("projects")}
          >
            <h2 className="btn_projects-homeDesktop">Projets</h2>
          </button>
        </section>

        {/* === IDÉES SECTION === */}
        <section className="section_desktop-idees">
          <AnimatePresence>
            {isIdeesOpen && (
              <motion.div
                className="drawer drawer-idees"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <button
                  className="close-drawer-btn"
                  onClick={() => setIsIdeesOpen(false)}
                >
                  X
                </button>

                {/* HERE: render your IdeesMobile component for desktop */}
                <IdeesMobile />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="home_desktop-idees"
            onClick={() => toggleDrawer("idees")}
          >
            <h2 className="btn_idees-homeDesktop">Idées</h2>
          </button>
        </section>
      </nav>
    </div>
  );
};

export default HomeDesktop;
