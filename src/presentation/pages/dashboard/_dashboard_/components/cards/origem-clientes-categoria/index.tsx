import React from "react";
import { Error } from "infinity-forge";
import { TableLevels } from "../subgrupos-detalhado/styles";

// TODO função currencyFormatter temporária
import { currencyFormatter } from "@/OLD/components/Budget";

export function OrigemClientesCategoria(props) {
  const dynamicKeys = {
    data:
      props.name === "OrigemClientesOportunidades"
        ? props.items
        : props.items.categories,
    field:
      props.name === "OrigemClientesOportunidades" ? "total" : "faturamento",
    label: props.name === "OrigemClientesOportunidades" ? "Qtd" : "Fatur.",
  };

  if (
    !dynamicKeys.data ||
    !Array.isArray(dynamicKeys.data) ||
    dynamicKeys.data.length === 0
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
              <th>{dynamicKeys.label}</th>
              <th>%</th>
            </tr>
          </thead>

          <tbody>
            {dynamicKeys.data.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="primary">
                  <td>
                    <span>{item?.categoria || "-"}</span>
                  </td>
                  <td>{item[dynamicKeys.field] || "0,00"}</td>
                  <td>{item?.porcentagem}</td>
                </tr>

                {item?.grupos.map((group) => (
                  <React.Fragment key={group.id}>
                    <tr className="second">
                      <td>
                        <span>{group?.grupo || "-"}</span>
                      </td>
                      <td>{group?.total || "0,00"}</td>
                      <td>{group?.porcentagem}</td>
                    </tr>

                    {group?.origem_clientes.map((origin) => (
                      <tr className="third" key={origin.id}>
                        <td>
                          <span>{origin?.origem || "-"}</span>
                        </td>
                        <td>{origin?.total || "0,00"}</td>
                        <td>{origin?.porcentagem}</td>
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
