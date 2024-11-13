import { useProfile } from "@/OLD/hooks/useProfile";

import { Container, RowBox } from "./styles";
import { PrintHeader } from "@/presentation";

import moment from "moment";
import masks from "@/OLD/utils/masks";

const PrintTable = ({ data, date }) => {
  const { clinic, user } = useProfile();

  const events: any[] = [];

  data?.map((userData) =>
    userData?.events?.map((item) => {
      if (
        item?.type === "schedule" &&
        item?.event?.serviceStatus?.description !== "Atendimento cancelado"
      ) {
        events?.push({
          ...item,
          name: userData?.name
        });
      }
    })
  );

  events.sort((a, b) => moment(a.start).diff(moment(b.start)));

  return (
    <Container >
      <div className="clinic-header">
        <PrintHeader />
        {date && <h4 className="uk-text-center">Agendamento do dia {date}</h4>}
        <div className="header-table">
          <div className="small-width">Data</div>
          <div className="small-width">Hora</div>
          <div className="small-width">Duração</div>
          <div>Profissional</div>
          <div>{process.env.client !== "liftone" ? "Tutor" : "Paciente"}</div>
          {process.env.client !== "liftone" && <div>Paciente</div>}
          <div>Agendamento</div>
          <div>Status</div>
          <div className="observation-field">Obs/Queixa</div>
        </div>
      </div>

      <div className="">
        {events.map((event) => {
          if (event?.type === "schedule") {
            return (
              <RowBox>
                <div className="content-table">
                  <div className="small-width">
                    {moment(event?.start, "YYYY-MM-DD[T]HH:mm:ss").format(
                      "DD/MM/YYYY"
                    )}
                  </div>
                  <div className="small-width">
                    {moment(event?.start, "YYYY-MM-DD[T]HH:mm:ss").format(
                      "HH:mm"
                    )}
                  </div>
                  <div className="small-width">
                    {moment(event?.end).diff(moment(event?.start), "minutes") +
                      1}{" "}
                    Min
                  </div>
                  <div>{event?.name}</div>
                  {process.env.client !== "liftone" ? (
                    <div>
                      {event?.event?.holder?.name}
                      <br />
                      {event?.event?.holder?.tutor?.cellphone &&
                        masks?.phone(event?.event?.holder?.tutor?.cellphone)}
                    </div>
                  ) : (
                    <div>
                      {event?.event?.patient?.name}
                      <br />
                      {event?.event?.patient?.cellphone &&
                        masks?.phone(event?.event?.patient?.cellphone)}
                    </div>
                  )}
                  {process.env.client !== "liftone" && (
                    <div>{event?.event?.patient?.name}</div>
                  )}
                  <div>{event?.event?.serviceType?.description}</div>
                  <div>{event?.event?.serviceStatus?.description}</div>
                  <div className="observation-field">
                    {event?.event?.major_complaint}{" "}
                    {event?.event?.observation &&
                      ` - ${event?.event?.observation}`}
                  </div>
                </div>
              </RowBox>
            );
          }
        })}
      </div>

      <footer>
        {moment().format("DD/MM/YYYY - HH:mm")} - {user?.name}
      </footer>
    </Container>
  );
};

export default PrintTable;
