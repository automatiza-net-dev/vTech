// @ts-nocheck
import { Card, Col, Divider, Row, Skeleton } from "antd";
import { useProfile } from "@/OLD/hooks/useProfile";
import moment from "moment";
import "moment/locale/pt-br";
import { useQuery } from "react-query";
import { calendarService } from "@/OLD/services/calendar.service";

import * as S from "./styles";

export function PatientHistoric({ id }) {
  const { clinic } = useProfile();

  const historicQuery = useQuery({
    queryKey: ["patientExams", id],
    queryFn: () =>
      calendarService.getPatientHistoric(id).then((res) => res.data),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (historicQuery.isLoading) {
    return <Skeleton paragraph={{ rows: 4 }} />;
  }

  return (
    <S.PatientHistoric>
      {historicQuery.data?.map((item) => (
        <div className="item-card">
          <section>
            <span
              className="inf-tag"
              style={{ backgroundColor: item?.status?.color, color: "#fff" }}
            >
              {item.status.description}
            </span>
            <span className="inf-tag">
              Data:{" "}
              {moment(item.start, "YYYY-MM-DD[T]HH:mm:ss").format("DD/MM/YYYY")}
              &nbsp;às&nbsp;
              {moment(item.start, "YYYY-MM-DD[T]HH:mm:ss").format("HH-mm")}
            </span>
          </section>
          <div className="desc-box">
            <span>
              <strong>Serviço:&nbsp;</strong>
              {item.service.description}
            </span>
            {clinic?.unitConfig?.requires_schedule_tutor && (
              <span>
                <strong>Tutor:</strong>
                {item.tutor.name}
              </span>
            )}
            <span>
              <strong>Profissional&nbsp;:</strong> {item.technician.name}
            </span>
            <span>
              <strong>Observação:&nbsp;</strong>
              {item.majorComplaint ?? "-"}
            </span>

            {item.cancellation && (
              <>
                <span>
                  <strong>Dados cancelamento:&nbsp;</strong>
                </span>
                <div className="cancel-info">
                  <section>
                    <span>
                      <strong>Usuário:&nbsp;</strong>{" "}
                      {item.cancellation.technician.name}
                    </span>
                    <span>
                      <strong>Motivo:&nbsp;</strong>
                      {item.cancellation.reason ?? "-"}
                    </span>
                  </section>
                  <section>
                    <span>
                      <strong>Observação:&nbsp;</strong>{" "}
                      {item.cancellation.observation}
                    </span>
                    <span>
                      <strong>Data:&nbsp;</strong>
                      {moment(item.cancellation.cancelledAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </span>
                  </section>
                </div>
              </>
            )}

            {item.reschedules.length > 0 && (
              <>
                <span>Dados reagendamentos:</span>
                {item.reschedules.map((reschedule) => (
                  <div style={{ paddingLeft: "16px" }}>
                    <span>Usuário: {reschedule.technician.name}</span>
                    <span>
                      {[
                        "Data reagendamento",
                        moment(reschedule.cancelledAt).format(
                          "DD/MM/YYYY HH:mm"
                        ),
                      ].join(": ")}
                    </span>
                    <span>
                      {[
                        "Data original",
                        moment(reschedule.originalDate).format(
                          "DD/MM/YYYY HH:mm"
                        ),
                      ].join(": ")}
                    </span>
                    <span>Motivo: {reschedule.reason ?? "-"}</span>
                    <span>Observação: {reschedule.observation}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      ))}
    </S.PatientHistoric>
  );
}

export default PatientHistoric;
