import { Period } from "@/domain";

import * as S from "./styles";

export function PeriodTable(props: Period & { index: number }) {
  const tableData = {
    Novos: props.new,
    Recorrentes: props.recurrent,
    Total: props.total,
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
