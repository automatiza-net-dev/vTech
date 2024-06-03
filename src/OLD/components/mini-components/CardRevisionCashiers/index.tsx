// @ts-nocheck
import moment from "moment";
import { Container } from "./styles";
import { financesService } from "@/OLD/services/finances.service";
import { useQuery } from "react-query";

const DailyCashierRevisaoCard = () => {
  const { data } = useQuery({
    queryKey: ["card", "cashiers", "revised"],
    queryFn: () =>
      financesService.getResumeRevisedCashiers().then((res) => res.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <Container>
      <h4>Caixas Diários em Revisão</h4>
      {data?.length === 0 && <p>Nenhum caixa diário em revisão</p>}
      <ul>
        {data?.map((elem) => (
          <li key={elem.tag}>
            <strong>Data de Abertura:</strong>{" "}
            {moment(elem.openingDate).format("DD/MM/YYYY HH:mm")}
            <br />
            <strong>Data de Fechamento:</strong>{" "}
            {moment(elem.revisionDate).format("DD/MM/YYYY HH:mm")}
            <br />
            <strong>Usuário:</strong> {elem.userWhoRevised.name}
            <br />
            <strong>Código Caixa:</strong> {elem.tag}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default DailyCashierRevisaoCard;
