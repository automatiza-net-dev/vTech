import { useLoadCashiersResume } from "@/presentation";

import * as S from "./styles";

export function CashiersResumeCards() {
  const { data } = useLoadCashiersResume();

  return (
    <S.CashiersResumeCard>
      <h2>
        <strong>Caixas Diários</strong>
      </h2>
      <div>
        {data?.map((item, i) => (
          <section key={`cashier-${i}`}>
            <h4>
              <strong>{item?.title}</strong>
            </h4>
            {item?.data &&
              item?.data.map((info, i) => (
                <div key={`sub-info-${i}`}>
                  <div
                    className="infos"
                    dangerouslySetInnerHTML={{ __html: info }}
                  ></div>
                </div>
              ))}
          </section>
        ))}
      </div>
    </S.CashiersResumeCard>
  );
}
