import moment from "moment";
import { FormHandler, api, InputRadio } from "infinity-forge";
import { useQueryClient } from "@/presentation/use-query";

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
        cleanFieldsOnSubmit={false}
        initialData={{
          type: previousPrescription?.type || "PROCEDURE",
          frequency: previousPrescription?.frequency || "RECURRENT",
          executionStart: previousPrescription?.executionStart,
          executionHour: previousPrescription?.executionHour,
          frequencyUnit: previousPrescription?.frequencyUnit,
          frequencyInterval: previousPrescription?.frequencyInterval,
          frequencyQuantity: previousPrescription?.frequencyQuantity,
          frequencyQuantityUnit: previousPrescription?.frequencyQuantityUnit,
        }}
        decimalFields={[
          "frequencyInterval",
          "frequencyQuantity",
          "dose",
          "volume",
          "fluidSpeed",
        ]}
        onSucess={async (data) => {
          const combinedExecutionStart = moment(data.executionStart)
            .set({
              hour: Number(data.executionHour.split(":")[0]),
              minute: Number(data.executionHour.split(":")[1]),
              second: 0,
              millisecond: 0,
            })
            .toISOString();

          const payload = {
            ...data,
            prescribedAt: moment().toISOString(),
            hospitalizationId,
            executionStart: combinedExecutionStart,
            volume: data.volume ? String(data.volume) : undefined,
          };

          await api({
            url: "hospitalization-prescriptions",
            method: "post",
            body: payload,
          });

          await refetch(["medicalPrescription", hospitalizationId]);

          onCreate && onCreate(data);
        }}
        schema={schema}
      >
        <div className="row">
          <div style={{ width: "100%" }}>
            <h3 className="font-16-bold">Prescrição médica</h3>

            <InputRadio
              name="type"
              options={[
                { label: "Procedimento", value: "PROCEDURE", readOnly: false },
                { label: "Medicamento", value: "MEDICATION", readOnly: false },
                {
                  label: "Fluidoterapia",
                  value: "FLUID_THERAPY",
                  readOnly: false,
                },
              ]}
            />
          </div>

          <div style={{ width: "100%" }}>
            <h3 className="font-16-bold">Frêquencia</h3>
            <InputRadio
              name="frequency"
              readOnly
              options={[
                { label: "Recorrente", value: "RECURRENT" },
                { label: "Apenas uma vez", value: "ONCE" },
                { label: "Quando necessário", value: "WHEN_NEEDED" },
              ]}
            />
          </div>
        </div>

        <Frequency />

        <FormVariations />
      </FormHandler>
    </S.FormCreatePrescription>
  );
}
