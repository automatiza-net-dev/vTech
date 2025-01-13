import { useState } from "react";

import { Negotiation } from "@/domain";
import {
  useLoadOpenNegotiations,
  useLoadAllPatientTutor,
} from "@/presentation";

import { NegotiationCard } from "./negotiation-card";

import * as S from "./styles";

export function Negotiations() {
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);

  const { data, isFetching } = useLoadOpenNegotiations();

  const tutors = useLoadAllPatientTutor();

  return (
    <S.Negotiations>
      <div className="list">
        {data &&
          data.map((item) => (
            <NegotiationCard
              tutors={tutors?.data}
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
