import { Skeleton } from "infinity-forge";

import { Dashboard } from "@/domain";
import { FiltersDashboard } from "../filters-dashboard";
import { CardRenderingControl } from "./card-rendering-control";

import * as S from "./styles";

export function Cards({
  type,
  cards,
  isFetching,
}: Partial<Dashboard> & { isFetching: boolean, type?: "crm" | "admin"; }) {
  return (
    <div className="cards">
      <S.Cards>
        {type !== "admin" && <FiltersDashboard />}

        {cards?.map((item) => (
          <CardRenderingControl key={item.name} {...item} />
        ))}
      </S.Cards>
        
      {isFetching && (
        <div className="cards_skeleton">
          <Skeleton type="line" />
        </div>
      )}
    </div>
  );
}
