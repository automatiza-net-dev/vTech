import "reflect-metadata";

import React from "react";

import Head from "next/head";

import { InfinityForgeProviders } from "infinity-forge";

import { ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { QueryClient, QueryClientProvider } from "react-query";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import GlobalStyles from "@/OLD/styles/global";
import { AppProvider } from "@/OLD/context/appContext";
import { SignIn } from "@/OLD/components/Authentication/SignIn";

import {
  themes,
  ButtonInfinityForge,
  InfinityForgeInjections,
  SchedulingContextProvider,
} from "@/presentation";
import { RemoteLoadUserDashboard } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import "moment/locale/pt-br";

import "antd/dist/antd.css";
import "@/OLD/styles/uikit.css";
import "infinity-forge/dist/infinity-forge.css";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <InfinityForgeProviders
        auth={{
          roles: {
            admin: {},
            user: {
              signInConfig: { Component: SignIn },
              loadUserConfig: {
                queryFn: async (): Promise<any> => {
                  try {
                    const user = await container
                      .get<RemoteLoadUserDashboard>(
                        TypesAutomatiza.RemoteLoadUserDashboard
                      )
                      .load({ admin: false });

                    const initialUserData = {
                      ...user,
                      avatar: user.user?.profile_picture || "",
                      emailAddress: user?.user?.email || "",
                      firstName: user?.user?.name || "",
                      id: (user as any)?.user?.id || "",
                      imagem: user.user?.profile_picture,
                      isExternal: false,
                      lastName: "",
                    };

                    return initialUserData;
                  } catch {
                    return null;
                  }
                },
              },
              onSignOut: (user: any) => {
                queryClient.clear();
                queryClient.removeQueries();

                if (user?.isThirdParty) {
                  window.location.href =
                    "https://portal.liftonefranquias.com.br/";
                }
              },
            },
          },
        }}
        InjectedRemotes={InfinityForgeInjections}
        Configurations={{
          chat: false,
          menu: {
            mode: "expandedMenu",
            position: "auto",
          },
          styles: { Button: ButtonInfinityForge },
          notification: {
            enable: false,
          },
        }}
        theme={themes[process.env.client || "sancla"]}
      >
        <SchedulingContextProvider>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ConfigProvider locale={ptBR}>
              <AppProvider>
                <Head>
                  <title>{process.env.clientName}</title>
                  <link
                    rel="icon"
                    href={`/images/logo/${process.env.client}.png`}
                  />

                  <link rel="preconnect" href="https://fonts.googleapis.com" />
                  <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                  />
                  <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
                    rel="stylesheet"
                  />
                </Head>

                <Component {...pageProps} />

                <GlobalStyles host={process.env.clientName} />
              </AppProvider>
            </ConfigProvider>
          </LocalizationProvider>
        </SchedulingContextProvider>
      </InfinityForgeProviders>
    </QueryClientProvider>
  );
}
