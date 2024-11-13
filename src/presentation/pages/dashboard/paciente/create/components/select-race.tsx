import { Select } from "infinity-forge";

import { useLoadAllRaces } from "@/presentation/hooks";

export function SelectRace({ required }: { required?: boolean }) {
  const { data, isFetching } = useLoadAllRaces({});

  return (
    <Select
      onlyOneValue
      name="raceId"
      loading={isFetching}
      label={`Espécie > Raça do paciente${required ? "*" : ""}`}
      options={
        data?.map((race) => ({
          label: race.specie.description + " > " + race.description,
          value: race.id,
        })) || []
      }
    />
  );
}
