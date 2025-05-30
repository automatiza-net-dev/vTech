import moment from "moment";
import { useAuthAdmin } from "infinity-forge";

import { Patient, TimeLine } from "@/domain";
import { useConfigurationsSystem } from "@/presentation";

import * as S from "./styles";

export function PdfPatientAttendance(
  props: Partial<TimeLine["timeline_info"]> & { patient: Patient }
) {
  const { user } = useAuthAdmin();

  const { type } = useConfigurationsSystem();

  return (
    <S.PdfPatientAttendance>
      <div className="row">
        <span className="font-14-regular">
          <strong>
            {type === "Vet" ? "Pet:" : "Paciente:"}:
          </strong>
          <span>{props.patient?.name || "-"}</span>
        </span>

        <span className="font-14-regular">
          <strong>Peso:</strong>
          {props.patient?.weight ? (
            <span>
              {props.patient?.weight || "-"} Em{" "}
              {props.patient?.weight_date
                ? moment(props.patient?.weight_date).format("DD/MM/YYYY")
                : "-"}
            </span>
          ) : (
            <span>Não informado</span>
          )}
        </span>
      </div>

      <div className="row">
        {type === "Vet" && (
          <span className="font-14-regular">
            <strong>Espécie:</strong>
            <span>{props.patient?.specie || "-"}</span>
          </span>
        )}

        <span className="font-14-regular">
          <strong>Sexo:</strong> <span>{props.patient?.genderText || "-"}</span>
        </span>
      </div>

      <div className="row">
        {type === "Vet" && (
          <span className="font-14-regular">
            <strong>Raça:</strong>
            <span>{props.patient?.race || "-"}</span>
          </span>
        )}

        <span className="font-14-regular">
          <strong>Idade:</strong> <span>{props.patient?.age || "-"}</span>
        </span>
      </div>

      {type === "Vet" && (
        <div className="row">
          <span className="font-14-regular">
            <strong>Pelagem:</strong>
            <span>{props.patient?.hair || "-"}</span>
          </span>

          <span className="font-14-regular">
            <strong>Chip:</strong> <span>{props.patient?.tag || "-"}</span>
          </span>
        </div>
      )}

      {props.patient?.tutor && (
        <div className="row">
          <span className="font-14-regular">
            <strong>Responsável:</strong>
            <span>{props.patient.tutor?.name || "-"}</span>
          </span>

          <span className="font-14-regular">
            <strong>CPF:</strong> <span>{props.patient?.tutor?.document || "-"}</span>
          </span>
        </div>
      )}

      <div className="row" style={{ width: "100%" }}>
        <span className="font-14-regular" style={{ display: "flex", width: "100%" }}>
          <strong>Endereço:</strong>
          <div>{props.patient?.tutor?.address || "-"}</div>
        </span>
      </div>

      <div className="attendance font-16">
        <h3>{props.service?.description}</h3>

        <div dangerouslySetInnerHTML={{ __html: props.protocol || "---" }} />
      </div>

      <footer className="font-14-regular">
        impresso em {moment().format("DD/MM/YYYY - HH:mm")} por {user.user.name}
      </footer>
    </S.PdfPatientAttendance>
  );
}
