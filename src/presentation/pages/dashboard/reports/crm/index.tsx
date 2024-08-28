import { useState } from "react";

import { useRouter } from "next/router";

import {
  useLoadAllAvailableUnits,
  useLoadAllBusinessUsers,
} from "@/presentation";
import * as XLSX from "xlsx/xlsx.mjs";
import { FormHandler, Select, Input, Button } from "infinity-forge";

import moment from "moment";
import { RemoteCRM } from "@/data";

import * as S from "./styles";
import { CrmTypes, container } from "@/container";
import { formatLiftoneArquive, formatSanclaArquive } from "./utils";

export function CrmReports() {
  const router = useRouter();
  const businessUnits = useLoadAllAvailableUnits();
  const users = useLoadAllBusinessUsers();
  async function handleExport(payload) {
    const data = {
      ...payload,
      fromOpening: payload?.fromOpening
        ? moment(payload.fromOpening).format("YYYY-MM-DD")
        : null,
      toOpening: payload?.toOpening
        ? moment(payload.toOpening).format("YYYY-MM-DD")
        : null,
      fromContact: payload?.fromContact
        ? moment(payload.fromContact).format("YYYY-MM-DD")
        : null,
      toContact: payload?.toContact
        ? moment(payload.toContact).format("YYYY-MM-DD")
        : null,
    };

    const reports = await container
      .get<RemoteCRM>(CrmTypes.RemoteCRM)
      .loadOpportunitiesReport(data);

    const formatted =
      process.env.client === "sancla"
        ? formatSanclaArquive(reports)
        : formatLiftoneArquive(reports);

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(formatted);

    XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

    XLSX.writeFile(wb, "oportunidades-crm" + ".xlsx");
  }

  const initialData = {
    fromOpening: null,
    toOpening: null,
    fromContact: null,
    toContact: null,
  };

  return (
    <S.CrmReports>
      <h2>Relatório CRM</h2>
      <FormHandler
        cleanFieldsOnSubmit={false}
        initialData={initialData}
        button={{ text: "Exportar (excel)" }}
        onSucess={handleExport}
        customAction={{
          Component: () => (
            <Button text="Voltar" onClick={() => router.back()} />
          ),
        }}
      >
        <section>
          <div>
            <label>Ganho/Perda</label>
            <Select
              isMultiple={true}
              menuPlacement="bottom"
              name="balances"
              options={[
                { label: "Ganho", value: "Ganho" },
                { label: "Perda", value: "Perda" },
                { label: "Em aberto", value: "Em Aberto" },
              ]}
            />
          </div>
          {users.data && (
            <div>
              <label>Prof. Resp.</label>
              <Select
                isMultiple={true}
                menuPlacement="bottom"
                name="users"
                options={users.data?.map((user) => ({
                  label: user.name,
                  value: user.id,
                }))}
              />
            </div>
          )}
          {businessUnits.data && (
            <div>
              <label>Unidade</label>
              <Select
                isMultiple={true}
                menuPlacement="bottom"
                name="units"
                options={businessUnits.data.map((unit) => ({
                  label: unit.identification,
                  value: unit.id,
                }))}
              />
            </div>
          )}
        </section>
        <section>
          <div>
            <div className="custom-label">
              <span>Data Contato</span>
            </div>
            <div className="date-input-container">
              <Input
                name="fromContact"
                type="date"
                max={moment().format("YYYY-MM-DD")}
                placeholder="Selecione uma data"
              />
              <span className="center-elem-margin">à</span>
              <Input
                name="toContact"
                type="date"
                max={moment().format("YYYY-MM-DD")}
                placeholder="Selecione uma data"
              />
            </div>
          </div>
          <div>
            <div className="custom-label">
              <span>Data Abertura</span>
            </div>
            <div className="date-input-container">
              <Input
                name="fromOpening"
                type="date"
                max={moment().format("YYYY-MM-DD")}
                placeholder="Selecione uma data"
              />
              <span className="center-elem-margin">à</span>
              <Input
                name="toOpening"
                type="date"
                max={moment().format("YYYY-MM-DD")}
                placeholder="Selecione uma data"
              />
            </div>
          </div>
        </section>
      </FormHandler>
    </S.CrmReports>
  );
}
