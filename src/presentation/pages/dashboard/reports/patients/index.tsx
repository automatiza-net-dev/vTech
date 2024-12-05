import { PageWrapper } from "infinity-forge";

import { Filters } from "./components";
import { usePermission } from "@/presentation/context";
import { AccessDenied } from "@/presentation/components";

export function PatientReports() {
  const hasPermission = usePermission("REL16");

  if (!hasPermission) {
    return <AccessDenied />;
  }

  return (
    <PageWrapper title="Relatório de pacientes">
      <Filters />
    </PageWrapper>
  );
}
