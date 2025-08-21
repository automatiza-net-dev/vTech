import {
	Accordion,
	Accordions,
	Button,
	FormHandler,
	LoaderCircle,
	formatNumberToCurrency,
	useAuthAdmin,
} from "infinity-forge";

import { negotiationSchema } from "./schema";
import { useNegotiation } from "./hooks/useNegotiation";
import { NegotiationInfos, BudgetsList, Document } from "./components";

import { GerarDocumentoVenda } from "@/OLD/components/Bill/Actions/gerar-documento-venda";

import { NegotiationCardProps } from "./interfaces";

import * as S from "./styles";
import { ItemsExecutions } from "./components/itens-executions";
import ConvertBillToTreatment from "@/OLD/components/Bill/Actions/ConvertBillToTreatment";
import { BillsList } from "./components/bills-list";

export function NegotiationCard(props: NegotiationCardProps) {
	const { confirmBill, queryClient, router, createToast } = useNegotiation();
	const { user } = useAuthAdmin();

	const { id, budgets, negotiation, bills, isFetching, documents, treatments } =
		props;

	const open = negotiation?.id === id;

	const hasOpenedBudget = budgets.some(
		(budget) => budget.status === "ABERTO" || budget.status === "Nao Aprovada",
	);

	const confirmedBudget = budgets.find(
		(budget) => budget.status === "CONFIRMADO",
	);

	const hasDisplayPermission: boolean =
		user.unit.configs.businessUnits.treatments;
	console.log({
		hasDisplayPermission,
		bills,
	});

	return (
		<S.NegotiationCard
			className={open ? "open" : ""}
			style={{ borderWidth: open ? "3px" : "1px" }}
		>
			<NegotiationInfos
				negotiation={props}
				onClick={() => props.setNegotiation(props)}
			>
				<div style={{ height: 10 }} />

				<Accordion title="Orçamentos">
					{isFetching ? (
						<LoaderCircle size={30} color="#444" />
					) : (
						<FormHandler
							debugMode
							disableEnterKeySubmitForm
							cleanFieldsOnSubmit={false}
							schema={negotiationSchema}
							initialData={{
								budgets: budgets.map((budget) => {
									return { ...budget, checked: false };
								}),
							}}
							onSucess={confirmBill}
							button={
								hasOpenedBudget ? { text: "Confirmar orçamento" } : undefined
							}
						>
							<div className="budgets">
								<BudgetsList
									hasOpenedBudget={hasOpenedBudget}
									tutors={props?.tutors}
								/>
							</div>
						</FormHandler>
					)}
				</Accordion>

				<Accordion title="Vendas">
					<div className="budgets">
						<BillsList {...props} />
					</div>

					{hasDisplayPermission && (
						<ConvertBillToTreatment
							bill={bills?.[0] as any}
							CustomComponent={({ onClick }) => (
								<div style={{ marginRight: 20 }}>
									<Button
										type="button"
										onClick={async () => {
											await onClick();

											queryClient.invalidateQueries({
												queryKey: [
													"openNegotiations",
													router?.query?.id as string,
												],
											});
										}}
										text="Gerar tratamento"
									/>
								</div>
							)}
						/>
					)}

					{bills?.[0]?.id &&
						!hasOpenedBudget &&
						(!documents || documents.length === 0) && (
							<GerarDocumentoVenda
								bill={bills?.[0]}
								client={confirmedBudget?.client}
								button={
									<Button type="button" text="Gerar Documentos Negociação" />
								}
								onSuccess={() => {
									queryClient.invalidateQueries({
										queryKey: ["openNegotiations", router?.query?.id as string],
									});

									createToast({
										message: "Documentos gerados com sucesso",
										status: "success",
									});
								}}
							/>
						)}
				</Accordion>

				<Accordion title="Documentos">
					<div className="list">
						<div className="head">
							<h3>Documentos</h3>
							<h3>Gerado por</h3>
							<h3 className="dados">Dados impressão</h3>
						</div>

						<div className="body">
							{documents &&
								documents.length > 0 &&
								documents.map((document) => (
									<Document key={document.id} {...document} />
								))}
						</div>
					</div>
				</Accordion>

				<Accordion title="Itens de tratamento">
					{treatments && treatments.length > 0 && (
						<div className="list">
							<div className="head">
								<h3>Itens e Execuções</h3>
								<h3>Dados Agendamento</h3>
								<h3>Dados Execução</h3>
							</div>
							<div className="body">
								{treatments.map((treatment) =>
									treatment?.items.map((item, i) => (
										<div
											className="executions-box"
											key={item?.description + treatment?.id + i}
										>
											<h3>{item?.description}</h3>
											{item?.executions?.map((execution) => (
												<ItemsExecutions
													execution={execution}
													key={"treatment-card" + execution?.schedule_id}
												/>
											))}
										</div>
									)),
								)}
							</div>
						</div>
					)}
				</Accordion>
			</NegotiationInfos>
		</S.NegotiationCard>
	);
}
