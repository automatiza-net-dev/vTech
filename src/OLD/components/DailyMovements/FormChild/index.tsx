// @ts-nocheck
// Core
import React, { memo } from "react";

// Components
import { Input } from "antd";
const { TextArea } = Input;

const FormChild = memo(function ({ data, setData }) {
  return (
    <form>
      <div>
        <label>Observações</label>
        <TextArea
          value={data?.observations}
          onChange={(e) => setData({ ...data, observations: e.target.value })}
        />
      </div>
    </form>
  );
});

export default FormChild;
