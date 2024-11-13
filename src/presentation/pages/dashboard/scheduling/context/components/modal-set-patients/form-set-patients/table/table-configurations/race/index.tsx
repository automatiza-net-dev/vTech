import { Error } from "infinity-forge";


export function Race({ race }: any) {
  if (!race?.description || !race?.specie?.description) {
    return <>-</>;
  }

  return (
    <Error name="birthDate">
      <span>{race?.description + " > " + race?.specie?.description}</span>
    </Error>
  );
}
