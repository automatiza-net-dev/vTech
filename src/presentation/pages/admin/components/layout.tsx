import { useRouter } from "next/router";

import { Error, PrivatePage, useAuthAdmin } from "infinity-forge";

import { RemoteBusinessUnits } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import {
  DictionaryQueryProvider,
  useLoadAllAvailableUnits,
} from "@/presentation";

import * as S from "./styles";
import { Layout } from "./layout-infinity-forge-remover-apos-atualizar/layout";

export function LayoutAdmin({ children }) {
  return (
    <PrivatePage signInRole="controller" roles={["controller", "system", "user"]}>
      <DictionaryQueryProvider>
        <LayoutPage>{children}</LayoutPage>
      </DictionaryQueryProvider>
    </PrivatePage>
  );
}

function LayoutPage({ children }) {
  const router = useRouter();
  const avaiableUnits = useLoadAllAvailableUnits?.();

  const { user } = useAuthAdmin();

  const workspaces = {
    list: avaiableUnits?.data?.map((companie) => ({
      img: "",
      label: companie.identification,
      subtitle: companie.group,
      value: companie.id,
    })),
    activeWorkspace: avaiableUnits?.data?.find(
      (companie) => companie?.id === user?.unit?.id
    )?.id,
    onChangeWorkSpace: async (value: any) => {
      if (
        value.workspace !==
        avaiableUnits?.data?.find((companie) => companie?.id === user?.unit?.id)
          ?.id
      ) {
        await container
          .get<RemoteBusinessUnits>(TypesAutomatiza.RemoteBusinessUnits)
          .swap({ unitId: value?.workspace, dashboard: true });

        router.push({
          pathname: "/dashboard",
          query: { reload: "true" },
        });
      }
    },
  };

  return (
    <Error name="LayoutDashboard">
      <S.Layout>
        <Layout
          workspaces={workspaces as any}
          logo={{
            src:
              process.env.NEXT_PUBLIC_API +
              `/assets/logo-${process.env.client}.png`,
            href: "/dashboard",
          }}
        >
          {children}
        </Layout>
      </S.Layout>
    </Error>
  );
}
