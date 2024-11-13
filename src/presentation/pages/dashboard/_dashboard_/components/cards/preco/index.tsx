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
              {subItem?.icone && (
                <div
                  style={{ width: "50px" }}
                  className="icon-container"
                  dangerouslySetInnerHTML={{
                    __html: subItem?.icone,
                  }}
                ></div>
              )}
            </div>
          ))}
      </S.PrecoCard>
    </Error>
  );
}
