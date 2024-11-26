import React, { useMemo } from "react";

export default function ProjectsDatesFooterLandscape({ projectsData, buttonPositions, sliderScrollLeft = 0 }) {
  const groupedDates = useMemo(() => {
    const groups = {};
    projectsData.forEach((project, index) => {
      // Exclure les bookends
      if (project.id.startsWith("blank")) return;

      if (!groups[project.date]) groups[project.date] = [];
      groups[project.date].push(index); // Index des boutons
    });
    return groups;
  }, [projectsData]);

  return (
    <div
      className="projects-dates-footer-landscape"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        paddingTop: "10px",
        marginBottom: "20px",
      }}
    >
      {Object.entries(groupedDates).map(([date, buttonIndices], groupIndex) => {
        if (!buttonIndices.length) return null; 

        const firstButton = buttonPositions[buttonIndices[0]];
        const lastButton = buttonPositions[buttonIndices[buttonIndices.length - 1]];

        const leftPosition = (firstButton?.x || buttonIndices[0] * 0) - sliderScrollLeft; 
        const rightPosition =
          (lastButton?.x + (lastButton?.width || 0)) - sliderScrollLeft;

        const totalWidth = rightPosition - leftPosition;

        return (
          <div
            key={groupIndex}
            className="date-group"
            style={{
              position: "absolute",
              top: "0",
              left: `${leftPosition}px`,
              width: `${totalWidth}px`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            {/* boites pour présenter les dates.*/}
            <div
              style={{
                width: "100%",
                height: "15px",
                backgroundColor: "transparent",
                borderBottom: "1.5px dashed #677684",
                borderLeft: groupIndex ===  "1.5px dashed #677684",
                borderRight: "1.5px dashed #677684",
              }}
            ></div>
            {/* Date */}
            <p
              style={{
                marginBottom: "10px",
                fontFamily: "Jockey One",
                fontSize: "20px",
                fontWeight: "bold",
                color: "var(--datesColor)",
                textAlign: "center",
              }}
            >
              {date}
            </p>
          </div>
        );
      })}
    </div>
  );
}
