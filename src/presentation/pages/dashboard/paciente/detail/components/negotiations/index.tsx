import { useState } from "react";

import { Negotiation } from "@/domain";
import { useLoadOpenNegotiations } from "@/presentation";

import { NegotiationCard } from "./negotiation-card";

import * as S from "./styles";

export function Negotiations() {
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);

  const { data, isFetching } = useLoadOpenNegotiations();

  return (
    <S.Negotiations>
      <div className="list">
        {data &&
          data.map((item) => (
            <NegotiationCard
              key={item.id}
              isFetching={isFetching}
              negotiation={negotiation}
              setNegotiation={setNegotiation}
              {...item}
            />
          ))}
      </div>
    </S.Negotiations>
  );
}
