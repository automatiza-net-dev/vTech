import { Column, formatNumberToCurrency, useTable } from "infinity-forge";

import { Bill, Product, TreatmentExecutions } from "@/domain";
import { authorizationFormater } from "../../utils";

import { Cancel } from "./cancel";
import { ApproveCancel } from "./approve-cancel";
import { usePermission } from "@/presentation";

export function TableItems(props: Bill & { isCancelled?: boolean }) {
  const hasPermissionToCancelItems = usePermission("VEN19");

  const { Table } = useTable<Product>({
    configs: {
      tableKeyItem: "id",
      errorMessage: "Não possui items",
      tableData: props.items,
    },
    columnsConfiguration: {
      childrens: {
        childrenKey: "treatmentExecutions",
        omitEmptyList: true,
        columns: [
          { id: "item_produtividade", label: "Item produtividade" },
          { id: "data_agendamento", label: "Data agendameto" },
          { id: "data_execucao", label: "Data de execução" },
          { id: "usuario_execucao", label: "Usuário execução" },
          { id: "observations", label: "Observação" },
        ] as Column<TreatmentExecutions>[],
        
      },
      columns: [
        { id: "quantity", label: "Qtd." },
        {
          id: "productVariation",
          label: "Cód.Produto",
          Component: {
            Element: (item) => {
              const product = item as Product;

              return (
                <p className="font-14-regular">
                  {product?.productVariation?.product?.reference_code}
                </p>
              );
            },
          },
        },
        {
          id: "description",
          label: "Descrição",
          Component: {
            Element: (item) => {
              const product = item as Product;

              return (
                <p className="font-14-regular">
                  {product?.productVariation?.product?.description}
                </p>
              );
            },
          },
        },

        {
          id: "sale_value",
          enabled: !props.isCancelled,
          label: "Preço Unitário Cadastro",
          Component: {
            Element: (item) => {
              const product = item as Product;

              return (
                <p className="font-14-regular">
                  {formatNumberToCurrency(product?.sale_value)}
                </p>
              );
            },
          },
        },
        {
          id: "unitary_value",
          label: "Preço Unitário Vendido",
          Component: {
            Element: (item) => {
              const product = item as Product;

              return (
                <p className="font-14-regular">
                  {formatNumberToCurrency(product?.unitary_value)}
                </p>
              );
            },
          },
        },
        {
          id: "discount_value",
          enabled: !props.isCancelled,
          label: "Desconto Concedido",
          Component: {
            Element: (item) => {
              const product = item as Product;

              return (
                <p className="font-14-regular">
                  {formatNumberToCurrency(product?.discount_value)}
                </p>
              );
            },
          },
        },
        {
          id: "total_value",
          label: "Total",
          Component: {
            Element: (item) => {
              const product = item as Product;

              return (
                <p className="font-14-regular">
                  {formatNumberToCurrency(product?.total_value)}
                </p>
              );
            },
          },
        },
        {
          id: "courtesy",
          label: "Pendência",
          enabled: !!props.cancelled,
          Component: {
            Element: (item) => (
              <p className="font-14-regular">
                {item?.courtesy
                  ? "Cortesia"
                  : item?.max_discount
                  ? "desc.max"
                  : "Não"}
              </p>
            ),
          },
        },
        {
          id: "id",
          label: "Autorização",
          enabled: !!(!props.isCancelled && !props.cancelled),
          Component: {
            Element: (item) => {
              return (
                <p className="font-14-regular">
                  {authorizationFormater(item, "product")}
                </p>
              );
            },
          },
        },
        {
          id: "cancelledQuantity",
          label: "Qtd Canc.",
          enabled:
            !!props.isCancelled &&
            (props.cancelled === "P" || props.cancelled === "A"),
        },
        {
          id: "custom" as any,
          label: "Cancelar",
          enabled: !!props.isCancelled && !props.cancelled,
          Component: {
            Element: Cancel as any,
          },
        },
        {
          id: "custom2" as any,
          label: "Cancelamento",
          enabled:
            props.isCancelled &&
            !!props.cancelled &&
            hasPermissionToCancelItems,
          Component: {
            Element: (item: any) => {
              if (!item.cancelled) {
                return <></>;
              }

              if (item.cancelled === "S" || item.cancelled === "N") {
                return (
                  <p className="font-14-bold">
                    {item.cancelled === "S" ? "Aprovado" : "Não aprovado"}{" "}
                    <br /> {item?.reviewCancelNotes || "Sem obs"}
                  </p>
                );
              }

              return <ApproveCancel {...item} />;
            },
          },
        },
      ],
    },
  });

  return Table;
}
