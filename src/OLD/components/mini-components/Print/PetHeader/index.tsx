// @ts-nocheck
import React from "react";

import moment from "moment";
import { convertToAge } from "@/OLD/utils/generalUtils";

export default  function PatientHeader({ patient }) {
  const years = moment(new Date()).diff(patient?.birth_date, "years", true);
  return (
    <>
      <hr />
      <div className="uk-flex uk-flex-between uk-text-left">
        <section>
          <div>
            Pet: {patient?.tag} - {patient?.name}
          </div>
          <div>
            Espécie: {patient?.patientAnimal?.race?.specie?.description}
          </div>
          <div>Raça: {patient?.patientAnimal?.race?.description}</div>
          <div>Pelagem: {patient?.patientAnimal?.hair?.description}</div>
          <div>
            Responsável: {patient?.tutorData?.tag} - {patient?.tutorData?.name}
          </div>
          <div>
            Endereço: {patient?.tutorData?.address?.street},{" "}
            {patient?.tutorData?.address?.number}.{" "}
            {patient?.tutorData?.address?.district},{" "}
            {patient?.tutorData?.address?.city},{" "}
            {patient?.tutorData?.address?.state}
          </div>
        </section>
        <section className="uk-text-left uk-width-1-3">
          <div>
            Peso:{" "}
            {patient?.weight
              ? `${patient?.weight} Em ${moment(patient?.weightDate).format(
                  "DD/MM/YYYY"
                )}`
              : "-"}
          </div>
          <div>Sexo: {patient?.gender === "male" ? "Macho" : "Fêmea"}</div>
          <div>Idade: {convertToAge(years)}</div>
          <div>
            Chip:{" "}
            {patient?.patientAnimal?.microchip
              ? patient?.patientAnimal?.microchip
              : "-"}
          </div>
          <div>CPF: {patient?.tutorData?.document}</div>
        </section>
      </div>
      <hr />
    </>
  );
}

