import moment from "moment";
import { InputRadio, FormHandler, api, useQueryClient } from "infinity-forge";

import { schema } from "./schema";
import { Frequency } from "./frequency";
import { FormVariations } from "./form-variations";

import * as S from "./styles";

export function FormCreatePrescription({
  hospitalizationId,
  onCreate,
  previousPrescription,
}) {
  const refetch = useQueryClient((s) => s.refetch);

  return (
    <S.FormCreatePrescription>
      <FormHandler
        isStickyButtons
        button={{ text: "SALVAR" }}
        disableEnterKeySubmitForm
        initialData={{
          type: previousPrescription?.type || "PROCEDURE",
          frequency: previousPrescription?.frequency || "RECURRENT",
          executionStart: previousPrescription?.executionStart,
          executionHour: previousPrescription?.executionHour,
          frequencyUnit: previousPrescription?.frequencyUnit,
          frequencyInterval: previousPrescription?.frequencyInterval,
          frequencyQuantity: previousPrescription?.frequencyQuantity,
          frequencyQuantityUnit: previousPrescription?.frequencyQuantityUnit
        }}
        onSucess={async (data) => {
          await api({
            url: "hospitalization-prescriptions",
            method: "post",
            body: {
              ...data,
              prescribedAt: moment().toISOString(),
              hospitalizationId,
            },
          });

          await refetch(["medicalPrescription", hospitalizationId].toString());

          onCreate && onCreate(data);
        }}
        schema={schema}
      >
        <div className="row">
          <InputRadio
            name="type"
            options={[
              { label: "Procedimento", value: "PROCEDURE" },
              { label: "Medicamento", value: "MEDICATION" },
              { label: "Fluidoterapia", value: "FLUID_THERAPY" },
            ]}
          />

          <InputRadio
            name="frequency"
            options={[
              { label: "Recorrente", value: "RECURRENT" },
              { label: "Apenas uma vez", value: "ONCE" },
              { label: "Quando necessário", value: "WHEN_NEEDED" },
            ]}
          />
        </div>

        <Frequency />

        <FormVariations />
      </FormHandler>
    </S.FormCreatePrescription>
  );
}
