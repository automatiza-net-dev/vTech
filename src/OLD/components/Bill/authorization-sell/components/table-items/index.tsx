import { formatNumberToCurrency, useTable } from "infinity-forge";

import { Bill, Product } from "@/domain";
import { authorizationFormater } from "../../utils";

import { Cancel } from "./cancel";
import { ApproveCancel } from "./approve-cancel";
import { usePermission } from "@/presentation";

export function TableItems(props: Bill & { isCancelled?: boolean }) {

    const hasPermissionToCancelItems = usePermission("VEN19");

  const { Table } = useTable<Product>({
    configs: { errorMessage: "Não possui items", tableData: props.items },
    columnsConfiguration: {
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
                  {
                    formatNumberToCurrency(product?.sale_value) 
                  }
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
                  {
                    formatNumberToCurrency(product?.unitary_value) 
                  }
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
                  {
                    formatNumberToCurrency(product?.discount_value) 
                  }
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
                  {
                    formatNumberToCurrency(product?.total_value) 
                  }
                </p>
              );
            },
          },
        },
        {
          id: "courtesy",
          label: "Pendência",
          Component: {
            Element: (item) => (
              <p className="font-14-regular">
                {item?.courtesy ? "Cortesia" : item?.max_discount ? "desc.max" : "Não" }
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
          id: "id",
          label: "Cancelar",
          enabled: !!props.isCancelled,
          Component: {
            Element: Cancel as any,
          },
        },
        {
          id: "id",
          label: "Autorização",
          enabled: props.cancelled === "P" && hasPermissionToCancelItems,
          Component: {
            Element: (item: any) => {

              if(!item.cancelled) {
                return <></>
              }

              return <ApproveCancel {...item} />
            },
          },
        }
      ],
    },
  });

  return Table;
}

