import React from "react";

import { useAuthAdmin } from 'infinity-forge'

import masks from "@/OLD/utils/masks";

import * as S from './styles';
import { useConfigurationsSystem } from "@/presentation/context";

export function PrintHeader() {
  const unit = useAuthAdmin()?.user?.unit;

  const {logo_url} = useConfigurationsSystem()

  return (
    <S.PrintHeader>
      <div>
        <img src={logo_url} width="100" />
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
