import { useLoadAllRaces } from "@/presentation/hooks";
import { Select } from "infinity-forge";

export function SelectRace() {
  const { data, isFetching } = useLoadAllRaces({});

  return (
    <Select
      onlyOneValue
      name="raceId"
      loading={isFetching}
      label="Espécie > Raça do paciente"
      options={
        data?.map((race) => ({
          label: race.specie.description + " > " + race.description,
          value: race.id,
        })) || []
      }
    />
  );
}
