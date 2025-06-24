import { useMemo, useRef } from "react";

import { Button, Empty } from "antd";
import { Container, RowBox } from "./styles";
import { PrintHeader } from "@/presentation";

import { useReactToPrint } from "react-to-print";
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";
import { reportsService } from "@/OLD/services/reports.service";

function PrintTable(props: {
	reports: Awaited<
		ReturnType<typeof reportsService.getCheckingAccountsReports>
	>["data"];
	filters: any;
}) {
	const componentRef = useRef<HTMLDivElement>(null);

	const imprimir = useReactToPrint({ contentRef: componentRef });

	const flatReport = useMemo(() => {
		if (!props.reports) {
			return [];
		}

		return props.reports.reduce(
			(acc, curr) => {
				for (const account of curr.checkingaccounts) {
					acc.push({
						id: [curr.id, account.id].join("-"),
						identification: curr.identification,
						description: account.description,
						account_number: account.account_number,
						bank_code: account.bank_code,
						agency: account.agency,
						type: account.type,
						active: "SIM",
						balance: account.balance,
					});
				}

				return acc;
			},
			[] as Record<string, string | number>[],
		);
	}, [props.reports]);

	return (
		<>
			<div style={{ display: "flex", justifyContent: "flex-end" }}>
				<Button onClick={() => imprimir()}>Imprimir</Button>
			</div>

			<Container ref={componentRef}>
				<div className="clinic-header">
					<PrintHeader />
					<div className="uk-text-center">
						<h4 className="">Relatório de fluxo de caixa</h4>
						{props.filters?.fromDate && props.filters?.toDate && (
							<div>
								Período: {moment(props.filters?.fromDate).format("DD/MM/YYYY")}{" "}
								à {moment(props.filters?.toDate).format("DD/MM/YYYY")}
							</div>
						)}
					</div>
				</div>
				<div className="table-section uk-margin-top">
					<section className="header-table">
						<div>Unidade de Negócios</div>
						<div>Descrição</div>
						<div>Cod. Conta</div>
						<div>Banco</div>
						<div>Agência</div>
						<div>Tipo</div>
						<div>Ativo</div>
						<div>Saldo</div>
					</section>
					{flatReport.length > 0 ? (
						<section className="table-box">
							{flatReport?.map((item) => (
								<RowBox key={item.id}>
									<div>{item.identification}</div>
									<div>{item.description}</div>
									<div>{item.account_number}</div>
									<div>{item.bank_code}</div>
									<div>{item.agency}</div>
									<div>{item.type}</div>
									<div>{item.active}</div>
									<div>{currencyFormatter(item.balance)}</div>
								</RowBox>
							))}
						</section>
					) : (
						<div className="uk-padding">
							<Empty />
						</div>
					)}
				</div>
			</Container>
		</>
	);
}

export default PrintTable;
