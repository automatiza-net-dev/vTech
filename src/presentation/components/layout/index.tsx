import {
  Error,
  Layout,
  useAuthAdmin,
  PrivatePageAdmin,
} from "infinity-forge";

import { User } from "@/domain";
import { RemoteBusinessUnits } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import { useLoadAllAvailableUnits } from "@/presentation";

import * as S from "./styles";

export function LayoutDashboard({ children }) {
  return (
    <PrivatePageAdmin>
      <LayoutPage>{children}</LayoutPage>
    </PrivatePageAdmin>
  );
}

function LayoutPage({ children }) {
  const { data } = useLoadAllAvailableUnits();

  const { GetUser } = useAuthAdmin();

  const user = GetUser<User>();

  const workspaces = {
    list: data?.map((companie) => ({
      img: "",
      label: companie.identification,
      subtitle: companie.group,
      value: companie.id,
    })),
    activeWorkspace: data?.find((companie) => companie?.id === user?.unit?.id)
      ?.id,
    onChangeWorkSpace: async (value: any) => {
      if (
        value.workspace !==
        data?.find((companie) => companie?.id === user?.unit?.id)?.id
      ) {
        await container
          .get<RemoteBusinessUnits>(TypesAutomatiza.RemoteBusinessUnits)
          .swap({ unitId: value?.workspace, dashboard: true });

        window.location.reload();
      }
    },
  };

  return (
    <Error name="LayoutDashboard">
      <S.Layout>
        <Layout
          sidebar={{
            expandedMenu: true
          }}
          workspaces={workspaces}
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
