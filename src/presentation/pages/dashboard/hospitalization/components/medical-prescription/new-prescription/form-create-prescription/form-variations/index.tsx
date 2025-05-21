import { useEffect } from "react";

import { useFormikContext } from "formik";
import { api, Input, InputCurrency, Select, Textarea, useQuery } from "infinity-forge";

import { FluidTherapy } from "./fluid-therapy";

export function FormVariations() {
  const { values, setFieldValue } = useFormikContext<{ type: string, dose: string }>();

  const type = values.type;

  const medicaments = useQuery({
    queryKey: ["medicaments"],
    queryFn: async () => {
      const response = await api({
        url: "units",
        method: "get",
        body: { type: "MEDICINE" },
      });

      return response;
    },
    enableCache: true,
  });

  const drugsAdministrations = useQuery({
    queryKey: ["drugsAdministrations"],
    queryFn: async () => {
      const response = await api({
        url: "drug-administrations",
        method: "get",
      });

      return response;
    },
    enableCache: true,
  });

  useEffect(() => {
    if(type !== "PROCEDURE") {
      setFieldValue("dose", undefined)
      setFieldValue("prescriptionUnitDescription", undefined)
      setFieldValue("drugAdministrationDescription", undefined)
      setFieldValue("volume", undefined)
    }

    if(type !== "FLUID_THERAPY") {
      setFieldValue("fluidSet", undefined)
      setFieldValue("fluidSpeed", undefined)
      setFieldValue("fluidUnitDescription", undefined)
      setFieldValue("supplement", undefined)
    }
  }, [type])

  return (
    <div>
      <div className="row">
        <Input
          label={
            type === "FLUID_THERAPY"
              ? "Fluido"
              : type === "PROCEDURE"
              ? "Procedimento"
              : "Medicamento"
          }
          name="description"
        />

        {type !== "PROCEDURE" && (
          <>
            <InputCurrency prefix=" "  name="dose" label="Dose"  />

            <Select
              label="Unidade"
              onlyOneValue
              name="prescriptionUnitId"
              options={
                medicaments?.data?.map((item) => ({
                  label: item.name,
                  value: item.id,
                })) || []
              }
              loading={medicaments.isFetching}
            />

            <Select
              label="Via aplicação"
              onlyOneValue
              name="drugAdministrationId"
              options={
                drugsAdministrations?.data?.map((item) => ({
                  label: item.description,
                  value: item.id,
                })) || []
              }
              loading={medicaments.isFetching}
            />

            <Input name="volume" label="Volume" />
          </>
        )}
      </div>

      {type === "FLUID_THERAPY" && <FluidTherapy />}

      <Textarea label="Descrição" name="resume" />
    </div>
  );
}


