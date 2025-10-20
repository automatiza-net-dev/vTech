import { useRef } from "react";
import { useProfile } from "@/OLD/hooks/useProfile";
import { Container, RowBox } from "./styles";
import { Empty } from "antd";
import { PrintHeader } from "@/presentation";
import { Button } from "infinity-forge";

import { useReactToPrint } from "react-to-print";
import moment from "moment";

function PrintTable(props: {
	reports?: Record<string, string | null>[];
	label: string;
}) {
	const componentRef = useRef(null);
	const { clinic } = useProfile();

	const imprimir = useReactToPrint({ contentRef: componentRef });

	return (
		<>
			<Container ref={componentRef} className="uk-margin-small-top">
				<div className="clinic-header">
					<PrintHeader />
					<div className="uk-text-center">
						<h4 className="">{`Relatório de notas fiscais - ${clinic?.fantasy_name ?? "-"}`}</h4>
						<p className="report-subtitle">{props.label}</p>
					</div>
				</div>
				<div className="table-section">
					<section className="header-table">
						<div>Data Emissão</div>
						<div>NumeroNF</div>
						<div>ValorNF</div>
						<div>Tipo</div>
						<div>Status</div>
						<div>Venda</div>
						<div>Cliente</div>
					</section>
					{(props?.reports?.length ?? 0) > 0 ? (
						<section className="table-box">
							{props.reports?.map((item, idx) => (
								<RowBox key={item.tag + idx}>
									<div>{moment(item.dataemissao).format("DD/MM/YYYY")}</div>
									<div>{item.numeronf}</div>
									<div>{item.valornf}</div>
									<div>{item.tiponota}</div>
									<div>{item.status}</div>
									<div>{item.tag}</div>
									<div>{item.cliente}</div>
								</RowBox>
							))}
						</section>
					) : (
						<div className="uk-padding">
							<Empty />
						</div>
					)}
				</div>
				<section className="uk-margin-top uk-flex uk-flex-center"></section>
			</Container>
			<div className="uk-margin-top uk-flex uk-flex-right">
				<Button
					className="uk-margin-small-right"
					text="Imprimir"
					onClick={() => imprimir()}
				/>
			</div>
		</>
	);
}

export default PrintTable;
