import { useState } from "react";
import {
  FormHandler,
  DatePickerInput,
  Select,
  Button,
  useToast,
} from "infinity-forge";

import * as S from "./styles";

import { useLoadAllAvailableUnits, useLoadDreReport } from "@/presentation";

import moment from "moment";

export function DreReport() {
  const [filters, setFilters] = useState({ competence: new Date(), unit: "" });

  const businessUnits = useLoadAllAvailableUnits();
  const reports = useLoadDreReport(filters);

  const { createToast } = useToast();

  return (
    <S.DreReport>
      <FormHandler
        initialData={filters}
        onChangeForm={{
          callbackResult: (data) => {
            setFilters({
              ...data,
              competence: moment(data.competence).format("MM/YYYY"),
            });
          },
        }}
      >
        <div className="filters-container">
          <DatePickerInput
            hasIcon
            label="Competencia"
            name="competence"
            typePicker="month"
            maxDate={new Date()}
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
      <Button
        loading={reports.isLoading}
        text="imprimir"
        onClick={() => {
          if (filters.unit === "") {
            return createToast({
              message: "Selecione uma unidade",
              status: "error",
            });
          }
          if (reports.data) {
            const fileURL = URL.createObjectURL(reports.data as Blob);
            window.open(fileURL);
          }
        }}
      />
    </S.DreReport>
  );
}
