// @ts-nocheck
import { memo } from "react";
import { useProductivityItems } from "@/OLD/hooks/useProductivityItems";

import { Table } from "antd";

const ProductivityItems = memo(function ProductivityItems({ productId }) {
  const { items } = useProductivityItems(productId);

  return (
    <Table
      dataSource={items}
      columns={[
        { title: "Qtd", key: "qtd", dataIndex: "quantity" },
        {
          title: "Descrição item produtividade",
          key: "description",
          dataIndex: "description",
        },
      ]}
    />
  );
});

export default ProductivityItems;
