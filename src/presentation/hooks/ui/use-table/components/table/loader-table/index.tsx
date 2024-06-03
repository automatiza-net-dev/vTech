import { Error } from "infinity-forge";
import { CircularProgress as MuiCircularProgress } from "@mui/material";

import * as S from "./styles";

export function LoaderTable() {
  return (
    <Error name="loaderTable">
      <S.LoaderTable>
        <MuiCircularProgress size={35} color="info" />
      </S.LoaderTable>
    </Error>
  );
}
