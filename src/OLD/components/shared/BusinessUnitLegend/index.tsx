import React from "react";
import { useSystem } from "@/presentation";

type Unit = {
  id: string;
  unitNumber: number;
  identification: string;
};

export default function BusinessUnitLegend({ units }: { units: Unit[] }) {
  const { unit: loggedUnit } = useSystem();

  if (!units || units.length <= 1) {
    return null;
  }

  return (
    <div
      className="uk-margin-small-top uk-margin-small-bottom"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        fontSize: "12px",
        color: "var(--text-secondary, #666)",
      }}
    >
      {units.map((unit) => {
        const isLoggedUnit = unit.id === loggedUnit?.id;

        return (
          <span key={unit.id} style={isLoggedUnit ? { fontWeight: "bold" } : undefined}>
            <strong>{unit.unitNumber}.</strong> {unit.identification}
          </span>
        );
      })}
    </div>
  );
}
