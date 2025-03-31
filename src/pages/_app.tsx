import "reflect-metadata";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";

import {
  api,
  BadRequestError,
  InfinityForgeProviders,
  useAuthAdmin,
  useQuery,
  queryStore,
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
  Forbidden,
  SignInAdmin,
  NotificationsModal,
  LoaderOnRouteChange,
  ButtonInfinityForge,
  SchedulingContextProvider,
  ConfigurationsSystemProvider,
  ConfigurationSystem,
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

const queryStoreClient = queryStore();

export default function App({ Component, pageProps }) {
  const [menus, setMenus] = useState<any>(null);

  const router = useRouter();

  const { configurations } = useConfigurationsSystemConfigurations();


  if (!configurations) {
    return <></>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigurationsSystemProvider configurations={configurations}>
        <InfinityForgeProviders
          queryClient={queryStoreClient}
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
              menu: menus || ({ items: [] } as any),
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
          theme={{
            black: "#000",
            red: "#ef1717",
            green: "#39b15d",
            orange: "#f18805",
            yellow: "#e1b400",
            secondaryColor: "red",
            darkColor: "#2B2B2B",
            primaryColor: configurations.primary_color,
          }}
        >
          <NotificationsModal />

          <GlobalStyles host={configurations.name} />

          <SchedulingContextProvider>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <ConfigProvider locale={ptBR}>
                <AppProvider>
                  <PermissionsProvider>
                    <Head>
                      <title>{configurations.name}</title>
                    </Head>

                    <GambiarraTemporaria setMenus={setMenus} />

                    <Component {...pageProps} />
                  </PermissionsProvider>
                </AppProvider>
              </ConfigProvider>
            </LocalizationProvider>
          </SchedulingContextProvider>
        </InfinityForgeProviders>
      </ConfigurationsSystemProvider>
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

function useConfigurationsSystemConfigurations() {
  const [configurations, setConfigurations] = useState<ConfigurationSystem | null>(null);

  const ref = useRef(0);

  useEffect(() => {
    if (ref.current === 0) {
      ref.current = 1;
      (async () => {
        const systemUrl = new URL(window.location.origin).origin;

        setTimeout(async () => {
          // const response = await api(
          //   {
          //     url: `systems/identification?url=${systemUrl}`,
          //     method: "post",
          //   },
          // );

          setConfigurations({
            "id": 2,
            "name": "LiftOne",
            "type": "Clinicas",
            "colors": "#4BC0C0,#FFCD56,#FFA740,#925BE3,#F06297,#00B7CC,#00C7DE,#00D3EB,#00DEF7,#00E5FF,red,blue,green,yellow,purple",
            "url": "http://localhost:3059",
            "primary_color": "#005862",
            "secondary_color": "",
            "home_image_url": "https://automatiza-cdn.s3.sa-east-1.amazonaws.com/home/liftone.png",
            "logo_url": "/assets/logo-liftone.png"
        });
        }, 1000);
      })();
    }
  }, []);

  return { configurations };
}
