// @ts-nocheck
// Core
import React, { memo } from "react";

// utils
import moment from "moment";

const HeaderForm = memo(function HeaderForm({ patientData }) {
  const { patient } = patientData;
  const { bed } = patientData;
  const { tutor } = patientData;

  return (
    <section className="uk-flex uk-flex-around uk-margin-bottom">
      <div>
        <p className="uk-margin-remove">
          {tutor?.name} - {tutor?.tutor?.cellphone || tutor?.cellphone}
        </p>
        <h3 className="uk-margin-remove">{patient?.name}</h3>
        <section>RG: {patient?.tag} </section>
        <p className="uk-text-muted uk-margin-remove">
          {patient?.patientAnimal?.race?.specie?.description || patient?.specie}
          &nbsp;{">"}&nbsp;
          {patient?.patientAnimal?.race?.description || patient?.race}
          ,&nbsp;pelagem:,&nbsp;{patient?.flur || "-"},&nbsp;
          {patient?.birth_date || patient?.birthDate
            ? `${moment(new Date()).diff(
                patient?.birth_date || patient?.birthDate,
                "years"
              )} Anos`
            : "Idade não informada"}
          ,&nbsp;peso: {patient?.weight} em{" "}
          {moment(patient?.weight_date).format("DD/MM/YYYY")}
        </p>
      </div>
      <div>
        <label>Leito</label>
        <br />
        {bed?.name ? `${bed?.name} - ${bed?.tag}` : "Leito não informado"}
      </div>
    </section>
  );
});

export default HeaderForm;
