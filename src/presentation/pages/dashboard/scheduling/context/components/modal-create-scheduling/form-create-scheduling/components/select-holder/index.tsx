import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { useLoadAllPatientTutor } from "@/presentation";

export function SelectHolder() {
  const { setFieldValue, initialValues } = useFormikContext<any>();

  const { data } = useLoadAllPatientTutor({});

  if (!data) {
    return <></>;
  }

  const hasInitialValue = initialValues["holderId"] || initialValues["patientId"]

  return (
    <Select
      label={process.env.client === "sancla" ? "Tutor" : "Cliente"}
      name={process.env.client === "sancla" ? "holderId" : "patientId"}
      options={
        data?.map((tutor) => ({
          label: tutor.name,
          value: tutor.id,
        })) || []
      }
      disabled={hasInitialValue}
      placeholder="Cliente"
      onChangeSelect={() => {
        if (process.env.client === "sancla") {
          setFieldValue("patientId", []);
          setFieldValue("scheduleServiceTypeId", []);
        }
      }}
    />
  );
}
