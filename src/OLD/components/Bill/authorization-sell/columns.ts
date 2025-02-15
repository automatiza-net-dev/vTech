export const AUTH_COLUMNS = (cancelled: boolean) => [
  {
    title: "Qtd.",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Cód.Produto",
    dataIndex: "productCode",
    key: "productCode",
  },
  {
    title: "Descrição",
    dataIndex: "description",
    key: "description",
  },
  !cancelled ?{
    title: "Preço Unitário Cadastro",
    dataIndex: "singleRegistragionPrice",
    key: "singleRegistragionPrice",
  } : {},
  {
    title: "Preço Unitário Vendido",
    dataIndex: "singleSellingPrice",
    key: "singleSellingPrice",
  },
  {
    title: "Desconto Concedido",
    dataIndex: "grantedDiscount",
    key: "grantedDiscount",
  },
  !cancelled ?{
    title: "Desconto Max",
    dataIndex: "maxDiscount",
    key: "maxDiscount",
  } : {},
  {
    title: "Total Item",
    dataIndex: "totalItem",
    key: "totalItem",
  },
  {
    title: "Cortesia",
    dataIndex: "courtesy",
    key: "courtesy",
  },
  !cancelled ? {
    title: "Autorização",
    dataIndex: "authorization",
    key: "authorization",
  } : {},
];

export const paymentsColumns = [
  {
    title: "Data",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Valor",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Forma pagamento",
    dataIndex: "paymentMethodDescription",
    key: "paymentMethod",
  },
  {
    title: "Comprovante/NSU",
    dataIndex: "nsu",
    key: "nsu",
  },
  {
    title: "Dados Autorização",
    dataIndex: "authorization",
    key: "authorization",
  },
];
