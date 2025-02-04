import { AxiosError } from "axios";
import moment from "moment";

import {
  Select,
  useToast,
  FormHandler,
  PageWrapper,
  InputDateRange,
} from "infinity-forge";
import * as XLSX from "xlsx/xlsx.mjs";

import { reportsService } from "@/OLD/services/reports.service";
import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";

import * as S from "./styles";
import { usePermission } from "@/presentation/context";
import { AccessDenied } from "@/presentation/components";

export function IssuedInvoices() {
  const hasPermission = usePermission("REL17");

  const { createToast } = useToast();
  const { businessUnits } = useBusinessUnitsByUser(false, false);

  async function handleSubmit(payload) {
    const formatedPayload = {
      businessUnit: payload?.businessUnit,
      fromDate: moment(payload?.range?.startDate)
        .startOf("day")
        .format("YYYY-MM-DD"),
      toDate: moment(payload?.range?.endDate)
        .startOf("day")
        .format("YYYY-MM-DD"),
    };

    try {
      const result = (await reportsService.getIssuedInvoices(formatedPayload))
        .data;

      if (result.length === 0) {
        createToast({
          status: "error",
          message: "Nenhum relatório encontrado",
        });
        return;
      }

      const format = result?.map((item) => ({
        codigo: item?.tag,
        nome_cliente: item?.client_name,
        tipo_do_movimento: item?.movement_type,
        tipo_da_transmissao: item?.purpose,
        modelo_nf: item?.model,
        serie_nf: item?.series,
        numero_nf: item?.numero_nota,
        chave_acesso: item?.access_key,
        total_nf: item?.product_value,
        data_transmissao: item?.authorization_date,
        data_recibo_autorizacao: item?.authorization_receipt_date,
        recibo_autorizacao: item?.authorization_receipt,
        data_recibo_cancelamento: item?.cancellation_receipt_date,
        recibo_cancelamento: item?.cancellation_receipt,
        data_inutilizacao: item?.disabling_receipt_date,
        recibo_inutilizacao: item?.disabling_receipt,
        motivo_inutilizacao: item?.disabling_reason,
        status_sefaz: item?.sefaz_status,
        status_mensagem: item?.sefaz_message,
      }));

      let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(format);

      XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

      XLSX.writeFile(wb, "notas-emitidas" + ".xlsx");

      createToast({ status: "success", message: "Gerado com sucesso!" });
    } catch (error) {
      if (error instanceof AxiosError) {
        createToast({
          status: "error",
          message: error?.response?.data?.message,
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
    <PageWrapper title="Relatório de Notas Fiscais Emitidas">
      <S.SalesReport>
        <FormHandler
          onSucess={handleSubmit}
          cleanFieldsOnSubmit={false}
          button={{ text: "Exportar (Excel)" }}
        >
          <Select
            name="businessUnit"
            options={businessUnits.map((unit) => ({
              value: unit?.id,
              label: unit?.fantasyName,
            }))}
            onlyOneValue
          />

          <InputDateRange names={["range.startDate", "range.endDate"]} />
        </FormHandler>
      </S.SalesReport>
    </PageWrapper>
  );
}
