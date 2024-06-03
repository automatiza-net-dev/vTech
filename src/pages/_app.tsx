import "reflect-metadata";

import React, { useEffect, useState } from "react";

import Head from "next/head";

import { ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
import { ToastContainer, toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { AppProvider } from "@/OLD/context/appContext";
import nookies from "nookies";
import "moment/locale/pt-br";
import "@/OLD/styles/uikit.css";

const client = new QueryClient();

import { ContainerAutomatizaLibProviders } from "..";

import GlobalStyles from "@/OLD/styles/global";

import "antd/dist/antd.css";
import "@/OLD/styles/uikit.css";
import "@/presentation/styles/reset.css";

import "semantic-ui-css/semantic.min.css";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Error } from "infinity-forge";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState<any>(undefined);
  const [userAdmin, setUserAdmin] = useState<any>(undefined)

  useEffect(() => {

    (async () => {
      try {
        const { token: token, adminUser: adminUserToken } = nookies.get();

        if (adminUserToken) {
          const parsedUserAdmin = JSON.parse(adminUserToken);

          if (parsedUserAdmin && parsedUserAdmin?.value) {
            console.log("process.env.NEXT_PUBLIC_API", process.env.NEXT_PUBLIC_API)
            const { data } = await axios.get(process.env.NEXT_PUBLIC_API + "/auth/me", {
              headers: { Authorization: `Bearer ${parsedUserAdmin?.value}` },
            });

            const UserAdminInfinityForgeRequirment = {
              avatar: data.user?.profile_picture || "",
              emailAddress: data?.user?.email || "",
              firstName: data?.user?.name || "",
              id: (data as any).user.id || "",
              imagem: data.user?.profile_picture,
              isExternal: false,
              lastName: "",
            };

            setUserAdmin({ ...data, ...UserAdminInfinityForgeRequirment })

            setUser({ ...data, ...UserAdminInfinityForgeRequirment });

            return;
          }
        }

        if (token) {
          const parsedToken = JSON.parse(token);

          if (parsedToken?.value) {
            const { data } = await axios.get(process.env.NEXT_PUBLIC_API + "/auth/me", {
              headers: { Authorization: `Bearer ${parsedToken.value}` },
            });

            const UserAdminInfinityForgeRequirment = {
              avatar: data.user?.profile_picture || "",
              emailAddress: data?.user?.email || "",
              firstName: data?.user?.name || "",
              id: (data as any).user.id || "",
              imagem: data.user?.profile_picture,
              isExternal: false,
              lastName: "",
            };

            setUser({ ...data, ...UserAdminInfinityForgeRequirment });
            setUserAdmin(null);
            return;
          }

          setUser(null);
          setUserAdmin(null);
          return;
        }


        setUser(null);
        setUserAdmin(null);
      } catch (err) {
        console.log(err, "error_ssr")

        setUser(null);
        setUserAdmin(null);
      }
    })()
  }, [])

  return (
    <QueryClientProvider client={client}>
      {(user !== undefined || userAdmin !== undefined) && <ContainerAutomatizaLibProviders toast={toast} user={user} userAdmin={userAdmin}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ConfigProvider locale={ptBR}>
            <AppProvider>
              <Head>
                <title>{process.env.clientName}</title>
              </Head>

              <ToastContainer />
              <Error name="page_error">
                <Component {...pageProps} />
              </Error>

              <GlobalStyles host={process.env.clientName} />
            </AppProvider>
          </ConfigProvider>
        </LocalizationProvider>
      </ContainerAutomatizaLibProviders>}
    </QueryClientProvider>
  );
}
