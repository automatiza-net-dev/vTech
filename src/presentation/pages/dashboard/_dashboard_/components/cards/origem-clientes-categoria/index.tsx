import React from "react";
import { Error } from "infinity-forge";
import { TableLevels } from "../subgrupos-detalhado/styles";

// TODO função currencyFormatter temporária
import { currencyFormatter } from "@/OLD/components/Budget";

export function OrigemClientesCategoria(props) {
  if (
    !(props.items as any).categories ||
    !Array.isArray((props.items as any).categories) ||
    (props.items as any).categories.length === 0
  ) {
    return <></>;
  }

  return (
    <Error name="OrigemClientesCategoria">
      <TableLevels>
        <h2>Origem clientes</h2>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Fatur.</th>
              <th>%</th>
            </tr>
          </thead>

          <tbody>
            {(props.items as any).categories.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="primary">
                  <td>
                    <span>{item?.categoria || "-"}</span>
                  </td>
                  <td>{currencyFormatter(item?.faturamento) || "0,00"}</td>
                  <td>
                    {item?.porcentagem
                      ? item?.porcentagem.toFixed(2) + "%"
                      : "-"}
                  </td>
                </tr>

                {item?.grupos.map((group) => (
                  <React.Fragment key={group.id}>
                    <tr className="second">
                      <td>
                        <span>{group?.grupo || "-"}</span>
                      </td>
                      <td>{currencyFormatter(group?.total) || "0,00"}</td>
                      <td>
                        {item?.porcentagem
                          ? item?.porcentagem.toFixed(2) + "%"
                          : "-"}
                      </td>
                    </tr>

                    {group?.origem_clientes.map((origin) => (
                      <tr className="third" key={origin.id}>
                        <td>
                          <span>{origin?.origem || "-"}</span>
                        </td>
                        <td>{currencyFormatter(origin?.total) || "0,00"}</td>
                        <td>
                          {origin?.porcentagem
                            ? origin?.porcentagem.toFixed(2) + "%"
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </TableLevels>
    </Error>
  );
}
