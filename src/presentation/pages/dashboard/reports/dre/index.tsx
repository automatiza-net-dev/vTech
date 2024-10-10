import { useRouter } from "next/router";

import {
  FormHandler,
  Select,
  Button,
  InputDatePicker,
  PageWrapper,
  updateRoute,
} from "infinity-forge";

import * as S from "./styles";

import { useLoadAllAvailableUnits, useLoadDreReport } from "@/presentation";

import axios from "axios";

export function DreReport() {
  const router = useRouter();
  const reports = useLoadDreReport();
  const businessUnits = useLoadAllAvailableUnits();

  return (
    <PageWrapper title="Relatório DRE">
      <S.DreReport>
        <FormHandler
          initialData={{ competence: new Date() }}
          onChangeForm={{
            callbackResult: (data) => {
              updateRoute({
                params: { ...data, competence: data?.competenceundefined },
                router,
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

              const response = await axios.get(reportsResponse?.data?.result, {
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
