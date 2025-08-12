// @ts-nocheck
// Core
import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";

// Services
import { financesService } from "@/OLD/services/finances.service";

import CreateBankingTransaction from "@/OLD/components/Banking/Create";

// Hooks
import {
	useGroupedFinances,
	useShowFinance,
	useFinancesBalance,
} from "@/OLD/hooks/useFinances";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { usePlans } from "@/OLD/hooks/usePlans";
import { useTutor } from "@/OLD/hooks/useTutor";
import { useSuppliers } from "@/OLD/hooks/useSuppliers";
import { useClinic } from "@/OLD/hooks/useClinics";
import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";
import { useTefFlags } from "@/OLD/hooks/useTefFlags";
import { useProfile } from "@/OLD/hooks/useProfile";

// Utils
import { Columns } from "./Columns";
import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { accessControlTitles } from "@/OLD/utils/generalUtils";
import ReactToPrint, { useReactToPrint } from "react-to-print";

// Icons
import { Reload } from "styled-icons/zondicons";

// Components
import { Container } from "./styles";
import { Button, PageWrapper, useToast } from "infinity-forge";
import { Table, Modal } from "antd";
import TitlesFilters from "./TitlesFilters";
import FinancesActions from "@/OLD/components/Titles/Actions";
import BorderoActions from "./Actions/BorderoActions";
import ButtonsPanel from "./ButtonsPanel";
import AccessDenied from "@/OLD/components/AccessDenied";
import PrintScreen from "./PrintScreen";
import GroupActions from "./Actions/GroupActions";
import Edit from "@/OLD/components/Titles/Actions/Edit";
import BorderoDetails from "@/OLD/components/Titles/DetailsBordero";
import PaymentGroupDetails from "./Details";
import CreateTitle from "@/OLD/components/Titles/Create";

// Utils
import * as XLSX from "xlsx/xlsx.mjs";

