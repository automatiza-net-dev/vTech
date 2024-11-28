import React from "react";

import { Error } from "infinity-forge";

import * as S from "./styles";

export function PrecoCard(props) {
  return (
    <Error name="PrecoCard">
      <S.PrecoCard>
        {props?.items?.length > 0 &&
          props?.items?.map((subItem) => (
            <div key={subItem?.description} className="subitem-box">
              <div>
                <h3 className="poppins-semibold">
                  <strong>
                    {subItem?.description === "Tendencia"
                      ? `${subItem?.percentage} - ${subItem?.value}`
                      : subItem?.value}
                  </strong>
                </h3>

                <p>{subItem.description}</p>
              </div>
              {subItem?.color && (
                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: subItem?.color,
                    borderRadius: '50px'
                  }}
                ></div>
              )}
            </div>
          ))}
      </S.PrecoCard>
    </Error>
  );
}
