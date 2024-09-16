import CardTitleToPay from "@/OLD/components/mini-components/CardTitleToPay";
import CardTitleToReceive from "@/OLD/components/mini-components/CardTitleToReceive";

import CardFinancialAnalyze from "@/OLD/components/mini-components/CardFinancialAnalyze";

import { Container } from "./styles";

const CardsFinances = () => {
  return (
    <Container>
      <h4>Financeiro</h4>
      <div className="cards">
        <CardTitleToPay />
        <CardTitleToReceive />
        <CardFinancialAnalyze />
      </div>
    </Container>
  );
};

export default CardsFinances;
