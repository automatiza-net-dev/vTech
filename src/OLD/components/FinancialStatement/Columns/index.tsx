import { Checkbox } from "antd";
import { BsCheck, BsX } from "react-icons/bs";

export const Columns = (selectAllFinances) => [
	{
		title: "Tipo",
		dataIndex: "type",
		key: "type",
	},
	{
		title: "Doc",
		dataIndex: "document",
		key: "document",
	},
	{
		title: "Parc",
		key: "parc",
		dataIndex: "parc",
	},
	{
		title: "Pessoa",
		dataIndex: "client",
		key: "client",
	},
	{
		title: "Dt. emissão",
		dataIndex: "issueDate",
		key: "issueDate",
	},
	{
		title: "Dt. Venc.",
		dataIndex: "expirationDate",
		key: "expirationDate",
	},
	{
		title: "Competência",
		dataIndex: "competenceDate",
		key: "competenceDate",
	},
	{
		title: "R$ Total",
		dataIndex: "value",
		key: "value",
	},
	{
		title: "R$ Realizado",
		dataIndex: "paymentValue",
		key: "paymentValue",
	},
	{
		title: "Dt. Pagamento",
		dataIndex: "paymentDate",
		key: "paymentDate",
	},
	{
		title: "Forma de pagamento",
		dataIndex: "paymentMethod",
		key: "paymentMethod",
	},
	{
		title: "Nº Comp./NSU",
		dataIndex: "nsu",
		key: "nsu",
	},
	{
		title: "Aceite",
		dataIndex: "accept",
		key: "accept",
		render: (accept) =>
			accept === "SIM" ? (
				<BsCheck fontSize={25} />
			) : accept === "NAO" ? (
				<BsX fontSize={25} />
			) : null,
	},
	{
		title: (
			<>
				Ações&nbsp;
				<Checkbox onChange={(e) => selectAllFinances(e.target.checked)} />
			</>
		),
		dataIndex: "actions",
		key: "actions",
	},
];
