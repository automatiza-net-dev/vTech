import { Error, PrivatePage } from "infinity-forge";

import { useRouter } from "next/router";

import { RemoteBusinessUnits } from "@/data";
import { container, TypesAutomatiza } from "@/container";
import {
  DictionaryQueryProvider,
  useConfigurationsSystem,
  useLoadAllAvailableUnits,
} from "@/presentation";

import { Layout } from "./layout-infinity-forge-remover-apos-atualizar/layout";

import * as S from "./styles";

export function LayoutAdmin({ children }) {
  return (
    <PrivatePage signInRole="controller" roles={["controller", "system"]}>
      <DictionaryQueryProvider>
        <LayoutPage>{children}</LayoutPage>
      </DictionaryQueryProvider>
    </PrivatePage>
  );
}

function LayoutPage({ children }) {
  const { logo_url } = useConfigurationsSystem();
  const avaiableUnits = useLoadAllAvailableUnits?.();

  const router = useRouter();

  const workspaces = {
    list: avaiableUnits?.data?.map((companie) => ({
      img: "",
      label: companie.identification,
      subtitle: companie.group,
      value: companie.id,
    })),
    onChangeWorkSpace: async (value: any) => {
      await container
        .get<RemoteBusinessUnits>(TypesAutomatiza.RemoteBusinessUnits)
        .swap({ unitId: value?.workspace, dashboard: true });

      router.push({
        pathname: "/dashboard",
        query: { reload: "true" },
      });
    },
  };

  return (
    <Error name="LayoutDashboard">
      <S.Layout>
        <Layout
          logo={{
            src: logo_url,
            href: "/dashboard",
          }}
          workspaces={workspaces as any}
        >
          {children}
        </Layout>
      </S.Layout>
    </Error>
  );
}
