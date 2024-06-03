import { Dashboard } from "@/domain";
import { FiltersDashboard } from "../filters-dashboard";

import * as S from "./styles";

export function Cards({ cards }: Dashboard) {
  return (
    <S.Cards>
      <FiltersDashboard />

      {cards?.map((item) => (
        <div className="card-box" key={item.name}>
          {item?.items?.map((subItem) => (
            <div key={subItem?.description} className="subitem-box">
              <h3>
                <strong>
                  {subItem?.description === "Tendencia"
                    ? `${subItem?.percentage} - ${subItem?.value}`
                    : subItem?.value}
                </strong>
              </h3>
              <h4>{subItem.description}</h4>
            </div>
          ))}
        </div>
      ))}
    </S.Cards>
  );
}
