import { Error, LoaderCircle, useAuthAdmin, UserAdmin } from "infinity-forge";

import { useLoadIndicators } from "@/presentation/hooks";

import { Indicator } from "@/domain";

import { CommercialIndicatorAvaliationTable } from "./commercial-indicator-avaliation-table";
import { CommercialIndicatorAccomplishedTable } from "./commercial-indicator-accomplished-table";

import * as S from "./styles";

export function IndicatorTable({ indicator }) {
  const { GetUser } = useAuthAdmin();
  const user: UserAdmin & {
    unit: {
      id: string;
    };
  } = GetUser();

  /* const { indicators, isLoading } = useLoadIndicators(user?.unit?.id);

  if (isLoading) {
    return <LoaderCircle size={30} color="#444" />;
  }
    */

  {console.log(indicator, "<<<")}

  return (
    <S.IndicatorTable>
      <h2>{indicator?.description}</h2>

      <div className="tables">
        <CommercialIndicatorAccomplishedTable {...indicator} />

        <CommercialIndicatorAvaliationTable {...indicator} />
      </div>
    </S.IndicatorTable>
  );
}
