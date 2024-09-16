import { useState } from "react";

import {
  FormHandler,
  Select,
  Button,
  InputDatePicker,
  PageWrapper,
} from "infinity-forge";

import * as S from "./styles";

import { useLoadAllAvailableUnits, useLoadDreReport } from "@/presentation";

import moment from "moment";
import axios from "axios";

export function DreReport() {
  const [filters, setFilters] = useState({ competence: new Date(), unit: "" });

  const businessUnits = useLoadAllAvailableUnits();
  const reports = useLoadDreReport(filters);

  return (
    <PageWrapper title="Relatório DRE">
      <S.DreReport>
        <FormHandler
          initialData={filters}
          onChangeForm={{
            callbackResult: (data) => {
              setFilters({
                ...data,
                competence: moment(data.competence).format("MM/YYYY"),
              });
              reports.remove();
            },
          }}
        >
          <div className="filters-container">
            <InputDatePicker
              language="pt"
              label="Competencia"
              name="competence"
              mode="month"
              date={{ maxDate: new Date() }}
            />
            {businessUnits.data && (
              <Select
                options={businessUnits.data.map((unit) => ({
                  value: unit.id,
                  label: unit.identification,
                }))}
                name="unit"
                placeholder="Unidade"
                label="Unidade"
              />
            )}
          </div>
        </FormHandler>
        {!reports?.data?.result ? (
          <Button
            text="Gerar arquivo"
            loading={reports.isFetching}
            onClick={async () => {
              const reportsResponse = await reports.refetch();

              const response = await axios.get(reportsResponse.data.result, {
                method: "get",
                responseType: "blob",
              });

              const blob = new Blob([response.data], {
                type: "application/pdf",
              });

              const blobURL = URL.createObjectURL(blob);

              window.open(blobURL);
            }}
          />
        ) : (
          <Button
            text="imprimir"
            onClick={async () => {
              const response = await axios.get(reports.data.result, {
                method: "get",
                responseType: "blob",
              });
              const blob = new Blob([response.data], {
                type: "application/pdf",
              });
              const blobURL = URL.createObjectURL(blob);
              window.open(blobURL);
            }}
          />
        )}
        <span>
          *Verifique se o navegador está bloqueado para abertura de janelas
          popup
        </span>
      </S.DreReport>
    </PageWrapper>
  );
}
