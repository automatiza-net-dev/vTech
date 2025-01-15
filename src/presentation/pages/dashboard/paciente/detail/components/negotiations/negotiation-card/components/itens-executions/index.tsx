import { Error } from "infinity-forge";
import * as S from "./styles";
import moment from "moment";

// Função para formatar datas e horários
const formatDate = (date: string | null, prefix: string) => {
  return date
    ? `${prefix} ${moment(date).format("DD/MM/YYYY [às] HH:mm")}`
    : null;
};

export function ItemsExecutions({ execution }) {
  if (!execution) return null;

  const { status, execution_date, schedule_date, productivitItem } = execution;

  const executionDate = formatDate(execution_date, "Executado dia");
  const scheduleDate = formatDate(schedule_date, "Agendado para");

  return (
    <S.ItemsExecutions>
      <div>
        <span className="title font-14-regular">
          {productivitItem?.description || "Sem descrição"}
        </span>
      </div>
      <div>
        <span className="font-14-regular">
          {execution?.schedule_date
            ? `${moment(execution?.schedule_date, "YYYY-MM-DD[T]HH:mm:ss").format("DD/MM/YYYY - HH:mm")}h`
            : "Não agendado"}
        </span>
      </div>
      <div style={{ textAlign: "right", paddingRight: "10px" }}>
        <span className="font-14-regular">
          {execution?.execution_date ? (
            <>
              Executado por {execution?.user?.name} em
              {moment(execution?.execution_date).format(
                "DD/MM/YYYY - HH:mm"
              )}h{" "}
            </>
          ) : (
            "Não executado"
          )}
        </span>
      </div>
    </S.ItemsExecutions>
  );
}
