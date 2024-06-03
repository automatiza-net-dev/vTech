import { Error } from "infinity-forge";
import { DateToDDMMYYYY } from "@/presentation/utils";

export function BirthDate({ birthDate }: { birthDate: string }) {
  return (
    <Error name="birthDate">
      <span>{DateToDDMMYYYY(new Date(birthDate))}</span>
    </Error>
  );
}
