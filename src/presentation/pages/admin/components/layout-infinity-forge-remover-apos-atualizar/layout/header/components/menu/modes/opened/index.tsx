import styled from "styled-components";

import {
  Error,
  useElementId,
  useWindow,
  useMenu,
} from "infinity-forge";

import * as S from "./styles";
import { MenuItem } from "../../components";

export function OpenedMenu() {
  const window = useWindow();
  const header = useElementId({ id: "header" });
  const { openMenu, setOpenMenu } = useMenu();

  const isMobile = window?.innerWidth <= 1024;

  return (
    <Error name="OpenedMenu">
      {openMenu && isMobile && <Overlay onClick={() => setOpenMenu?.(false)} />}

      <S.OpenedMenu
        className={isMobile && openMenu ? "open" : ""}
        style={{
          height: `calc(100dvh - ${(header?.offsetHeight || 0) + 30}px)`,
        }}
      >
        {[
          {
            id: 1,
            title: "Dashboard",
            url: "/admin",
            route: "/admin",
          },
          {
            id: 2,
            title: "Colaboradores",
            url: "/admin/colaboradores",
            route: "/admin/colaboradores",
          },
          {
            id: 3,
            title: "Controles de acesso",
            url: "/admin/controles-de-acesso",
            route: "/admin/controles-de-acesso",
          },
        ]?.map((item, index) => (
          <ul key={item.id + index}>
            <MenuItem
              key={"menu-item" + index + item.title}
              item={item}
              index={index}
            />
          </ul>
        ))}
      </S.OpenedMenu>
    </Error>
  );
}

export const Overlay = styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 7;
`;
