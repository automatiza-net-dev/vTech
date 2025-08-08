export const receiptsColumns = [
  {
    title: "Data",
    dataIndex: "date",
    key: "date"
  },
  {
    title: "Cod.",
    dataIndex: "tag",
    key: "tag"
  },
  {
    title: "Fornecedor",
    dataIndex: "supplier",
    key: "supplier"
  },
  {
    title: "Responsável",
    dataIndex: "user",
    key: "user"
  },
  {
    title: "Valor total.",
    dataIndex: "value",
    key: "value"
  },
  {
    title: "Origem lançamento",
    key: "origin",
    dataIndex: "origin"
  },
{
    title: "Nota Fiscal",
    key: "fiscalDocumentSequence",
    dataIndex: "fiscalDocumentSequence"
  },

  { title: "Status", key: "status", dataIndex: "status" },
  {
    title: "Ações",
    dataIndex: "actions",
    key: "actions"
  }
];

export const detailsProductColumns = [
  {
    title: "Qtd.",
    key: "quantity",
    dataIndex: "quantity"
  },
  {
    title: "Qtd. Embalagem Compra",
    key: "fractionValue",
    dataIndex: "fractionValue"
  },
  {
    title: "Cód. Produto",
    key: "productCode",
    dataIndex: "productCode"
  },
  {
    title: "Descrição",
    key: "description",
    dataIndex: "description"
  },
  {
    title: "Preço unitário",
    key: "unitPrice",
    dataIndex: "unitPrice"
  },
  {
    title: "Desconto",
    key: "discount",
    dataIndex: "discount"
  },
  {
    title: "Total Item",
    key: "total",
    dataIndex: "total"
  },
  {
    title: "Remover",
    key: "delete",
    dataIndex: "delete"
  }
];

export const productFiscalDocumentsColumns = [
  {
    title: "Modelo",
    key: "model",
    dataIndex: "model"
  },
  {
    title: "Serie",
    key: "serie",
    dataIndex: "serie"
  },
  {
    title: "N° N.F",
    key: "numberNF",
    dataIndex: "numberNF"
  },
  {
    title: "Chave Acesso",
    key: "accessKey",
    dataIndex: "accessKey"
  },
  {
    title: "Recibo",
    key: "recibo",
    dataIndex: "recibo"
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status"
  },
  {
    title:  "Rec. Canc. / Inut.",
    key: "reciboCancelamento",
    dataIndex: "reciboCancelamento"
  },
  {
    title: "Dt. Canc. / Inut.",
    key: "cancellationtDate",
    dataIndex: "cancellationDate"
  },
  {
    title: "Operações",
    key: "actions",
    dataIndex: "actions"
  }
];
