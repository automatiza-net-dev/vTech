import { Error } from "infinity-forge";

import MuiTypography from "@mui/material/Typography";
import MuiErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { IScreenNotFoundProps } from "./interfaces";

import * as S from "./styles";

export function ScreenNotFound({ text }: IScreenNotFoundProps) {
  return (
    <Error name="ErrorScreenNotFound">
      <S.ScreenNotFound>
        <MuiErrorOutlineIcon color="error" fontSize={"medium"} />

        <MuiTypography fontSize={20}> {text}</MuiTypography>
      </S.ScreenNotFound>
    </Error>
  );
}
