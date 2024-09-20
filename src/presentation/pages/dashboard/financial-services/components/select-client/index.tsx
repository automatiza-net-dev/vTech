import { InputProps, Select } from "infinity-forge";

import { CreateBudget } from "@/domain";
import { useFormikContext } from "formik";

import { useLoadAllPatientTutor } from "@/presentation";

import { MdOutlineClear } from "react-icons/md";

import * as S from "./styles";

export function SelectClient({
  inputProps,
  allowClear,
}: {
  inputProps: InputProps;
  allowClear: boolean;
}) {
  const patientTutor = useLoadAllPatientTutor({ needFilterToCallApi: false });

  const { setFieldValue } = useFormikContext<CreateBudget.Params>();

  return (
    <S.SelectClient>
      <Select
        onlyOneValue
        {...inputProps}
        loading={patientTutor.isFetching}
        options={
          patientTutor.data?.map((tutor) => ({
            label: tutor.name,
            value: tutor.id,
          })) || []
        }
      />
      {allowClear && (
        <MdOutlineClear
          size={30}
          className="remove-icon"
          onClick={() => {
            setFieldValue(inputProps.name, null);
          }}
        />
      )}
    </S.SelectClient>
  );
}
