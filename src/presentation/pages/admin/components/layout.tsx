import { Error, PrivatePage, useAuthAdmin } from "infinity-forge";

import { DictionaryQueryProvider, useLoadAllAvailableUnits } from "@/presentation";
import { Layout } from "./layout-infinity-forge-remover-apos-atualizar/layout";

import * as S from "./styles";
import { container, TypesAutomatiza } from "@/container";
import { RemoteBusinessUnits } from "@/data";
import { useRouter } from "next/router";

export function LayoutAdmin({ children }) {
  return (
    <PrivatePage
      signInRole="controller"
      roles={["controller", "system"]}
    >
      <DictionaryQueryProvider>
        <LayoutPage>{children}</LayoutPage>
      </DictionaryQueryProvider>
    </PrivatePage>
  );
}

function LayoutPage({ children }) {

 const { user} = useAuthAdmin();
 const avaiableUnits = useLoadAllAvailableUnits?.();

 const router = useRouter()

  const workspaces = {
    list: avaiableUnits?.data?.map((companie) => ({
      img: "",
      label: companie.identification,
      subtitle: companie.group,
      value: companie.id,
    })),
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
          logo={{
            src:
              process.env.NEXT_PUBLIC_API +
              `/assets/logo-${process.env.client}.png`,
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
