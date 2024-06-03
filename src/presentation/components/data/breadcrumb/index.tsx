import Link from "next/link";
import { useRouter } from "next/router";

import MuiBreadcrumbs from "@mui/material/Breadcrumbs";

import { Error } from "@/presentation";

import { IBreadcrumbProps } from "./interface";

import * as S from "./styles";

export function Breadcrumb({ links }: IBreadcrumbProps) {
  const router = useRouter();

  const routeNames = router.asPath?.split("?")[0]?.split("/");

  return (
    <Error name="breadcrumb">
      <S.Breadcrumb>
        <MuiBreadcrumbs aria-label="breadcrumb">
          {links
            ? links.map((link) => {
                if (!link.href) {
                  return (
                    <div className="link" key={link.text + "breadcrumb"}>
                      {link.icon} {link.text}
                    </div>
                  );
                }

                return (
                  <Link key={link.text + "breadcrumb"} href={link.href}>
                    {link.icon} {link.text}
                  </Link>
                );
              })
            : routeNames.map((route, index) => {
                if (!route) {
                  return null;
                }

                let nomeBreadcrumb;
                let urlBreadcrumb;

                if (index === 0) {
                  nomeBreadcrumb = route;
                  urlBreadcrumb = `/${route}`;
                } else {
                  nomeBreadcrumb =
                    route?.charAt(0)?.toUpperCase() + route.slice(1);
                  urlBreadcrumb = `${routeNames.slice(0, index + 1).join("/")}`;
                }

                return (
                  <Link key={route} href={urlBreadcrumb}>
                    {nomeBreadcrumb}
                  </Link>
                );
              })}
        </MuiBreadcrumbs>
      </S.Breadcrumb>
    </Error>
  );
}
