import { Select } from "infinity-forge";
import { useFormikContext } from "formik";

import { useLoadAllPatientTutor } from "@/presentation";

export function SelectHolder() {
  const { setFieldValue, initialValues } = useFormikContext<any>();

  const { data } = useLoadAllPatientTutor({});

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
      label={process.env.client === "sancla" ? "Tutor" : "Cliente"}
      name={process.env.client === "sancla" ? "holderId" : "patientId"}
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
        if (process.env.client === "sancla") {
          setFieldValue("patientId", []);
          setFieldValue("scheduleServiceTypeId", []);
        }
      }}
    />
  );
}