const FinancialSteatment = memo(function Titles({ type }: any) {
	const [filters, setFilters] = useState({
		order: "expiration_date",
		status: "",
		iterationDateFrom: new Date(),
		iterationDateTo: new Date(),
		noSearch: true,
		type: "",
		groupBorderos: "sim",
		accept: "",
		reconciled: "",
	});

	const [reload, setReload] = useState(false);
	const [formatedFinances, setFormatedFinances] = useState([]);
	const [suppliersFilters, setSuppliersFilters] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [updateOpen, setUpdateOpen] = useState(false);
	const [edit, setEdit] = useState(false);
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);
	const [borderoDetailsVisible, setBorderoDetailsVisible] = useState(false);
	const [selectedBorderoId, setSelectedBorderoId] = useState(false);
	const [groupDetailsVisible, setGroupDetailsVisible] = useState(false);
	const [groupData, setGroupData] = useState({});
	const [checkingAccountId, setCheckingAccountId] = useState(false);
	const [createTitleVisible, setCreateTitleVisible] = useState(false);
	const [createTransferenceVisible, setCreateTransferenceVisible] =
		useState(false);
	const [id, setId] = useState([]);

	const { createToast } = useToast();

	const { finances, loadingFinances } = useGroupedFinances(filters, reload);
	const { paymentMethods } = usePaymentMethods();
	const { plans } = usePlans();
	const { tutors } = useTutor(false, false);
	const { suppliers } = useSuppliers(suppliersFilters, false);
	const { clinics } = useClinic(Reload);
	const { titles, setTitles } = useAuth();
	const { tefFlags } = useTefFlags(false, "");
	const { finances: finance } = useShowFinance(id, reload, updateOpen);
	const { balance } = useFinancesBalance(filters);
	const { clinic } = useProfile();
	const [unit, setUnit] = useState({ unit: clinic?.id });
	const { checkingAccounts } = useCheckingAccounts(unit as any);

	const createTitlePermission = useUserHasPermission(
		`${accessControlTitles(type)}01`,
	);
	const listTitlesPermission = useUserHasPermission(
		`${accessControlTitles(type)}00`,
	);

	const router = useRouter();
	const componentRef = useRef();

	const handleExport = () => {
		const formatted = finances?.map((item) => ({
			documento: item?.document,
			parcela: `${item?.installment} / ${item?.qty_installments}`,
			nota_fiscal: item?.fiscal_note,
			pessoa: item?.client,
			emissao: item?.issue_date
				? moment(item?.issue_date).format("DD/MM/YYYY")
				: "-",
			valor: item?.value,
			dt_vencimento: item?.expiration_date
				? moment(item?.expiration_date, "YYYY-MM-DD[T]HH:mm:ss").format(
						"DD/MM/YYYY",
					)
				: "-",
			valor_pago: item?.payment_value ? item?.payment_value : "-",
			data_pagamento: item?.payment_date
				? moment(item?.payment_date).format("DD/MM/YYYY")
				: "-",
			forma_de_pagamento: item?.payment_method,
			"nsu/comprovante": item?.nsu_document,
		}));

		let wb = XLSX.utils.book_new(),
			ws = XLSX.utils.json_to_sheet(formatted);

		XLSX.utils.book_append_sheet(wb, ws, "Pág " + "1");

		XLSX.writeFile(
			wb,
			`Titulos - ${type === "receive" ? "Crédito" : "Débito"}` + ".xlsx",
		);
	};

	const formatFinances = (recentDown = false) => {
		setFormatedFinances(
			finances.map((finance) => {
				{
					/*
        if (recentDown) {
          const ids = titles.map((item) => item?.id);
          
          if (!ids.includes(finance.id)) {
            return;
          }
        }
      */
				}

				return {
					...finance,
					document:
						finance?.source === "GROUP" ? (
							<span
								onClick={() => {
									setCheckingAccountId(
										finance?.payment_methods_checking_account_id,
									);
									setGroupData({
										type: finance?.type,
										expirationDate: moment(
											finance?.expiration_date,
											"YYYY-MM-DD[T]HH:mm:ss",
										).format("YYYY-MM-DD"),
										paymentMethodId: finance?.payment_method_id,
										tefFlagId: finance?.tef_flag_id,
										tefAcquirerId: finance?.tef_adquirente_id || false,
										paymentDate: finance?.payment_date
											? moment(
													finance?.payment_date,
													"YYYY-MM-DD[T]HH:mm:ss",
												).format("YYYY-MM-DD")
											: null,
									});
									setGroupDetailsVisible(true);
								}}
								className="uk-link"
							>
								{finance?.document || "Doc"}
							</span>
						) : (
							<span
								onClick={() => {
									if (finance?.source === "FINANCE") {
										setId([finance?.id]);
										setData({
											id: finance?.id,
											type: finance?.type,
										});
										setEdit(false);
										return setUpdateOpen(true);
									}
									if (finance?.source === "BORDERO") {
										setSelectedBorderoId(finance?.id);
										setBorderoDetailsVisible(true);
										setEdit(false);
									}
								}}
								className="uk-link"
							>
								{finance?.document}
							</span>
						),
					type: finance?.type?.split("")[0],
					parc:
						finance?.source === "FINANCE"
							? `${finance?.installment} / ${finance?.qty_installments}`
							: finance?.qty_installments,
					fiscalNote: finance?.fiscal_note || "-",
					accept: finance.accept,
					client: finance?.client || finance?.historic || "-",
					issueDate: finance?.issue_date
						? moment(finance?.issue_date).format("DD/MM/YYYY")
						: "-",
					value: (
						<span
							style={{
								color: finance?.type === "CREDITO" ? "blue" : "red",
							}}
						>
							{currencyFormatter(finance?.total_value)}
						</span>
					),
					expirationDate: finance?.expiration_date
						? moment(finance?.expiration_date, "YYYY-MM-DD[T]HH:mm:ss").format(
								"DD/MM/YYYY",
							)
						: "-",
					paymentValue: currencyFormatter(
						finance?.payment_value ? finance?.payment_value : 0,
					),
					paymentDate: finance?.payment_date
						? moment(finance?.payment_date, "YYYY-MM-DD[T]HH:mm:ss").format(
								"DD/MM/YYYY",
							)
						: "-",
					paymentMethod: finance?.payment_method
						? `${finance?.payment_method} ${
								finance?.tef_flag ? ` - ${finance?.tef_flag}` : ""
							}`
						: "-",
					nsu: finance?.nsu_document || "-",
					actions: (
						<>
							{finance?.source === "FINANCE" && (
								<FinancesActions
									financeId={finance?.id}
									completeFinance={finance}
									reload={reload}
									setReload={setReload}
									type={type === "receive" ? "CREDITO" : "DEBITO"}
								/>
							)}
							{finance?.source === "BORDERO" && (
								<BorderoActions
									bordero={finance}
									type={type === "receive" ? "CREDITO" : "DEBITO"}
									setReload={setReload}
								/>
							)}
							{finance?.source === "GROUP" && (
								<GroupActions group={finance} setReload={setReload} />
							)}
						</>
					),
				};
			}),
		);
		{
			if (recentDown) {
				{
					/* setFormatedFinances((prv) => prv.filter((item) => ite)); }*/
				}

				setFilters({ ...filters, noSearch: true });
				setFormatedFinances([]);
			}
		}
	};

	const selectAllFinances = (select) => {
		if (select) {
			setTitles(
				finances?.filter(
					(finance, i) =>
						i >= (currentPage - 1) * 10 &&
						currentPage < currentPage * 10 &&
						finance?.source === "FINANCE",
				),
			);
		} else {
			setTitles([]);
		}
	};

	const submitUpdate = useCallback(() => {
		let error = false;
		setLoading(true);
		const newObj = {
			...data,
			competenceDate: moment(data?.competenceDate).format("MM/YYYY"),
		};

		delete newObj?.client;
		delete newObj?.document;

		if (!newObj?.accountPlanId) {
			return createToast({
				status: "warning",
				message: "Plano de contas obrigatório",
			});
		}

		financesService
			.update(data?.id, {
				...newObj,
				originalValue: convertIntlCurrency(newObj.value),
				feeValue: convertIntlCurrency(newObj.feeValue),
				discountValue: convertIntlCurrency(newObj.discountValue),
				value: convertIntlCurrency(newObj?.value),
			})
			.then((_res) => {
				setEdit(false);
				createToast({
					status: "success",
					message: "Parcela atualizada com sucesso!",
				});
			})
			.catch((err) => {
				error = true;
				setLoading(false);
				if (err?.response?.data?.message) {
					const messageArr = err?.response?.data?.message.split(":");

					return createToast({ status: "error", message: messageArr[1] });
				}

				return createToast({
					status: "error",
					message: "Houve um erro ao atualizar a parcela selecionada...",
				});
			})
			.finally(() => {
				setLoading(false);
				if (!error) {
					setReload(!reload);
					setUpdateOpen(false);
				}
			});
	}, [data]);

	useEffect(() => {
		if (titles.length === 0) {
			formatFinances();
		}
	}, [finances, reload]);

	useEffect(() => {
		if (finance?.length > 0 && updateOpen) {
			setData({
				id: data?.id[0],
				installment: finance[0]?.installment,
				value: currencyFormatter(finance[0]?.value),
				feeValue: finance[0]?.fee_value
					? currencyFormatter(finance[0]?.fee_value)
					: currencyFormatter(0),
				feePercentage: finance[0]?.fee_percentage || 0,
				discountPercentage: finance[0]?.discount_percentage || 0,
				discountValue: finance[0]?.discount_value
					? currencyFormatter(finance[0]?.discount_value)
					: currencyFormatter(0),
				issueDate: moment(finance[0]?.issue_date),
				expirationDate: moment(finance[0]?.expiration_date),
				paymentMethodId: finance[0]?.paymentMethod?.id,
				accountPlanId: finance[0]?.accountPlan?.id,
				userDocument: finance[0]?.user_document,
				barCode: finance[0]?.bar_code,
				bank: finance[0]?.bank,
				agency: finance[0]?.agency,
				account: finance[0]?.account,
				nsuDocument: finance[0]?.nsu_document,
				historic: finance[0]?.historic,
				reconciled: finance[0]?.reconciled,
				status: finance[0]?.status,
				client: finance[0]?.client?.name,
				document: finance[0]?.document,
				competenceDate: moment(finance[0]?.competence_date, "MM/YYYY"),
				fiscalNote: finance[0]?.fiscal_note,
				checkingAccountId: finance[0]?.checkingAccount?.id,
				tefFlagId: finance[0]?.flag?.id,
				originalValue: currencyFormatter(finance[0]?.original_value),
				feePaymentMethod: currencyFormatter(finance[0]?.fee_discount_value),
				value: currencyFormatter(finance[0]?.value),
				feePaymentPercentage: finance[0]?.fee_discount_percentage,
				type: finance[0]?.type,
			});
		}
	}, [finance, updateOpen]);

	const imprimir = useReactToPrint({ contentRef: componentRef });

	return !listTitlesPermission || listTitlesPermission === "loading" ? (
		<AccessDenied loading={listTitlesPermission} />
	) : (
		<PageWrapper title="Controle financeiro">
			<Container>
				<TitlesFilters
					setCreateTransferenceVisible={setCreateTransferenceVisible}
					setCreateTitleVisible={setCreateTitleVisible}
					isLoading={loadingFinances}
					type={type}
					tefFlags={tefFlags}
					checkingAccounts={checkingAccounts}
					filters={filters}
					setFilters={setFilters}
					paymentMethods={paymentMethods}
					tutors={tutors}
					suppliers={suppliers}
					plans={plans.filter((plan) => {
						if (type === "receive") {
							return plan?.type === "CREDITO";
						} else {
							return plan?.type === "DEBITO";
						}
					})}
					reload={reload}
					setReload={setReload}
					clinics={clinics}
					loadingFinances={loadingFinances}
				/>
				<hr />
				<div className="uk-width-1-1">
					<div className="uk-flex uk-flex-right">
						Saldo{" "}
						{filters?.checkingAccountId
							? `Conta corrente ${
									checkingAccounts.find(
										(account) => account?.id === filters?.checkingAccountId,
									)?.description
								}: `
							: `unidade ${clinic?.fantasy_name}: `}
						{currencyFormatter(balance?.balance)}
					</div>
				</div>
				{titles?.length > 0 && (
					<ButtonsPanel
						setReload={setReload}
						type={type}
						setFilters={setFilters}
					/>
				)}
				<Table
					pagination={{ onChange: (page) => setCurrentPage(page) }}
					columns={Columns(selectAllFinances)}
					dataSource={formatedFinances}
					footer={() => (
						<footer className="uk-flex uk-flex-center">
							<div className="uk-flex uk-flex-around custom-footer-box">
								<div className="uk-width-1-2 uk-margin-right">
									<strong>Total Crédito:&nbsp;</strong>
									{currencyFormatter(
										finances?.length > 0 &&
											finances
												?.filter((finance) => finance?.type === "CREDITO")
												.reduce(
													(acc, current) => acc + current?.total_value,
													0,
												),
									)}
								</div>
								<div className="uk-width-1-2 uk-margin-right">
									<strong>Total Realizado Crédito:&nbsp;</strong>
									{currencyFormatter(
										finances?.length > 0 &&
											finances
												?.filter((finance) => finance?.type === "CREDITO")
												.reduce(
													(acc, current) => acc + current?.payment_value,
													0,
												),
									)}
								</div>
								<div className="uk-width-1-2 uk-margin-right">
									<strong>Total a receber Crédito:&nbsp;</strong>
									{currencyFormatter(
										finances?.length > 0 &&
											finances
												?.filter(
													(finance) =>
														finance?.type === "CREDITO" &&
														finance?.status === "ABERTO",
												)
												.reduce(
													(acc, current) => acc + current?.total_value,
													0,
												),
									)}
								</div>
								<div className="uk-width-1-2 uk-margin-right">
									<strong>Total Debitos:&nbsp;</strong>
									{currencyFormatter(
										finances?.length > 0 &&
											finances
												?.filter((finance) => finance?.type === "DEBITO")
												.reduce(
													(acc, current) => acc + current?.total_value,
													0,
												),
									)}
								</div>
								<div className="uk-width-1-2 uk-margin-right">
									<strong>Total a vencer Debitos:&nbsp;</strong>
									{currencyFormatter(
										finances?.length > 0 &&
											finances
												?.filter(
													(finance) =>
														finance?.type === "DEBITO" &&
														finance?.status === "Aberto",
												)
												.reduce(
													(acc, current) => acc + current?.total_value,
													0,
												),
									)}
								</div>
							</div>
						</footer>
					)}
				/>
				<div style={{ display: "none" }}>
					<div ref={componentRef}>
						<PrintScreen data={finances} loading={loadingFinances} />
					</div>
				</div>
				<div
					className="uk-flex uk-flex-right uk-margin-small-top"
					style={{ gap: 20 }}
				>
					<Button text="Exportar (Excel)" onClick={() => handleExport()} />

					<Button text="Imprimir" onClick={() => imprimir()} />
				</div>
				{updateOpen && (
					<Modal
						title={`Informações do título - ${finance[0]?.document} - ${finance[0]?.installment} / ${finance[0]?.qty_installments}`}
						width={1200}
						visible={updateOpen}
						onCancel={() => setUpdateOpen(false)}
						footer={null}
					>
						<Edit
							data={data}
							setData={setData}
							paymentMethods={paymentMethods}
							plans={plans.filter((plan) => plan?.type === data?.type)}
							submit={submitUpdate}
							setVisible={setUpdateOpen}
							edit={edit}
							setEdit={setEdit}
							source={"finances"}
						/>
					</Modal>
				)}
				{borderoDetailsVisible && (
					<Modal
						visible={borderoDetailsVisible}
						title="Detalhes bordero"
						width={1200}
						footer={null}
						onCancel={() => setBorderoDetailsVisible(false)}
					>
						<BorderoDetails
							borderoId={selectedBorderoId}
							setVisible={setBorderoDetailsVisible}
						/>
					</Modal>
				)}
				{groupDetailsVisible && (
					<Modal
						visible={groupDetailsVisible}
						title="Grupo de pagamento"
						width={1200}
						footer={null}
						onCancel={() => setGroupDetailsVisible(false)}
					>
						<PaymentGroupDetails
							reload={reload}
							setReload={setReload}
							setGroupData={setGroupData}
							groupData={groupData}
							setVisible={setGroupDetailsVisible}
							checkingAccountId={checkingAccountId}
							setCheckingAccountId={setCheckingAccountId}
						/>
					</Modal>
				)}
				<Modal
					title="Novo título"
					onCancel={() => setCreateTitleVisible(false)}
					visible={createTitleVisible}
					width={1200}
					footer={null}
				>
					<CreateTitle setVisible={setCreateTitleVisible} />
				</Modal>
				<Modal
					title="Nova transferência"
					onCancel={() => setCreateTransferenceVisible(false)}
					visible={createTransferenceVisible}
					width={1200}
					footer={null}
				>
					<CreateBankingTransaction
						cleanUp={() => {
							setCreateTransferenceVisible(false);
						}}
					/>
				</Modal>
			</Container>
		</PageWrapper>
	);
});

export default FinancialSteatment;
