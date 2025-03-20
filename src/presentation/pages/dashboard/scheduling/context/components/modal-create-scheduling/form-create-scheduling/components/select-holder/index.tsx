import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { useLoadAllPatientTutor, useConfigurationsSystem } from "@/presentation";

export function SelectHolder() {
  const { setFieldValue, initialValues } = useFormikContext<any>();

  const { data } = useLoadAllPatientTutor({});

  const {type} = useConfigurationsSystem();

  const initialValue = [
    {
      label:
        initialValues?.["holderName"]?.[0] ||
        initialValues?.["patientName"]?.[0],
      value:
        initialValues?.["holderId"]?.[0] || initialValues?.["patientId"]?.[0],
    },
  ];

  return (
    <Select
      label={type === "Vet" ? "Tutor" : "Cliente"}
      name={type === "Vet" ? "holderId" : "patientId"}
      options={
        initialValue ||
        data?.map((tutor) => ({
          label: tutor.name,
          value: tutor.id,
        })) ||
        []
      }
      disabled={(data && data.length === 0) || !!initialValue}
      placeholder="Cliente"
      onChangeInput={() => {
        if (type === "Vet") {
          setFieldValue("patientId", []);
          setFieldValue("scheduleServiceTypeId", []);
        }
      }}
    />
  );
}
