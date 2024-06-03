import { Error } from "@/presentation";

interface IRace {
  id: string;
  description: string;
  specie: {
    description: string;
  };
}

export function Race({ race }: { race: IRace }) {
  if (!race?.description || !race?.specie?.description) {
    return "-";
  }

  return (
    <Error name="birthDate">
      <span>{race?.description + " > " + race?.specie?.description}</span>
    </Error>
  );
}
