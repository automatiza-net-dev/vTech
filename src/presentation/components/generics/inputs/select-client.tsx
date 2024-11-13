import { Select } from "infinity-forge";

import { useLoadAllPatientTutor } from "@/presentation";

import { ISelectClientProps } from "./interfaces";

export function SelectClient(props: ISelectClientProps) {
  const { data, isFetching } = useLoadAllPatientTutor();

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
