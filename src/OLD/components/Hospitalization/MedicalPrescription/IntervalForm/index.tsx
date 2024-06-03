// @ts-nocheck
// Core
import React, { memo } from "react";

// Components
import { Select, Input } from "antd";
const { Option } = Select;

const IntervalForm = memo(function IntervalForm({ state, setState }) {
  return (
    <section className="uk-flex uk-margin-top">
      <div className="uk-width-1-3 uk-margin-right">
        <label>A Cada</label>
        <div>
          <Input
            required
            type="number"
            className="uk-width-1-3 uk-margin-small-right"
            value={state?.frequencyInterval}
            onChange={(e) =>
              setState({ ...state, frequencyInterval: e.target.value })
            }
          />
          <Select
            required
            value={state?.frequencyUnit}
            className="uk-width-1-2"
            onChange={(e) => setState({ ...state, frequencyUnit: e })}
          >
            <Option value="HOUR">Horas</Option>
            <Option value="DAY">Dias</Option>
          </Select>
        </div>
      </div>
      <div className="uk-width-1-3">
        <label>Por</label>
        <div>
          <Input
            required
            value={state?.frequencyQuantity}
            type="number"
            className="uk-width-1-3 uk-margin-small-right"
            onChange={(e) =>
              setState({ ...state, frequencyQuantity: e.target.value })
            }
          />
          <Select
            className="uk-width-1-2"
            value={state?.frequencyQuantityUnit}
            onChange={(e) => setState({ ...state, frequencyQuantityUnit: e })}
          >
            <Option value="HOUR">Horas</Option>
            <Option value="DAY">Dias</Option>
          </Select>
        </div>
      </div>
    </section>
  );
});

export default IntervalForm;
