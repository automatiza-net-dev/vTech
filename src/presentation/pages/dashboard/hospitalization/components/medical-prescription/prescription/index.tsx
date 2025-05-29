import { useState } from "react";

import moment from "moment";
import { useFormikContext } from "formik";
import { api, Button } from "infinity-forge";
import { useQueryClient } from "@/presentation/use-query"

import { PermissionItem } from "@/presentation";

import { formatFrequency, getType } from "./utils";
import { Prescription as PrescriptionType } from "../types";

import * as S from "./styles";
import { Warning } from "./warning";

export function Prescription(
  props: PrescriptionType & { origin?: "hospitalization", prescriptionId?: string }
) {
  const [open, setOpen] = useState(false);

  const { values } = useFormikContext<{ status: string }>();
  const {refetch} = useQueryClient()

  if (
    values.status &&
    values.status !== "all" &&
    values.status !== props.status
  ) {
    return <></>;
  }

  return (
    <S.Prescription>
      <div className="header_accordion" onClick={() => setOpen((s) => !s)}>
        <div className="top">
          <span>
            <strong>Tipo:</strong> {getType(props)}
          </span>

          <span>
            {props?.frequency !== "WHEN_NEEDED" && (
              <span>
                <strong>Início:</strong>{" "}
                {moment(props.execution_start).format("DD/MM/YYYY HH:mm")}
              </span>
            )}
          </span>

          <span dangerouslySetInnerHTML={{ __html: formatFrequency(props) }} />

          <span>
            <strong>Status:</strong> {props?.status}
          </span>
        </div>

        <span>
          <strong>Resumo:</strong> {props.scheduling?.at(0)?.resume}
        </span>
      </div>

      <div className={"content" + (open ? " open" : "")}>
        <PermissionItem hash="INT04">
          {!props.excluded_at && (
            <Warning
              warningTitle="Deseja realmente interromper a prescrição?"
              onConfirm={async () => {
                await api({
                  url: `hospitalization-prescriptions/interrupt/${props.id}`,
                  method: "put",
                });

                await refetch(["medicalPrescription", props.prescriptionId])
              }}
              button={{
                Element: () => <Button text="INTERROMPER" type="button" />,
              }}
            />
          )}
        </PermissionItem>

        {props.scheduling?.map((elem, index) => (
          <div id={elem.id} className="scheduling">
            <div>
              {index === 0 && <strong>Data Agendamento</strong>}

              <span>
                {moment(elem.scheduled_at).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>

            <div>
              {index === 0 && <strong>Data Execução</strong>}

              <span>
                {elem.executed_at
                  ? moment(elem.executed_at).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </span>
            </div>

            <div>
              {index === 0 && <strong>Usuário Execução</strong>}

              <span>{elem.executionUser?.name ?? "-"}</span>
            </div>

            <div>
              {index === 0 && <strong>Observação da Execução</strong>}
              <span>{elem.description ?? "-"}</span>
            </div>
          </div>
        ))}
      </div>
    </S.Prescription>
  );
}
