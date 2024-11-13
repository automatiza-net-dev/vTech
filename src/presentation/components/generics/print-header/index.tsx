import React from "react";

import { useMe } from "@/presentation";

import masks from "@/OLD/utils/masks";

import * as S from './styles';

export function PrintHeader() {
  const unit = useMe()?.data?.unit;

  return (
    <S.PrintHeader>
      <div>
        <img src={`/images/logo/${process.env.client}.png`} width="100" />
      </div>
      <div>
        <p>{unit?.fantasy_name}</p>
        <p>
          {unit?.address}
          {unit?.complement ? `\n-\n${unit?.complement}` : ""}
        </p>
        <p>
          {unit?.district},&nbsp;{unit?.city},&nbsp;{unit?.state?.toUpperCase()}
        </p>
        <p>
          {unit?.phone && masks.phone(unit?.phone)}
        </p>
      </div>
    </S.PrintHeader>
  );
}
