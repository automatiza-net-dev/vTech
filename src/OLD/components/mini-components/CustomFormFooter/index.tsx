// Core
// @ts-nocheck
import React, { memo } from "react";

// Components
import { Button } from "antd";

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
        <Button
          type="primary"
          htmlType="submit"
          className="uk-margin-small-right"
        >
          Salvar
        </Button>
        {print && (
          <Button
            className="uk-margin-small-right"
            onClick={() => Print(Print(toPrint))}
          >
            {" "}
            Imprimir{" "}
          </Button>
        )}
        <Button
          onClick={() => {
            setVisible(false);
          }}
        >
          Cancelar
        </Button>
      </div>
    </footer>
  );
});

export default FooterForm;
