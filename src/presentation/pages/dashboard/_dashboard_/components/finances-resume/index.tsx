import { FinancesResume } from "@/domain";
import { useLoadFinancesResume } from "@/presentation";

import * as S from "./styles";

export function FinancesResumeCards() {
  const {data} = useLoadFinancesResume();

  return (
    <S.FinancesResume>
      <h2>
        <strong>Financeiro</strong>
      </h2>
      <div>
        {data?.map((item, i) => (
          <section key={i}>
            <div className="title-header">
              <h4>
                <strong>{item.title}</strong>
              </h4>
              <strong>total: {item.total}</strong>
            </div>
            {item?.data?.map((item, i) => (
              <div key={i} className="desc-items">
                <span>| {item.description}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </section>
        ))}
      </div>
    </S.FinancesResume>
  );
}
