import moment from "moment";
import { AxiosError } from "axios";

import {
  Select,
  useToast,
  FormHandler,
  PageWrapper,
  DatePicker,
} from "infinity-forge";

import { reportsService } from "@/OLD/services/reports.service";
import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";

import { usePermission } from "@/presentation/context";
import { AccessDenied } from "@/presentation/components";

import * as S from "./styles";

export function DownloadXML() {
  const hasPermission = usePermission("REL18");

  const { createToast } = useToast();
  const { businessUnits } = useBusinessUnitsByUser(false, false);

  async function handleSubmit(payload) {
    const formatedPayload = {
      businessUnitId: payload?.businessUnitId,
      periodo: moment(payload?.periodo).format("YYYYMM"),
    };

    try {
      const result = (await reportsService.getNFENFC(formatedPayload)).data;

      if (result && result?.url) {
        window.open(result?.url, "_blank");

        createToast({ status: "success", message: "Gerado com sucesso!" });
        return;
      }

      createToast({
        status: "error",
        message: "Nenhum resultado encontrado",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        createToast({
          status: "error",
          message: "Não existe arquivo disponível para download.",
        });
        return;
      }
      createToast({ status: "error", message: "Erro ao exportar." });
    }
  }

  if (!hasPermission) {
    return <AccessDenied />;
  }

  return (
    <PageWrapper title="Download Arquivos Xml NFE's e NFCE's">
      <S.DownloadXML>
        <FormHandler
          onSucess={handleSubmit}
          cleanFieldsOnSubmit={false}
          button={{ text: "Download" }}
        >
          <Select
            label="Unidade"
            name="businessUnitId"
            options={businessUnits.map((unit) => ({
              value: unit?.id,
              label: unit?.fantasyName,
            }))}
            onlyOneValue
          />

          <DatePicker name="periodo" mode={"month"} label="Período" />
        </FormHandler>
      </S.DownloadXML>
    </PageWrapper>
  );
}
