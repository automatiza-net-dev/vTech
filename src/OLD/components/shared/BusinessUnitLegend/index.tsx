import React from "react";

type Unit = {
  id: string;
  index: number;
  identification: string;
};

export default function BusinessUnitLegend({ units }: { units: Unit[] }) {
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
        fontSize: "0.85rem",
        color: "var(--text-secondary, #666)",
      }}
    >
      {units.map((unit) => (
        <span key={unit.id}>
          <strong>{unit.index}.</strong> {unit.identification}
        </span>
      ))}
    </div>
  );
}
