import { useRef, useState } from "react";

import moment from "moment";
import * as XLSX from "xlsx/xlsx.mjs";
import { useRouter } from "next/router";

import {
  FormHandler,
  Select,
  Button,
  InputDatePicker,
} from "infinity-forge";

import {
  PermissionItem,
  useLoadAllVaccines,
  useLoadAllAvailableUnits,
  useLoadAllVaccinesProtocols,
} from "@/presentation";
import { RemoteVaccine } from "@/data";
import { container, TypesAutomatiza } from "@/container";

import { usePrint } from "./hooks/use-print";
import { PrintVaccinesVermifugeReport } from "./components";

import * as S from "./styles";

export function VaccinesVermifugeReport({
  type,
  permission,
}: {
  type: "vaccine" | "vermifuge";
  permission: "REL13" | "REL14";
}) {
  const [filtersData, setFiltersData] = useState<any>({});

  const router = useRouter();
  const vaccines = useLoadAllVaccines({});
  const businessUnits = useLoadAllAvailableUnits();
  const componentRef = useRef<HTMLDivElement>(null);

  const { vaccinesReport, setVaccinesReport } = usePrint({ componentRef });
  const vaccineProtocols = useLoadAllVaccinesProtocols({ fetch: true });

  async function handleExport() {
    const response = await container
      .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
      .loadVaccinesReport(filtersData);

    if (response.length === 0) {
      window.alert("Nenhum resultado encontrado.");
      return;
    }

    const formatted = response?.map((item) => ({
      unidade: item?.unidade,
      tutor: item?.tutor,
      telefone: item?.contato_tutor,
      paciente: item?.paciente,
      tipo: item?.vacina_vermifugo,
      nome_vacina_vermifugo: item?.nome_vacina,
      descricao_vacina_vermifugo: item?.descricao_vacina,
      protocolo: item?.nome_protocolo,
      especie: item?.especie,
      data_agendamento: item?.data_agendamento ?? "-",
      dose: item.dose,
      data_aplicacao: item?.data_aplicacao ?? "-",
      laboratorio: item?.laboratorio,
      lote: item?.lote,
      aplicado_fora: item?.aplicado_fora ? 'Sim' : 'Não',
      status: item.status,
    }));

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "Relatório vacinas/vermifugos" + ".xlsx");
  }

  async function handlePrint() {
    const response = await container
      .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
      .loadVaccinesReport(filtersData);

    if (response.length === 0) {
      window.alert("Nenhum resultado encontrado.");
      return;
    }

    setVaccinesReport(response);
  }

  return (
    <S.VaccinesVermifuge>
      <PermissionItem hash={permission}>
        <FormHandler
          onChangeForm={{
            callbackResult: (dataForm) => {
              const formatDate = (date) =>
                date ? moment(date).format("YYYY/MM/DD") : null;

              setFiltersData({
                ...dataForm,
                type,
                fromScheduling: formatDate(dataForm?.fromScheduling),
                toScheduling: formatDate(dataForm?.toScheduling),
                toApplication: formatDate(dataForm?.toApplication),
                fromApplication: formatDate(dataForm?.fromApplication),
              });
            },
          }}
          customAction={{
            Component: () => (
              <div className="actions-box">
                <Button text="Voltar" onClick={() => router.back()} />
                <Button text="Imprimir" onClick={handlePrint} />
                <Button text="Exportar (Excel)" onClick={handleExport} />
              </div>
            ),
          }}
        >
          <section>
            <div className="date-container">
              <label htmlFor="" className="font-18-regular">
                Data de agendamento
              </label>
              <div className="row">
                <div className="row" style={{ alignItems: "center" }}>
                  <InputDatePicker
                    name="fromScheduling"
                    language="pt"
                    mode="date"
                  />
                  <div
                    className="font-20-bold"
                    style={{ marginBottom: 10, width: 20 }}
                  >
                    -
                  </div>
                  <InputDatePicker
                    name="toScheduling"
                    label=" "
                    language="pt"
                    mode="date"
                  />
                </div>
              </div>
            </div>

            <div className="date-container">
              <label htmlFor="" className="font-18-regular">
                Data de aplicação
              </label>

              <div className="row">
                <div className="row" style={{ alignItems: "center" }}>
                  <InputDatePicker
                    name="toApplication"
                    language="pt"
                    mode="date"
                  />
                  <div
                    className="font-20-bold"
                    style={{ marginBottom: 10, width: 20 }}
                  >
                    -
                  </div>
                  <InputDatePicker
                    name="fromApplication"
                    label=" "
                    language="pt"
                    mode="date"
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="custom-row">
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

            {vaccines.data && vaccines.data?.length > 0 && (
              <div>
                <Select
                  isClearable
                  onlyOneValue
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
                  isClearable
                  onlyOneValue
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
                isClearable
                label="Status"
                name="status"
                options={[
                  {
                    label: "Doses Não Aplicadas",
                    value: "Doses não aplicadas",
                  },
                  {
                    label: "Doses Pendentes",
                    value: "Doses atrasadas",
                  },
                  {
                    label: "Doses Futuras",
                    value: "Doses futuras",
                  },
                  {
                    label: "Doses Aplicadas",
                    value: "Doses aplicadas",
                  },
                ]}
              />
            </div>
          </section>
        </FormHandler>

        <div style={{ display: "none" }}>
          <div ref={componentRef}>
            {vaccinesReport && (
              <PrintVaccinesVermifugeReport reports={vaccinesReport} />
            )}
          </div>
        </div>
      </PermissionItem>
    </S.VaccinesVermifuge>
  );
}
