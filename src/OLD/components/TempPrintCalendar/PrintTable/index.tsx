import { useProfile } from "@/OLD/hooks/useProfile";

import { Container, RowBox } from "./styles";
import { PrintHeader, useSystem } from "@/presentation";

import moment from "moment";
import masks from "@/OLD/utils/masks";

const PrintTable = ({ data, date }) => {
  const {  user } = useProfile();

  const { unit } = useSystem()

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

  const formatDate = () => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };
  

  return (
    <Container >
      <div className="clinic-header">
        <PrintHeader />
        {date && <h4 className="uk-text-center">Agendamentos do dia {formatDate()}</h4>}
        <div className="header-table">
          <div className="small-width">Data</div>
          <div className="small-width">Hora</div>
          <div className="small-width">Duração</div>
          <div>Profissional</div>
          <div>{unit?.system?.type === "Vet" ? "Tutor" : "Paciente"}</div>
          {unit?.system?.type === "Vet" && <div>Paciente</div>}
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
                  {unit?.system?.type === "Vet" ? (
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
                  {unit?.system?.type === "Vet" && (
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
