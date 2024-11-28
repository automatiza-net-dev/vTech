import { useFormikContext } from "formik";
import { Select, useQueryClient } from "infinity-forge";

import {
  useMe,
  useLoadAllPatientTutor,
  useLoadSchedulesToMovementKEY,
} from "@/presentation";

import { ISelectClientProps } from "./interfaces";

export function SelectClient(props: ISelectClientProps) {
  const user = useMe();
  const { data, isFetching } = useLoadAllPatientTutor();
  const { values } = useFormikContext<any>();

  return (
    <Select
      {...props}
      onlyOneValue
      loading={isFetching}
      options={
        data?.map((tutor) => ({
          label: tutor.name,
          value: tutor.id,
        })) || []
      }
    />
  );
}
