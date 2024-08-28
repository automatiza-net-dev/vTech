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
      <span className="title font-14-regular">
        {productivitItem?.description || "Sem descrição"}
      </span>
      <span>{executionDate || scheduleDate || "-"}</span>
    </S.ItemsExecutions>
  );
}
