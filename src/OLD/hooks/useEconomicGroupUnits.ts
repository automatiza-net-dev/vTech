import { useMemo } from "react";
import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";

export const useEconomicGroupUnits = () => {
  const { businessUnits, loadingBusinessUnits } = useBusinessUnitsByUser();

  const units = useMemo(
    () =>
      [...(businessUnits || [])].sort((a, b) =>
        (a?.identification || "").localeCompare(b?.identification || ""),
      ),
    [businessUnits],
  );

  const unitIndexMap = useMemo(
    () =>
      units.reduce<Record<string, number>>((acc, unit) => {
        acc[unit.id] = unit.unitNumber;
        return acc;
      }, {}),
    [units],
  );

  const unitIdentificationMap = useMemo(
    () =>
      units.reduce<Record<string, string>>((acc, unit) => {
        acc[unit.id] = unit.identification;
        return acc;
      }, {}),
    [units],
  );

  const unitOptions = useMemo(
    () =>
      units.map((unit) => ({
        label: `${unit.unitNumber}. ${unit.identification}`,
        value: unit.id,
      })),
    [units],
  );

  return {
    units,
    unitIndexMap,
    unitIdentificationMap,
    unitOptions,
    loadingUnits: loadingBusinessUnits,
  };
};
