import React, { memo } from "react";

import { useTextReplace } from "@/OLD/hooks/useTextReplace";

import { Container } from "./styles";
import { Collapse } from "antd";
const { Panel } = Collapse;
import Variables from "./Variables";
import { useConfigurationsSystem } from "@/presentation";

const LabelsPanel = memo(function ({  handleInsert }: any) {
  const { templates } = useTextReplace();

  const {type} = useConfigurationsSystem()

  return (
    <Container className="uk-margin-small-left">
      <h5 className="uk-heading-line">Variáveis:</h5>
      <Collapse>
        {type === "Vet" && (
          <Panel header="Dependente (Pet)" key={""}>
            <Variables
              handleInsert={handleInsert}
              templates={templates?.filter(
                (template) => template?.origin === "PATIENT"
              )}
            />
          </Panel>
        )}
        <Panel key={""}  header={type === "Vet" ? "Responsável" : "Cliente"}>
          <Variables
          handleInsert={handleInsert}
            templates={templates?.filter(
              (template) => template?.origin === "TUTOR"
            )}
          />
        </Panel>
        <Panel key={""} header="Clinica">
          <Variables
          handleInsert={handleInsert}
            templates={templates?.filter(
              (template) => template?.origin === "BUSINESS"
            )}
          />
        </Panel>
        <Panel key={""}
          header={
            type === "Vet" ? "Veterinário" : "Profissional"
          }
        >
          <Variables
          handleInsert={handleInsert}
            templates={templates?.filter(
              (template) => template?.origin === "USER"
            )}
          />
        </Panel>
        <Panel key={""} header="Agendamento">
          <Variables
      handleInsert={handleInsert}
            
            templates={templates?.filter(
              (template) => template?.origin === "SCHEDULE"
            )}
          />
        </Panel>
        <Panel key={""} header="Contratos">
          <Variables
          handleInsert={handleInsert}
            
            templates={templates?.filter(
              (template) => template?.origin === "CONTRACTS"
            )}
          />
        </Panel>
        <Panel key={""} header="Items venda">
          <Variables
          handleInsert={handleInsert}
            
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
