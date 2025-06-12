// @ts-nocheck
// Core
import React, { memo } from "react";

// Components
import { Input } from "antd";
const { TextArea } = Input;

// Utils
import Masks from "@/OLD/utils/masks";

const FormChild = memo(function FormChild({ data, setData, numberInput, showObservations = true }) {
  return (
    <section>
      {numberInput && (
        <div>
          <label>Valor total</label>
          <Input
            autoFocus
            onChange={(e) =>
              setData({ ...data, cashierTotal: Masks.money(e.target.value) })
            }
            value={data?.cashierTotal}
          />
        </div>
      )}
      {showObservations && (
        <div className="uk-margin-top">
          <label>Observações</label>
          <TextArea
            onChange={(e) => setData({ ...data, observations: e.target.value })}
            value={data?.observations}
          />
        </div>
      )}

    </section>
  );
});

export default FormChild;
