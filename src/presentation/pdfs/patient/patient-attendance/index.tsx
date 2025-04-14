import moment from "moment";
import { useAuthAdmin } from "infinity-forge";

import { TimeLine } from "@/domain";
import { useConfigurationsSystem, useLoadPatient } from "@/presentation";

import * as S from "./styles";

export function PdfPatientAttendance(
  props: Partial<TimeLine["timeline_info"]>
) {
  const { user } = useAuthAdmin();
  const { data } = useLoadPatient();

  const { type } = useConfigurationsSystem();

  return (
    <S.PdfPatientAttendance>
      <div className="row">
        <span className="font-14-regular">
          <strong>
            {type === "Vet" ? "Pet:" : "Paciente:"}:
          </strong>
          <span>{data?.name || "-"}</span>
        </span>

        <span className="font-14-regular">
          <strong>Peso:</strong>
          {data?.weight ? (
            <span>
              {data?.weight || "-"} Em{" "}
              {data?.weight_date
                ? moment(data?.weight_date).format("DD/MM/YYYY")
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
            <span>{data?.specie || "-"}</span>
          </span>
        )}

        <span className="font-14-regular">
          <strong>Sexo:</strong> <span>{data?.genderText || "-"}</span>
        </span>
      </div>

      <div className="row">
        {type === "Vet" && (
          <span className="font-14-regular">
            <strong>Raça:</strong>
            <span>{data?.race || "-"}</span>
          </span>
        )}

        <span className="font-14-regular">
          <strong>Idade:</strong> <span>{data?.age || "-"}</span>
        </span>
      </div>

      {type === "Vet" && (
        <div className="row">
          <span className="font-14-regular">
            <strong>Pelagem:</strong>
            <span>{data?.hair || "-"}</span>
          </span>

          <span className="font-14-regular">
            <strong>Chip:</strong> <span>{data?.tag || "-"}</span>
          </span>
        </div>
      )}

      {data?.tutor && (
        <div className="row">
          <span className="font-14-regular">
            <strong>Responsável:</strong>
            <span>{data.tutor?.name || "-"}</span>
          </span>

          <span className="font-14-regular">
            <strong>CPF:</strong> <span>{data?.tutor?.document || "-"}</span>
          </span>
        </div>
      )}

      <div className="row" style={{ width: "100%" }}>
        <span className="font-14-regular" style={{ display: "flex", width: "100%" }}>
          <strong>Endereço:</strong>
          <div>{data?.tutor?.address || "-"}</div>
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
