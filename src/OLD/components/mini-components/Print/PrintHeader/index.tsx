// @ts-nocheck
import React from "react";

import masks from "@/OLD/utils/masks";

export default function PrintHeader({ unit }) {
  return (
    <section className="uk-flex uk-flex-between" style={{ fontSize: "1em" }}>
      <div>
        <img src={`/images/logo/${process.env.client}.png`} width="100" />
      </div>
      <div>
        <p className="uk-margin-remove">{unit?.fantasy_name}</p>
        <p className="uk-margin-remove">
          {unit?.address}
          {unit?.complement ? `\n-\n${unit?.complement}` : ""}
        </p>
        <p className="uk-margin-remove">
          {unit?.district},&nbsp;{unit?.city},&nbsp;{unit?.state?.toUpperCase()}
        </p>
        <p className="uk-margin-remove">
          {unit?.phone && masks.phone(unit?.phone)}
        </p>
      </div>
    </section>
  );
}
