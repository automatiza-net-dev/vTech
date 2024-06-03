import * as React from "react";

import {
  AppBar as MuiAppBar,
  Toolbar as MuiToolbar,
  Tooltip as MuiTooltip,
  IconButton as MuiIconButton,
} from "@mui/material";
import { Error } from "@/presentation";
import { AccountCircle as MuiAccountCircle } from "@mui/icons-material";

import { TopBarMenu, topBarMenuId } from "./menu";

import * as S from "./styles";

export default function TopBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const menuId = topBarMenuId;

  function openMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closeMenu() {
    setAnchorEl(null);
  }

  function onOpenClose(event: React.MouseEvent<HTMLElement>) {
    if (Boolean(anchorEl)) {
      closeMenu();
    } else {
      openMenu(event);
    }
  }

  return (
    <Error name="top-bar">
      <S.TopBar>
        <div></div>

        <div>
          <MuiAppBar position="static" color="inherit" className="appBar">
            <MuiToolbar>
              <div>
                <MuiTooltip title="Meu perfil">
                  <MuiIconButton
                    size="large"
                    edge="end"
                    aria-label="Perfil"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={onOpenClose}
                    color="primary"
                    className="buttonIcon"
                  >
                    <MuiAccountCircle fontSize="large" />
                  </MuiIconButton>
                </MuiTooltip>
              </div>
            </MuiToolbar>
          </MuiAppBar>

          <TopBarMenu anchorEl={anchorEl} open={open} closeMenu={closeMenu} />
        </div>
      </S.TopBar>
    </Error>
  );
}
