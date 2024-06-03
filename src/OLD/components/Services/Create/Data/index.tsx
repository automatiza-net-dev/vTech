// @ts-nocheck
import React, { memo } from "react";

import { useTaxationGroups } from "@/OLD/hooks/useTaxationGroups";

import { Input, Select, Form } from "antd";
const { TextArea } = Input;
const { Option } = Select;

const DataInf = memo(function DataInf({ data, setData }) {
  const { taxationGroups } = useTaxationGroups();

  return (
    <section>
      <div>
        <Form.Item>
          <label>Características</label>
          <TextArea
            value={data?.features}
            onChange={(e) => setData({ ...data, features: e.target.value })}
          />
        </Form.Item>
      </div>
      <div className="uk-flex uk-flex-row uk-margin-small-top">
        <div className="uk-width-1-4 uk-margin-right">
          <Form.Item>
            <label>* Grupo de imposto</label>
            <Select
              required
              value={data?.taxationGroupId}
              onChange={(val) => setData({ ...data, taxationGroupId: val })}
              className="uk-width-1-1"
            >
              {taxationGroups?.length > 0 &&
                taxationGroups?.map((taxationGroup) => (
                  <Option value={taxationGroup?.id}>
                    {taxationGroup?.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item>
            <label>Código de Serviço</label>
            <Input
              required
              value={data?.serviceCode}
              onChange={(e) =>
                setData({ ...data, serviceCode: e.target.value })
              }
            />
          </Form.Item>
        </div>
      </div>
    </section>
  );
});

export default DataInf;
