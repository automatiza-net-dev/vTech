import { Error, LoaderCircle, useAuthAdmin, UserAdmin } from "infinity-forge";

import { useLoadIndicators } from "@/presentation/hooks";

import { CommercialIndicatorAvaliationTable } from "./commercial-indicator-avaliation-table";
import { CommercialIndicatorAccomplishedTable } from "./commercial-indicator-accomplished-table";

import * as S from "./styles";

export function IndicatorTable() {
  const { GetUser } = useAuthAdmin();
  const user: UserAdmin & {
    unit: {
      id: string;
    };
  } = GetUser();

  const { indicators, isLoading } = useLoadIndicators(user?.unit?.id);

  if (isLoading) {
    return <LoaderCircle size={30} color="#444" />;
  }

  return (
    <S.IndicatorTable>
      <h2>{indicators?.description}</h2>

      <div className="tables">
        <CommercialIndicatorAccomplishedTable {...indicators} />

        <CommercialIndicatorAvaliationTable {...indicators} />
      </div>
    </S.IndicatorTable>
  );
}
