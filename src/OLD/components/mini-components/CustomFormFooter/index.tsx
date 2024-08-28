// Core
// @ts-nocheck
import React, { memo } from "react";

// Components
import { Button } from "infinity-forge";

// Utils
import { Print } from "@/OLD/utils/generalUtils";

const FooterForm = memo(function FooterForm({
  print = false,
  toPrint = false,
  setVisible,
}) {
  return (
    <footer className="uk-margin-top">
      <hr />
      <div className="uk-flex uk-flex-right">
        <Button type="submit" text="Salvar" style={{ marginRight: "10px" }} />

        {print && (
          <Button
            onClick={() => Print(Print(toPrint))}
            text="Imprimir"
            style={{ marginRight: "10px" }}
          />
        )}
        <Button
          onClick={() => {
            setVisible(false);
          }}
          style={{ backgroundColor: "#ff7b5a" }}
          text="Cancelar"
        />
      </div>
    </footer>
  );
});

export default FooterForm;
