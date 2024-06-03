import { Select } from "infinity-forge";

import { useFormikContext } from "formik";

import { useLoadSchedulesPatients } from "@/presentation/hooks";

export function SelectPatient() {
  const { setFieldValue } = useFormikContext();
  const patients = useLoadSchedulesPatients({});

  function handleChange(ev) {
    const currentPatient = patients.data?.find(
      (patient) => patient.id === ev[0]
    );

    setFieldValue("raca", [currentPatient?.gender]);
    // setFieldValue("como_conheceu", [currentPatient.race.id]);
  }

  return (
    <Select
      label="Nome"
      name="patient"
      placeholder="Selecione uma opção"
      onChangeSelect={handleChange}
      options={
        patients?.data?.map((patient) => ({
          label: patient.name,
          value: patient.id,
        })) || []
      }
    />
  );
}
