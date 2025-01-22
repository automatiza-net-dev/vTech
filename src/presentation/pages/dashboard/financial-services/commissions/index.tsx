import { useRef, useState } from "react";

import * as yup from "yup"

import moment from "moment";
import {
  api,
  Select,
  Button,
  PageWrapper,
  FormHandler,
  InputDatePicker,
} from "infinity-forge";
import * as XLSX from "xlsx/xlsx.mjs";
import { useReactToPrint } from "react-to-print";

import { useLoadAllAvailableUnits } from "@/presentation";

import { PrintScreen } from "./components";

import * as S from "./styles";

export function CommissionsReportsComponent() {
  const [filters, setFilters] = useState<{
    to: string;
    from: string;
    businessUnits: string[];
  } | null>(null);
  const [consolidated, setConsolidated] = useState(null);

  const componentRef = useRef<HTMLDivElement>(null);
  const businessUnits = useLoadAllAvailableUnits();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <S.CommissionsReportsComponent>
      <PageWrapper title="Relatório de Comissão">
        <FormHandler
          cleanFieldsOnSubmit={false}
          disableEnterKeySubmitForm
          onChangeForm={{
            callbackResult: (data) => {
              setFilters({
                from: moment(data?.from).format("YYYY-MM-DD"),
                to: moment(data?.to).format("YYYY-MM-DD"),
                businessUnits: data?.units,
              });
            },
          }}
          schema={{ to: yup.date().required("Campo requerido") }}
        >
          <section
            style={{
              display: "grid",
              gap: "10px",
              gridTemplateColumns: "1fr 1fr 1fr",
            }}
          >
            <Select
              isMultiple={true}
              label="Unidade"
              menuPlacement="bottom"
              name="units"
              loading={businessUnits.isFetching}
              options={
                businessUnits.data?.map((unit) => ({
                  label: unit.identification,
                  value: unit.id,
                })) || []
              }
            />

            <InputDatePicker name="from" mode="date" language="pt" label="De" />

            <InputDatePicker name="to" mode="date" language="pt" label="Até" />
          </section>
        </FormHandler>
      </PageWrapper>

      <hr />

      <div className="buttons-box">
        <Button
          text="Imprimir"
          onClick={async () => {

            const response = await api({
              url: "reports/comission-seller-consolidated",
              method: "get",
              body: filters,
            });

            setConsolidated(response);

            setTimeout(() => {
              handlePrint();
            }, 1000);
          }}
        />

        <Button
          text="Conferência (Excel)"
          onClick={async () => {
            const response = await api({
              url: "reports/comission-seller-conference",
              method: "get",
              body: filters,
            });

            const formatted = response?.[0]?.comissao?.map((item) => ({
              vendedor: item?.vendedor,
              unidade: item?.unidadeNegocios,
              codigo_venda: item?.codigoVenda,
              cliente: item?.cliente,
              paciente: item?.paciente,
              produto_servico: item?.produtoServico,
              total_servico_produto: item?.totalServicoProduto,
              percentual_comissao: item?.percentualComissao,
              valor_comissao: item?.valorComissao,
            }));

            let wb = XLSX.utils.book_new(),
              ws = XLSX.utils.json_to_sheet(formatted);

            XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

            XLSX.writeFile(wb, "comissao-conferencia" + ".xlsx");
          }}
        />
      </div>

      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <PrintScreen consolidated={consolidated} />
        </div>
      </div>
    </S.CommissionsReportsComponent>
  );
}
