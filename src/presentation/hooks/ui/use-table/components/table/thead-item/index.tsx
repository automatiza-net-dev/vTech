import { useState } from "react";
import { useRouter } from "next/router";

import { updateRoute } from "@/presentation";

import { Error } from "@/presentation";

import { ITHeadItemProps } from "./interfaces";

import * as S from "./styles";

export function THeadItem({
  colunm,
  index,
  disableOrdenationTable,
}: ITHeadItemProps) {
  const router = useRouter();

  const isAtualOrd = !!(router.query?.ordIndex === String(index));
  const ascIsActive = !!(router.query?.asc === "true");

  const [asc, setAsc] = useState(!!(isAtualOrd && ascIsActive));

  function handleOrd(ascValue: boolean) {
    if(disableOrdenationTable) {
      return;
    }

    updateRoute({ params: { ordIndex: index, asc: ascValue }, router });

    setAsc(ascValue);
  }

  return (
    <Error name="thead-item">
      <th key={colunm.id + index} style={{ width: colunm.width + "px" }}>
        <S.THeadItem style={{ width: colunm.width + "px"}}>
          <span onClick={() => handleOrd(!asc)}>{colunm.label}</span>

          {!disableOrdenationTable && (
            <div className="ord-actions">
              <button
                type="button"
                onClick={() => handleOrd(false)}
                className={isAtualOrd && !ascIsActive ? "active" : ""}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleOrd(true)}
                className={isAtualOrd && ascIsActive ? "active" : ""}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                </svg>
              </button>
            </div>
          )}
        </S.THeadItem>
      </th>
    </Error>
  );
}
