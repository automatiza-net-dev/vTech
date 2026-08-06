import { useMemo } from "react";
import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";

export const useEconomicGroupUnits = () => {
  const { businessUnits, loadingBusinessUnits } = useBusinessUnitsByUser();

  const units = useMemo(
    () =>
      [...(businessUnits || [])]
        .sort((a, b) => (a?.identification || "").localeCompare(b?.identification || ""))
        .map((unit, index) => ({
          ...unit,
          index: index + 1,
        })),
    [businessUnits],
  );

  const unitIndexMap = useMemo(
    () =>
      units.reduce<Record<string, number>>((acc, unit) => {
        acc[unit.id] = unit.index;
        return acc;
      }, {}),
    [units],
  );

  const unitOptions = useMemo(
    () =>
      units.map((unit) => ({
        label: `${unit.index}. ${unit.identification}`,
        value: unit.id,
      })),
    [units],
  );

  return {
    units,
    unitIndexMap,
    unitOptions,
    loadingUnits: loadingBusinessUnits,
  };
};
