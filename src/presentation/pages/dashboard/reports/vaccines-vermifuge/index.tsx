import { useRef, useState } from "react";

import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";

import {
  useLoadVaccinesReport,
  useLoadAllAvailableUnits,
  useLoadAllVaccines,
  useLoadAllVaccinesProtocols,
} from "@/presentation/hooks";

import { PermissionItem } from "@/presentation/components";
import { PrintVaccinesVermifugeReport } from "./components";
import { FormHandler, Select, InputDatePicker, Button } from "infinity-forge";

import * as S from "./styles";

export function VaccinesVermifugeReport({
  type,
  permission,
}: {
  type: "vaccine" | "vermifuge";
  permission: "REL13" | "REL14";
}) {
  const [filtersData, setFiltersData] = useState({
    type,
    units: [],
    fromScheduling: moment().format("DD/MM/YYYY"),
    toScheduling: moment().format("DD/MM/YYYY"),
    fromApplication: moment().format("DD/MM/YYYY"),
    toApplication: moment().format("DD/MM/YYYY"),
  });

  const router = useRouter();
  const vaccines = useLoadAllVaccines({});
  const businessUnits = useLoadAllAvailableUnits();
  const componentRef = useRef<HTMLDivElement>(null);
  const vaccinesReport = useLoadVaccinesReport(filtersData);
  const vaccineProtocols = useLoadAllVaccinesProtocols({ fetch: true });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleExport = () => {
    const formatted = vaccinesReport.data?.map((item) => ({
      unidade: item?.unidade,
      tutor: item?.tutor,
      telefone: item?.contato_tutor,
      paciente: item?.paciente,
      tipo: item?.vacina_vermifugo,
      nome_vacina_vermifugo: item?.nome_vacina,
      descricao_vacina_vermifugo: item?.descricao_vacina,
      protocolo: item?.nome_protocolo,
      especie: item?.especie,
      data_agendamento: item?.data_agendamento ? item?.data_agendamento : "-",
      dose: item.dose,
      data_aplicacao: item?.data_aplicacao ? item?.data_aplicacao : "-",
      laboratorio: item?.laboratorio,
      lote: item?.lote,
      status: item.status,
    }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "Relatório vacinas/vermifugos" + ".xlsx");
  };

  return (
    <S.VaccinesVermifuge>
      <PermissionItem hash={permission}>
        <FormHandler
          initialData={filtersData}
          onChangeForm={{
            callbackResult: (dataForm) => {
              setFiltersData({
                ...dataForm,
                fromApplication: moment(dataForm.fromApplication).format(
                  "YYYY-MM-DD"
                ),
                toApplication: moment(dataForm.toApplication).format(
                  "YYYY-MM-DD"
                ),
                fromScheduling: moment(dataForm.fromScheduling).format(
                  "YYYY-MM-DD"
                ),
                toScheduling: moment(dataForm.toScheduling).format(
                  "YYYY-MM-DD"
                ),
              });
            },
          }}
          customAction={{
            Component: () => (
              <div className="actions-box">
                <Button text="Voltar" onClick={() => router.back()} />
                <Button
                  text="Imprimir"
                  onMouseEnter={() => {
                    vaccinesReport.refetch();
                  }}
                  onClick={() => {
                    handlePrint();
                  }}
                />
                <Button
                  text="Exportar (Excel)"
                  onMouseEnter={() => {
                    vaccinesReport.refetch();
                  }}
                  onClick={() => {
                    handleExport();
                  }}
                />
              </div>
            ),
          }}
        >
          <section>
            {businessUnits.data && businessUnits.data?.length > 0 && (
              <div className="custom-grid-box">
                <Select
                  label="Unidade"
                  isMultiple
                  name="units"
                  options={businessUnits.data.map((unit) => ({
                    value: unit?.id,
                    label: unit?.identification,
                  }))}
                />
              </div>
            )}
            <div className="date-container">
              <div>
                <InputDatePicker
                  language="pt"
                  label="Data de agendamento"
                  name="fromScheduling"
                  mode="date"
                  date={{}}
                />
              </div>
              <div style={{ marginTop: "20px" }}>
                <InputDatePicker
                  language="pt"
                  name="toScheduling"
                  mode="date"
                  date={{}}
                />
              </div>
            </div>
            <div className="date-container">
              <div>
                <InputDatePicker
                  language="pt"
                  label="Data de aplicação"
                  name="fromApplication"
                  mode="date"
                  date={{}}
                />
              </div>
              <div style={{ marginTop: "20px" }}>
                <InputDatePicker
                  className="to-picker"
                  language="pt"
                  name="toApplication"
                  mode="date"
                  date={{}}
                />
              </div>
            </div>
          </section>
          <section className="custom-row">
            {vaccines.data && vaccines.data?.length > 0 && (
              <div>
                <Select
                  label="Vacina"
                  name="vaccine"
                  options={vaccines.data.map((vaccine) => ({
                    value: vaccine?.id,
                    label: vaccine?.name,
                  }))}
                />
              </div>
            )}
            {vaccineProtocols.data && vaccineProtocols.data?.length > 0 && (
              <div>
                <Select
                  label="Protocolo"
                  name="protocol"
                  options={vaccineProtocols.data.map((protocol) => ({
                    value: protocol?.id,
                    label: protocol?.name,
                  }))}
                />
              </div>
            )}
            <div>
              <Select
                label="Status"
                name="status"
                options={[
                  {
                    label: "Dose Pendente - atrasada",
                    value: "Dose Pendente - atrasada",
                  },
                  {
                    label: "Dose Pendente - em dia",
                    value: "Dose Pendente - em dia",
                  },
                  {
                    label: "Dose aplicada",
                    value: "Dose aplicada",
                  },
                ]}
              />
            </div>
            <div>
              <Select
                label="Odenação"
                name="order"
                onlyOneValue
                options={[
                  {
                    label: "Protocolo",
                    value: "Protocolo",
                  },
                ]}
              />
            </div>
          </section>
        </FormHandler>
        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            {vaccinesReport?.data && vaccinesReport?.data && (
              <PrintVaccinesVermifugeReport reports={vaccinesReport.data} />
            )}
          </div>
        </div>
      </PermissionItem>
    </S.VaccinesVermifuge>
  );
}
