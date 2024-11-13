import { Error } from "infinity-forge";

import moment from "moment";

import { DateToDDMMYYYY } from "@/presentation/utils";

export function BirthDate({ birthDate }: any) {
  if (!birthDate) {
    return <>-</>
  }

  return (
    <Error name="birthDate">
      <span>{DateToDDMMYYYY(birthDate)}</span>
    </Error>
  );
}
