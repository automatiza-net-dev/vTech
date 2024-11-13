// Core
// @ts-nocheck
import React, { memo } from "react";

// Hooks
import { useTextReplace } from "@/OLD/hooks/useTextReplace";

// Components
import { Container } from "./styles";
import { Collapse } from "antd";
const { Panel } = Collapse;
import Variables from "./Variables";

const LabelsPanel = memo(function ({ body, setBody }: any) {
  const { templates } = useTextReplace();

  return (
    <Container className="uk-margin-small-left">
      <h5 className="uk-heading-line">Variáveis:</h5>
      <Collapse>
        {process.env.client !== "liftone" && (
          <Panel header="Dependente (Pet)">
            <Variables
              body={body}
              setBody={setBody}
              templates={templates?.filter(
                (template) => template?.origin === "PATIENT"
              )}
            />
          </Panel>
        )}
        <Panel header={process.env.client !== "liftone" ? "Tutor" : "Cliente"}>
          <Variables
            body={body}
            setBody={setBody}
            templates={templates?.filter(
              (template) => template?.origin === "TUTOR"
            )}
          />
        </Panel>
        <Panel header="Clinica">
          <Variables
            body={body}
            setBody={setBody}
            templates={templates?.filter(
              (template) => template?.origin === "BUSINESS"
            )}
          />
        </Panel>
        <Panel
          header={
            process.env.client !== "liftone" ? "Veterinário" : "Profissional"
          }
        >
          <Variables
            body={body}
            setBody={setBody}
            templates={templates?.filter(
              (template) => template?.origin === "USER"
            )}
          />
        </Panel>
        <Panel header="Agendamento">
          <Variables
            body={body}
            setBody={setBody}
            templates={templates?.filter(
              (template) => template?.origin === "SCHEDULE"
            )}
          />
        </Panel>
        <Panel header="Contratos">
          <Variables
            body={body}
            setBody={setBody}
            templates={templates?.filter(
              (template) => template?.origin === "CONTRACTS"
            )}
          />
        </Panel>
        <Panel header="Items venda">
          <Variables
            body={body}
            setBody={setBody}
            templates={templates?.filter(
              (template) => template?.origin === "BILL_ITEMS"
            )}
          />
        </Panel>
      </Collapse>
    </Container>
  );
});

export default LabelsPanel;
