import { Error, PrivatePage } from "infinity-forge";

import { DictionaryQueryProvider } from "@/presentation";
import { Layout } from "./layout-infinity-forge-remover-apos-atualizar/layout";

import * as S from "./styles";

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
        >
          {children}
        </Layout>
      </S.Layout>
    </Error>
  );
}
