import "reflect-metadata";

import React, { useEffect, useState } from "react";

import Head from "next/head";

import dynamic from "next/dynamic";
const InfinityForgeProviders = dynamic(
  () => import("infinity-forge").then((r) => r.InfinityForgeProviders),
  {
    ssr: false,
  }
);

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
  AuthFranchisorProvider,
  InfinityForgeInjections,
} from "@/presentation";
import { Storage } from "@/infra";
import { RemoteLoadUserDashboard } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import "moment/locale/pt-br";

import "antd/dist/antd.css";
import "@/OLD/styles/uikit.css";
import "infinity-forge/dist/infinity-forge.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState<any>(undefined);
  const [userAdmin, setUserAdmin] = useState<any>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const tokenAdmin = await container
          .get<Storage>(TypesAutomatiza.storage)
          .get("adminUser");

        const isAdmin = tokenAdmin?.value ? true : false;

        const user = await container
          .get<RemoteLoadUserDashboard>(TypesAutomatiza.RemoteLoadUserDashboard)
          .load({ admin: isAdmin });

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

        setUser(initialUserData);
        setUserAdmin(isAdmin ? initialUserData : null);
      } catch (err) {
        setUser(null);
        setUserAdmin(null);
      }
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {(user !== undefined || userAdmin !== undefined) && (
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
            styles: { Button: ButtonInfinityForge },
          }}
          theme={themes[process.env.client || "sancla"]}
        >
          <AuthFranchisorProvider initialUserAdmin={userAdmin}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <ConfigProvider locale={ptBR}>
                <AppProvider>
                  <Head>
                    <title>{process.env.clientName}</title>
                    <link
                      rel="icon"
                      href={`/images/logo/${process.env.client}.png`}
                    />

                    <link
                      rel="preconnect"
                      href="https://fonts.googleapis.com"
                    />
                    <link
                      rel="preconnect"
                      href="https://fonts.gstatic.com"
                      crossOrigin="anonymous"
                    />
           <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet"/>
                  </Head>

                  <Component {...pageProps} />

                  <GlobalStyles host={process.env.clientName} />
                </AppProvider>
              </ConfigProvider>
            </LocalizationProvider>
          </AuthFranchisorProvider>
        </InfinityForgeProviders>
      )}
    </QueryClientProvider>
  );
}
