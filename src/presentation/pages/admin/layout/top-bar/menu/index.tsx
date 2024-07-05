import { useState } from "react";

import {Error, useAuthAdmin} from "infinity-forge"
import { Logout as MuiLogout } from "@mui/icons-material";
import { MenuItem as MuiMenuItem } from "@mui/material";

import {
  Modal,
  useIsThirdPartyUser,
} from "@/presentation";
import { SwapForm } from "./swap-form";
import { PaperProps, StyledMenu } from "./styled-menu";

import { TopBarMenuProps } from "./interfaces";

const topBarMenuId = "app-menu-side-bar";

function TopBarMenu({ anchorEl, open, closeMenu }: TopBarMenuProps) {
  const [modal, setModal] = useState(false);

  const { signOut } = useAuthAdmin()


  const { isThirdParty } = useIsThirdPartyUser();

  function signOutUserAdmin() {
    if (isThirdParty) {
      window.location.href = "https://portal.liftonefranquias.com.br"
    } else {
      signOut({ roleUser: "admin"});
    }
  }

  return (
    <Error name="top-bar-menu">
      <div>
        <Modal setModal={setModal} stateModal={modal} maxwidth="400px">
          <SwapForm />
        </Modal>

        <StyledMenu
          id={topBarMenuId}
          MenuListProps={{
            "aria-labelledby": "app-farmacias-fapp-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={closeMenu}
          PaperProps={PaperProps}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MuiMenuItem
            onClick={() => {
              setModal(true);
              closeMenu();
            }}
            TouchRippleProps={{}}
          >
            <span>Clinicas</span>
          </MuiMenuItem>

          <MuiMenuItem onClick={signOutUserAdmin} disableRipple>
            <MuiLogout color="error" />
            <span>Sair</span>
          </MuiMenuItem>
        </StyledMenu>
      </div>
    </Error>
  );
}

export { topBarMenuId, TopBarMenu };
