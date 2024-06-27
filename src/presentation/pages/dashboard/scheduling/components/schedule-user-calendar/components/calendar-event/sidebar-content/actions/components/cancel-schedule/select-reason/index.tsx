import { Select } from "infinity-forge";
import { useFormikContext } from "formik";
import { useLoadAllReasons } from "@/presentation";

export function SelectReason({ setDisableObservation }) {
  const { data, isFetching } = useLoadAllReasons("CA");

  const { setFieldValue } = useFormikContext();

  const options = data?.map((reason) => ({
    label: reason.reason,
    value: reason.id,
  }));

  return (
    <Select
      name="reasonId"
      placeholder="Selecione o motivo"
      options={options || []}
      onlyOneValue
      loading={isFetching}
      onChangeSelect={(value) => {
        const requires_observation = !data?.find(
          (reason) => reason.id === value
        )?.requires_observation;

        if (!requires_observation) {
          setDisableObservation(false);
        } else {
          setFieldValue("observation", "");
          setDisableObservation(true);
        }
      }}
    />
  );
}
