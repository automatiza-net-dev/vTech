// @ts-nocheck
import moment from "moment";

import { Container } from "./styles";
import { useQuery } from "react-query";
import { financesService } from "@/OLD/services/finances.service";

const CardConferenceCashiers = () => {
  const { data } = useQuery({
    queryKey: ["card", "cashiers", "conference"],
    queryFn: () =>
      financesService.getResumeClosedCashiers().then((res) => res.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <Container>
      <h4>Caixas Diários para Conferência</h4>
      {data?.length === 0 && <p>Nenhum caixa diário em conferência</p>}
      <ul>
        {data?.map((elem) => (
          <li key={elem.tag}>
            <strong>Data de Abertura:</strong>{" "}
            {moment(elem.openingDate).format("DD/MM/YYYY HH:mm")}
            <br />
            <strong>Data de Fechamento:</strong>{" "}
            {moment(elem.closingDate).format("DD/MM/YYYY HH:mm")}
            <br />
            <strong>Usuário:</strong> {elem.userWhoClosed.name}
            <br />
            <strong>Código Caixa:</strong> {elem.tag}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default CardConferenceCashiers;
