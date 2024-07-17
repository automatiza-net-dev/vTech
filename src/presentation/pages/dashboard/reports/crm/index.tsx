import { useState, useRef } from "react";

import { useRouter } from "next/router";

import {
  useLoadOpportunitiesReport,
  useLoadAllAvailableUnits,
  useLoadAllBusinessUsers,
} from "@/presentation";

import {
  FormHandler,
  Select,
  Input,
  Button,
  DatePickerInput,
} from "infinity-forge";
import { PrintScreen } from "./components";
// import { DateFilter } from "@/OLD/components/mini-components";
// TODO Verificar possibilidade de implementação do DateFilter futuramente

import ReactToPrint from "react-to-print";
import moment from "moment";

import * as S from "./styles";

export function CrmReports() {
  const [filters, setFilters] = useState({
    fromOpening: new Date(),
    toOpening: new Date(),
    fromContact: new Date(),
    toContact: new Date(),
  });

  const router = useRouter();
  const reports = useLoadOpportunitiesReport(filters);
  const businessUnits = useLoadAllAvailableUnits();
  const users = useLoadAllBusinessUsers();
  const componentRef = useRef();

  return (
    <S.CrmReports>
      <h2>Relatório CRM</h2>
      <FormHandler
        initialData={filters}
        onChangeForm={{
          callbackResult: (data) =>
            setFilters({
              ...data,
              fromOpening: moment(data.fromOpening).format("YYYY-DD-MM"),
              toOpening: moment(data.toOpening).format("YYYY-DD-MM"),
              fromContact: moment(data.fromContact).format("YYYY-DD-MM"),
              toContact: moment(data.toContact).format("YYYY-DD-MM"),
            }),
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
                { label: "Em aberto", value: "Em aberto" },
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
              <DatePickerInput
                hasIcon
                name="fromContact"
                typePicker="normal"
                maxDate={new Date()}
              />
              <span className="center-elem-margin">à</span>
              <DatePickerInput
                hasIcon
                name="toContact"
                typePicker="normal"
                maxDate={new Date()}
              />
            </div>
          </div>
          <div>
            <div className="custom-label">
              <span>Data Abertura</span>
            </div>
            <div className="date-input-container">
              <DatePickerInput
                hasIcon
                name="fromOpening"
                typePicker="normal"
                maxDate={new Date()}
                value={filters?.fromOpening}
              />
              <span className="center-elem-margin">à</span>
              <DatePickerInput
                hasIcon
                name="toOpening"
                typePicker="normal"
                maxDate={new Date()}
                value={filters?.toOpening}
              />
            </div>
          </div>
        </section>
      </FormHandler>
      <footer>
        <Button text="Exportar (excel)" />
        <Button text="Voltar" onClick={() => router.back()} />
      </footer>
    </S.CrmReports>
  );
}
