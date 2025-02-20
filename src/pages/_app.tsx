import "reflect-metadata";

import React, { useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";

import {
  BadRequestError,
  InfinityForgeProviders,
  useAuthAdmin,
  useQuery,
} from "infinity-forge";

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
  Forbidden,
  SignInAdmin,
  NotificationsModal,
  LoaderOnRouteChange,
  ButtonInfinityForge,
  SchedulingContextProvider,
} from "@/presentation";
import { RemoteLoadUserDashboard, RemoteMenu } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import "moment/locale/pt-br";

import "antd/dist/antd.css";
import "@/OLD/styles/uikit.css";
import "infinity-forge/dist/infinity-forge.css";
import Link from "next/link";
import { PermissionsProvider } from "@/presentation/context/permissions";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const [menus, setMenus] = useState<any>(null);

  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <InfinityForgeProviders
        atena={{ disableAuth: true, roles: ["aa"] } as any}
        i18n={{ roleToEditLanguage: ["aa"], disableEditMode: true } as any}
        auth={{
          ForbiddenCompoent: Forbidden,
          roles: {
            user: {
              signInConfig: { Component: SignIn },
              onSignOut: (user: any) => {
                queryClient.clear();
                queryClient.removeQueries();

                router.push("/");

                if (user?.isThirdParty) {
                  window.location.href =
                    "https://portal.liftonefranquias.com.br/";
                }
              },
            },
            controller: {
              signInConfig: {
                Component: SignInAdmin,
              },
              onSignOut: () => {
                queryClient.clear();
                queryClient.removeQueries();

                router.push("/");
              },
            },
          },
        }}
        loaderOnRouteChange={{ Component: LoaderOnRouteChange } as any}
        InjectedRemotes={{
          menu: {
            menu: menus || { items: [] } as any,
          } as any,
          user: {
            getRole: async () => {
              try {
                const user = await container
                  .get<RemoteLoadUserDashboard>(
                    TypesAutomatiza.RemoteLoadUserDashboard
                  )
                  .load({});

                if (!user?.user) {
                  throw new BadRequestError({
                    message: "Usuário com erro",
                    code: "400",
                  });
                }

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

             

                return {
                  role: initialUserData?.user?.type,
                  user: initialUserData,
                };
              } catch (err) {
                return { role: "", user: null };
              }
            },
          },
          controller: {
            getRole: async () => {
              try {
                const user = await container
                  .get<RemoteLoadUserDashboard>(
                    TypesAutomatiza.RemoteLoadUserDashboard
                  )
                  .load({});

                if (!user?.user) {
                  throw new BadRequestError({
                    message: "Usuário com erro",
                    code: "400",
                  });
                }

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

                return {
                  role: initialUserData?.user?.type,
                  user: initialUserData,
                };
              } catch (err) {
                return { role: "", user: null };
              }
            },
          },
        }}
        Configurations={{
          chat: false,
          menu: {
            mode: "CollapsedMenu",
          },
          styles: { Button: ButtonInfinityForge },
          notification: {
            enable: true,
            CustomComponent: (props) => (
              <Link href={props?.link}>
                <div className="top">
                  <h3>{props?.title}</h3> <span>{props?.createdAtText}</span>
                  <span>{props?.message}</span>
                </div>
              </Link>
            ),
          },
        }}
        theme={themes[process.env.client || "sancla"]}
      >
        <NotificationsModal />

        <GlobalStyles host={process.env.clientName} />

        <SchedulingContextProvider>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <ConfigProvider locale={ptBR}>
              <AppProvider>
                <PermissionsProvider>
                  <Head>
                    <title>{process.env.clientName}</title>
                  </Head>

                  <GambiarraTemporaria setMenus={setMenus} />

                  <Component {...pageProps} />
                </PermissionsProvider>
              </AppProvider>
            </ConfigProvider>
          </LocalizationProvider>
        </SchedulingContextProvider>
      </InfinityForgeProviders>
    </QueryClientProvider>
  );
}

function GambiarraTemporaria({ setMenus }) {
  const { roleUser } = useAuthAdmin();

  useQuery({
    queryKey: ["menus", roleUser],
    queryFn: async () => {
      return container
        .get<RemoteMenu>(TypesAutomatiza.RemoteMenuAutomatiza)
        .loadAll({});
    },
    enableCache: true,
    onSuccess: (data) => {
      setMenus(data);
    },
  });

  return <></>;
}
