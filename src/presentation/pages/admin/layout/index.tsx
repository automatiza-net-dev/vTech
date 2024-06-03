import TopBar from "./top-bar";
import { SideBar } from "./menu";

import { Breadcrumb, Error } from "infinity-forge";

import { ILayoutProps } from "./interfaces";

import * as S from "./styles";

export function LayoutAdmin({
  children,
  disableBreadcrumb,
}: ILayoutProps) {
  return (
    <Error name="layout-admin">
      <S.Layout>
        <SideBar />

        <div className="content">
          <TopBar />

          <div className="page">
            {!disableBreadcrumb && <Breadcrumb />}

            {children}
          </div>
        </div>
      </S.Layout>
    </Error>
  );
}
