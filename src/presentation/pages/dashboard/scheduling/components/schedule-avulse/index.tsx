import { ScheduleUser } from "@/domain";

export function ScheduleAvulse({ scheduleUser}: { scheduleUser: ScheduleUser }) {

  return  <div >
    {scheduleUser.events.map((user) => {
      const dateString = user.start;
      const date = new Date(dateString);
      const hora = date.toLocaleTimeString("pt-BR", {
        hour12: false,
      });

      const dateStringEnd = user.end;
      const dateend = new Date(dateStringEnd);
      const horaend = dateend.toLocaleTimeString("pt-BR", {
        hour12: false,
      });

      return (
        <div
          key={user.end + user.start + user.event.id}
          style={{ backgroundColor: "rgb(238, 238, 238)", padding: 10, marginBottom: 10 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {user?.event?.holder?.name || ""} -{" "}
              {user.event.patient.name}
            </span>{" "}
            <span>
              {hora.slice(0, -3)} - {horaend.slice(0, -3)}
            </span>
          </div>

          <h3>{user.event.serviceType.description}</h3>

          <p>{user.event.major_complaint}</p>
        </div>
      );
    })}
  </div>
}