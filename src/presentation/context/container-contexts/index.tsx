import React from "react";
import dynamic from "next/dynamic";
const InfinityForgeProviders = dynamic(
  () => import("infinity-forge").then((r) => r.InfinityForgeProviders),
  {
    ssr: false,
  }
);

import { InfinityForgeInjections } from "./infinity-forge-injections";

import { themes } from "./themes";
import { AuthFranchisorProvider } from "../auth-franchisor";
import { HistoryProvider, LoaderOnRouteChange } from "../ui";
import { SignIn } from "@/OLD/components/Authentication/SignIn";

import * as S from "./styles/button";

export function ContainerAutomatizaLibProviders({
  user,
  toast,
  children,
  userAdmin,
}: {
  toast: any;
  user?: any;
  userAdmin?: any;
  children: React.ReactNode;
}) {
  return (
    <InfinityForgeProviders
      auth={{
        initialUser: user,
        interceptor: {
          disableInterceptor: true,
        },
        onSignOut: () => console.log("SignOut"),
        signInConfig: { Componnent: SignIn },
      }}
      InjectedRemotes={InfinityForgeInjections}
      Configurations={{
        notification: false,
        chat: false,
        styles: { Button: S.Button as any },
      }}
      toast={toast}
      theme={themes[process.env.client || "sancla"]}
    >
      <AuthFranchisorProvider initialUserAdmin={userAdmin}>
        <HistoryProvider>
          <LoaderOnRouteChange>{children}</LoaderOnRouteChange>
        </HistoryProvider>
      </AuthFranchisorProvider>
    </InfinityForgeProviders>
  );
}
