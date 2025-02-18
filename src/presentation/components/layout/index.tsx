import { useRouter } from "next/router";

import {
  Error,
  Layout,
  PrivatePage,
  useAuthAdmin,
} from "infinity-forge";

import {
  logo,
  DictionaryQueryProvider,
  useLoadAllAvailableUnits,
} from "@/presentation";
import { RemoteBusinessUnits } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import * as S from "./styles";

export function LayoutDashboard({ children }) {
  return (
    <PrivatePage signInRole="user" roles={["user", "controller", "system"]}>
      <DictionaryQueryProvider>
        <LayoutPage>{children}</LayoutPage>
      </DictionaryQueryProvider>
    </PrivatePage>
  );
}

function LayoutPage({ children }) {
  const router = useRouter();
  const avaiableUnits = useLoadAllAvailableUnits?.();

  const { user, roleUser } = useAuthAdmin();

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
            src: logo,
            href: "/dashboard",
          }}
          profile={
            roleUser === "controller"
              ? {
                  menus: [
                    {
                      title: "Voltar para o portal franqueador",
                      onClick: () => router.push("/admin"),
                    },
                  ],
                }
              : undefined
          }
        >
          {children}
        </Layout>
      </S.Layout>
    </Error>
  );
}
