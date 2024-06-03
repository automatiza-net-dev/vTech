import { BillSales } from "@/domain";

import * as S from "./styles";

export function PeriodTable(props: BillSales & { index: number }) {

  const tableData = {
    Qtd: props.qtd,
    Valor: props.value,
    "Tkt médio": props.avg,
  };

  const isFirstItemTable = props.index === 0;

  return (
    <S.PeriodTable>
      <div className="head">
        {Object.keys(tableData).map((item, index) => (
          <div key={"head" + item + index}>{isFirstItemTable && item}</div>
        ))}
      </div>

      <div className="body">
        {Object.keys(tableData).map((item, index) => (
          <div key={"body-" + item + index}>{tableData[item]}</div>
        ))}
      </div>
    </S.PeriodTable>
  );
}
