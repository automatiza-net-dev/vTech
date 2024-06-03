// @ts-nocheck
import { memo } from "react";

import { Card, Col, Divider, Row, Skeleton } from "antd";
import { useProfile } from "@/OLD/hooks/useProfile";
import moment from "moment";
import "moment/locale/pt-br";
import { useQuery } from "react-query";
import { calendarService } from "@/OLD/services/calendar.service";
import { Container, Paragraph, Title } from "../styles";

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
    <Container>
      <Row gutter={16}>
        {historicQuery.data?.map((item) => (
          <Col key={item.id} span={8}>
            <Card>
              <Title
                className="title-schedule"
                style={{ backgroundColor: item.status.color }}
              >
                Data:{" "}
                {moment(item.start, "YYYY-MM-DD[T]HH:mm:ss").format(
                  "DD/MM/YYYY HH:mm"
                )}
              </Title>
              <hr />
              {clinic?.unitConfig?.requires_schedule_tutor && (
                <Paragraph>Tutor: {item.tutor.name}</Paragraph>
              )}
              <Paragraph>Serviço: {item.service.description}</Paragraph>
              <Paragraph>Profissional: {item.technician.name}</Paragraph>
              <Paragraph>Observação: {item.majorComplaint ?? "-"}</Paragraph>
              <Paragraph>Status: {item.status.description}</Paragraph>

              {item.cancellation && (
                <>
                  <Divider />
                  <Paragraph>Dados cancelamento:</Paragraph>
                  <div style={{ paddingLeft: "16px" }}>
                    <Paragraph>
                      Usuário: {item.cancellation.technician.name}
                    </Paragraph>
                    <Paragraph>
                      Motivo: {item.cancellation.reason ?? "-"}
                    </Paragraph>
                    <Paragraph>
                      Observação: {item.cancellation.observation}
                    </Paragraph>
                    <Paragraph>
                      {[
                        "Data",
                        moment(item.cancellation.cancelledAt).format(
                          "DD/MM/YYYY HH:mm"
                        ),
                      ].join(": ")}
                    </Paragraph>
                  </div>
                </>
              )}

              {item.reschedules.length > 0 && (
                <>
                  <Divider />
                  <p>Dados reagendamentos:</p>
                  {item.reschedules.map((reschedule) => (
                    <div style={{ paddingLeft: "16px" }}>
                      <Paragraph>
                        Usuário: {reschedule.technician.name}
                      </Paragraph>
                      <Paragraph>
                        {[
                          "Data reagendamento",
                          moment(reschedule.cancelledAt).format(
                            "DD/MM/YYYY HH:mm"
                          ),
                        ].join(": ")}
                      </Paragraph>
                      <Paragraph>
                        {[
                          "Data original",
                          moment(reschedule.originalDate).format(
                            "DD/MM/YYYY HH:mm"
                          ),
                        ].join(": ")}
                      </Paragraph>
                      <Paragraph>Motivo: {reschedule.reason ?? "-"}</Paragraph>
                      <Paragraph>
                        Observação: {reschedule.observation}
                      </Paragraph>
                    </div>
                  ))}
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PatientHistoric;
