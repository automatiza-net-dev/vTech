// @ts-nocheck
// Core
import React, { memo } from "react";

// Components
import { Container } from "./styles";
import { Input } from "antd";
import { Button } from "infinity-forge";

const risks = [
  { id: 1, value: "Leve" },
  { id: 2, value: "Médio" },
  { id: 3, value: "Grave" },
  { id: 4, value: "Gravíssimo" },
];

const Details = memo(function Details({ patient, setVisible }) {
  return (
    <Container>
      <div>
        <label>Queixa</label>
        <Input disabled={true} value={patient?.complaint} />
      </div>
      <div className="uk-margin-small-top">
        <label>Diagnóstico até o momento</label>
        <Input disabled={true} value={patient?.diagnosis} />
      </div>
      <div className="uk-margin-small-top">
        <label>Veterinário responsável</label>
        <Input disabled={true} value={patient?.technician?.name} />
      </div>
      <div className="uk-margin-small-top">
        <label>Tutor</label>
        <Input disabled={true} value={patient?.tutor?.name} />
      </div>
      <div className="uk-margin-small-top">
        <label>Gravidade</label>
        <Input
          disabled={true}
          value={risks.find((item) => item?.id === patient?.risk)?.value}
        />
      </div>
      <hr />
      <footer className="uk-margin-top uk-flex uk-flex-right">
        <Button onClick={() => setVisible(false)} text="Fechar" />
      </footer>
    </Container>
  );
});

export default Details;
