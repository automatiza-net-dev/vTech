// @ts-nocheck
// Core
import React, { useEffect, useState, memo } from "react";

//Components
import { Container } from "./styles";
import PatientList from "./Patient";
import LegendBox from "./LegendBox";

// Icons
import { BsArrowDown } from "react-icons/bs";

const HospitalizationItem = memo(function HospitalizationItem({
  patientData,
  menu,
  setFormsVisible,
  setSelectedPatient,
  selectedDate,
  selectedPatient,
  reload,
  setReload
}) {
  const [legendVisible, setLegendVisible] = useState(false);
  return (
    <Container className="uk-margin-top">
      <LegendBox visible={legendVisible} setVisible={setLegendVisible} />
      <div className="uk-flex uk-flex-center">
        <label onClick={() => setLegendVisible(true)} className="legend-button">
          <BsArrowDown size={25} onClick={() => setLegendVisible(true)} />
          &nbsp;Legenda
        </label>
      </div>
      <PatientList
        reload={reload}
        setReload={setReload}
        patients={patientData}
        menu={menu}
        setFormsVisible={setFormsVisible}
        setSelectedPatient={setSelectedPatient}
        selectedDate={selectedDate}
        selectedPatient={selectedPatient}
      />
    </Container>
  );
});

export default HospitalizationItem;
