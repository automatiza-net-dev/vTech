
import { CommercialIndicatorAvaliationTable } from "./commercial-indicator-avaliation-table";
import { CommercialIndicatorAccomplishedTable } from "./commercial-indicator-accomplished-table";

import * as S from "./styles";

export function IndicatorTable({ indicator }) {


  return (
    <S.IndicatorTable>
      <h2>{indicator?.description}</h2>

      <div className="tables">
        <CommercialIndicatorAccomplishedTable {...indicator} />

        {indicator?.name !== "billsReviewer" && (
          <CommercialIndicatorAvaliationTable {...indicator} />
        )}
      </div>
    </S.IndicatorTable>
  );
}
