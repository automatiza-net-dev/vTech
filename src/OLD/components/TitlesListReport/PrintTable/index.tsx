// @ts-nocheck
// PrintTable.js
import React, { forwardRef } from "react";

import { useProfile } from "@/OLD/hooks/useProfile";

import { PrintHeader } from "@/presentation";

import moment from "moment";

const PrintTable = forwardRef(({ columns, dataSource, filters, unit }, ref) => {
  const { clinic } = useProfile();
  const filtersList = Object.keys(filters);

  return (
    <div ref={ref}>
      <PrintHeader />
      <h3 className="uk-margin-remove uk-text-center">Relatório de Títulos</h3>
      <section className="uk-text-center">
        {filtersList?.includes("fromIssueDate") && (
          <div>
            Data emissão: {moment(filters?.fromIssueDate).format("DD/MM/YYYY")}{" "}
            à {moment(filters?.toIssueDate).format("DD/MM/YYYY")}
          </div>
        )}
        {filtersList?.includes("fromExpirationDate") && (
          <div>
            Data vencimento:{" "}
            {moment(filters?.fromExpirationDate).format("DD/MM/YYYY")} à{" "}
            {moment(filters?.toExpirationDate).format("DD/MM/YYYY")}
          </div>
        )}
        {filtersList?.includes("fromPaymentDate") && (
          <div>
            Data pagamento:{" "}
            {moment(filters?.fromPaymentDate).format("DD/MM/YYYY")} à{" "}
            {moment(filters?.toPaymentDate).format("DD/MM/YYYY")}
          </div>
        )}
        {filtersList?.includes("toCompetenceDate") && (
          <div>
            Data competência:{" "}
            {moment(filters?.toCompetenceDate).format("MM/YYYY")}
          </div>
        )}
        {filtersList?.includes("unit") && (
          <div>Unidade: {unit?.fantasyName}</div>
        )}
      </section>
      <table className="uk-margin-top">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.dataIndex} style={{ textAlign: "center" }}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((data, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.dataIndex} style={{ textAlign: "center" }}>
                  {data[column.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PrintTable;
