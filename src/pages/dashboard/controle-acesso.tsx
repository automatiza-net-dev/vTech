

import {  PageWrapper } from "infinity-forge";

import { AccessControlsPage, LayoutDashboard } from "@/presentation";


export default function ControlesDeAcessoPage() {

  return (
    <LayoutDashboard>
      <PageWrapper title="Controle de Acesso">
       <AccessControlsPage />
      </PageWrapper>
    </LayoutDashboard>
  );
}


