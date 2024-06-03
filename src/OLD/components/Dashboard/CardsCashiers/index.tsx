import CardOpenCashiers from "../../mini-components/CardOpenCashiers";
import CardConferenceCashiers from "../../mini-components/CardConferenceCashiers";
import CardRevisionCashiers from "../../mini-components/CardRevisionCashiers";
import CardOpenCashiersToDay from "../../mini-components/CardOpenCashiersToDay";

import { Container } from "./styles";

const CardsCashiers = () => {
  return (
    <Container>
      <h4>Caixas Diários</h4>
      <div className="cards">
        <CardOpenCashiers />
        <CardConferenceCashiers />
        <CardRevisionCashiers />
        <CardOpenCashiersToDay />
      </div>
    </Container>
  );
};

export default CardsCashiers;
