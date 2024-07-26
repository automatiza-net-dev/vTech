// @ts-nocheck
import React from "react";

import moment from "moment";
import { convertToAge } from "@/OLD/utils/generalUtils";

export default function PatientHeader({ patient }) {
  const years = moment(new Date()).diff(patient?.birth_date, "years", true);

  return (
    <>
      <hr />
      <div className="uk-flex uk-flex-between uk-text-left">
        <section style={{ maxWidth: "50%" }}>
          <div>
            Pet: {patient?.tag} - {patient?.name}
          </div>
          <div>
            Espécie:{" "}
            {patient?.specie ||
              patient?.patientAnimal?.race?.specie?.description ||
              "-"}
          </div>
          <div>
            Raça:{" "}
            {patient?.race || patient?.patientAnimal?.race?.description || "-"}
          </div>
          <div>
            Pelagem:{" "}
            {patient?.hair || patient?.patientAnimal?.hair?.description || "-"}
          </div>
          <div>Responsável: {patient?.tutor?.name || "-"}</div>
          <div>
            Endereço:{" "}
            {patient?.tutor?.address || patient?.tutor?.fullAddress || "-"}
          </div>
        </section>
        <section className="uk-text-left uk-width-1-3">
          <div>
            Peso:{" "}
            {patient?.weight
              ? `${patient?.weight}Kg Em ${moment(patient?.weight_date).format(
                  "DD/MM/YYYY"
                )}`
              : "-"}
          </div>
          <div>Sexo: {patient?.gender === "male" ? "Macho" : "Fêmea"}</div>
          <div>Idade: {convertToAge(years)}</div>
          <div>
            Chip:{" "}
            {patient?.microchip || patient?.patientAnimal?.microchip || "-"}
          </div>
          <div>CPF: {patient.tutor?.document || "-"}</div>
        </section>
      </div>
      <hr />
    </>
  );
}
