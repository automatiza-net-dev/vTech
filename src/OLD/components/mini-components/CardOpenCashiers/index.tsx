// @ts-nocheck
import moment from "moment";

import { Container } from "./styles";
import { useQuery } from "infinity-forge";
import { financesService } from "@/OLD/services/finances.service";

const DailyCashierCard = () => {
  const { data } = useQuery({
    queryKey: ["card", "cashiers", "open"],
    queryFn: () =>
      financesService.getResumeOpenCashiers().then((res) => res.data),
 enableCache: true
  });

  return (
    <Container>
      <h4>Caixas Diários em Aberto</h4>
      {data?.length === 0 && <p>Nenhum caixa diário em aberto</p>}
      <ul>
        {data?.map((elem) => (
          <li key={elem.tag}>
            <strong>Data de Abertura:</strong>{" "}
            {moment(elem.openingDate).format("DD/MM/YYYY HH:mm")}
            <br />
            <strong>Usuário:</strong> {elem.userWhoOpened.name}
            <br />
            <strong>Código Caixa:</strong> {elem.tag}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default DailyCashierCard;
