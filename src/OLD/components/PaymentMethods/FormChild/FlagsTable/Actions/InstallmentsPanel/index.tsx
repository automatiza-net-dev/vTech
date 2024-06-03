// @ts-nocheck

import React, { memo } from "react";

import { Table, Input } from "antd";

const IntallmentsPanel = memo(function IntallmentsPanel({ data, setData }) {
  return (
    <div className="uk-margin-top">
      <div className="uk-flex uk-flex-right uk-margin-small-bottom"></div>
      <Table
        pagination={{ pageSize: 6 }}
        dataSource={data}
        columns={[
          {
            title: "Qtd. Parcelas",
            key: "installment",
            dataIndex: "installment"
          },
          {
            title: "Taxa",
            key: "fee",
            dataIndex: "fee",
            render: (record, item) => {
              return (
                <Input
                  value={item?.fee}
                  type="number"
                  onChange={(e) => {
                    const obj = [...data];
                    obj.splice(data?.indexOf(item), 1, {
                      ...item,
                      fee: e.target.value
                    });
                    setData(obj);
                  }}
                />
              );
            }
          }
        ]}
      />
    </div>
  );
});

export default IntallmentsPanel;
