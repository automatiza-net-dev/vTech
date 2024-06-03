import TopBar from "./top-bar";
import { SideBar } from "./menu";
import { Breadcrumb, GoBackRoute, Error } from "@/presentation";

import { ILayoutProps } from "./interfaces";

import * as S from "./styles";

export function LayoutAdmin({
  children,
  back,
  disableBreadcrumb,
}: ILayoutProps) {
  return (
    <Error name="layout-admin">
      <S.Layout>
        <SideBar />

        <div className="content">
          <TopBar />
          {back && (
            <div className="goBack">
              <GoBackRoute />
            </div>
          )}

          <div className="page">
            {!disableBreadcrumb && <Breadcrumb />}

            {children}
          </div>
        </div>
      </S.Layout>
    </Error>
  );
}
