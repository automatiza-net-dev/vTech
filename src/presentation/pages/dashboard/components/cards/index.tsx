import { Dashboard } from "@/domain";
import { FiltersDashboard } from "../filters-dashboard";
import { CardRenderingControl } from "./card-rendering-control";

import * as S from "./styles";

export function Cards({ cards }: Partial<Dashboard>) {
  return (
    <S.Cards>
      <FiltersDashboard />
      {cards?.map((item) => (
        <CardRenderingControl key={item.name} {...item} />
      ))}
    </S.Cards>
  );
}
