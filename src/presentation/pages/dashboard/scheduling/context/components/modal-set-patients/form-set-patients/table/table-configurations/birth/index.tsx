import { Error } from "@/presentation/components";
import { DateToDDMMYYYY } from "@/presentation/utils";

export function BirthDate({ birthDate }: { birthDate: string }) {
  return (
    <Error name="birthDate">
      <span>{DateToDDMMYYYY(new Date(birthDate))}</span>
    </Error>
  );
}
