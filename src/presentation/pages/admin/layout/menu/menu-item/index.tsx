import { useState } from "react";
import Link from "next/link";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { IMenuItem } from "../interfaces";

import * as S from "./styles";

export function MenuItem({ item }: { item: IMenuItem }) {
  const [submenus, setSubmenus] = useState(false);

  function toggleSubMenus() {
    setSubmenus((s) => !s);
  }

  if (item.submenus || !item.url) {
    return (
      <S.MenuItem>
        <button type="button" onClick={toggleSubMenus} className="principal">
          <div>
            {item.icon}
            <span>{item.text}</span>
          </div>

          <div className={`arrow ${submenus ? "active" : ""}`}>
            <ArrowForwardIosIcon />
          </div>
        </button>

        <div className={`submenus ${submenus ? "active" : ""}`}>
          {item.submenus?.map((submenu) => {
            return (
              <div key={submenu.text + submenu.url}>
                <Link href={submenu.url}>{submenu.text}</Link>
              </div>
            );
          })}
        </div>
      </S.MenuItem>
    );
  }

  return (
    <S.MenuItem>
      <Link href={item.url} className="principal">
        <div>
          {item.icon}
          <span>{item.text}</span>
        </div>
      </Link>
    </S.MenuItem>
  );
}
