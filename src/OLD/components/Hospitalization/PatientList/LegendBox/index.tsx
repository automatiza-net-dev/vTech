// @ts-nocheck
// Core
import React, { memo } from "react";

// Components
import { Container } from "./styles";
import { Drawer } from "antd";

// Utils
import { BsFillClockFill } from "react-icons/bs";
import { VscTriangleDown } from "react-icons/vsc";
import { VscTriangleRight } from "react-icons/vsc";

// Icons
import { BsArrowUp } from "react-icons/bs";

const LegendBox = memo(function LegendBox({ visible, setVisible }) {
  return (
    <Drawer
      visible={visible}
      onClose={() => setVisible(false)}
      placement="top"
      height={300}
    >
      <Container className="uk-padding-small">
        <div className="main-section">
          <h4>Legenda:</h4>
          <div>
            <div>
              <BsFillClockFill color="yellow" />
              &nbsp;Prescrição Médica, Quando necessário
            </div>
            <div>
              <BsFillClockFill color="gray" />
              &nbsp;Prescrição Médica, Somente uma vez
            </div>
          </div>
          <div>
            <div>
              <BsFillClockFill color="green" />
              &nbsp;Prescrição Médica, Executada
            </div>
            <div>
              <BsFillClockFill color="red" />
              &nbsp;Prescrição Médica, Não executada
            </div>
          </div>
          <div>
            <div>
              <BsFillClockFill color="blue" />
              &nbsp;Prescrição Médica, A executar
            </div>
            <div>
              <BsFillClockFill color="orange" />
              &nbsp;Ocorrências
            </div>
          </div>
          <div>
            <div>
              <VscTriangleRight />
              &nbsp;Detalhamento prescrições paciente
            </div>
            <div>
              <VscTriangleDown />
              &nbsp;Detalhamento prescrições horário
            </div>
          </div>
        </div>
        <div className="uk-margin-top uk-flex uk-flex-center">
          <div className="uk-margin-right">
            <span style={{ backgroundColor: "var(--blue)" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            &nbsp;Situação do paciente não informada
          </div>
          <div className="uk-margin-right">
            <span style={{ backgroundColor: "#2E8B57" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            &nbsp;Situação do paciente leve
          </div>
          <div className="uk-margin-right">
            <span style={{ backgroundColor: "#FFD700" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            &nbsp;Situação do paciente media
          </div>
          <div className="uk-margin-right">
            <span style={{ backgroundColor: "#FF8C00" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            &nbsp;Situação do paciente grave
          </div>
          <div>
            <span style={{ backgroundColor: "var(--red)" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            &nbsp;Situação do paciente gravíssima
          </div>
        </div>
      </Container>
      <div className="uk-flex uk-flex-center uk-margin-large-top">
        <label onClick={() => setVisible(false)} style={{ cursor: "pointer" }}>
          <BsArrowUp size={25} />
          Fechar
        </label>
      </div>
    </Drawer>
  );
});

export default LegendBox;
