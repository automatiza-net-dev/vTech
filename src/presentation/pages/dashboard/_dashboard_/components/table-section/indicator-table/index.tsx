import { Error, LoaderCircle, useAuthAdmin, UserAdmin } from "infinity-forge";

import { useLoadIndicators } from "@/presentation/hooks";

import { Indicator } from "@/domain";

import { CommercialIndicatorAvaliationTable } from "./commercial-indicator-avaliation-table";
import { CommercialIndicatorAccomplishedTable } from "./commercial-indicator-accomplished-table";

import * as S from "./styles";

export function IndicatorTable({ indicator }) {
  const { user } = useAuthAdmin();

  /* const { indicators, isLoading } = useLoadIndicators(user?.unit?.id);
  if (isLoading) {
    return <LoaderCircle size={30} color="#444" />;
  }
    */

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
