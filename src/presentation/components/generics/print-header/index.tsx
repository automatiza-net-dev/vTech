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
      <p style={{fontSize: 14 }}>{unit?.fantasy_name}</p>
        <p style={{fontSize: 14 }}>
          {unit?.address}
          {unit?.complement ? `\n-\n${unit?.complement}` : ""}
        </p>
        <p style={{fontSize: 14 }}>
          {unit?.district},&nbsp;{unit?.city},&nbsp;{unit?.state?.toUpperCase()}
        </p>
        <p style={{fontSize: 14 }}>
          {unit?.phone && masks.phone(unit?.phone)}
        </p>
      </div>
    </S.PrintHeader>
  );
}
