// @ts-nocheck
import moment from "moment";

import { Container } from "./styles";
import { useQuery } from "react-query";
import { financesService } from "@/OLD/services/finances.service";

const CardOpenCashiersToDay = () => {
  const { data } = useQuery({
    queryKey: ["card", "cashiers", "today"],
    queryFn: () =>
      financesService.getTodaysCashierResume().then((res) => res.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <Container>
      <h4>Caixas Diários Abertos no Dia Atual</h4>
      {data?.length === 0 && <p>Nenhum caixa diário aberto hoje</p>}
      <ul>
        {data?.map((elem) => (
          <li key={elem.tag}>
            <strong>Data de Abertura:</strong>{" "}
            {moment(elem.openingDate).format("DD/MM/YYYY HH:mm")}
            <br />
            <strong>Usuário:</strong> {elem.openingUser.name}
            <br />
            <strong>Código Caixa:</strong> {elem.tag}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default CardOpenCashiersToDay;
