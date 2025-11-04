import { useState, useEffect, useCallback } from "react";

import { receiptService } from "@/OLD/services/receipt.service";

import { useRouter } from "next/router";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";

import AddPayments from "../AddPayments";
import { useToast } from "infinity-forge";
import { DatePicker } from "@mui/x-date-pickers";
import { Button } from "infinity-forge";
import { Collapse, Table, Input, Select, Popconfirm } from "antd";
const { Panel } = Collapse;
const { Option } = Select;

import moment from "moment";
import { sortItems } from "@/OLD/utils/sortItems";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

function PaymentsPanel({
	payments,
	setReload,
	receipt,
	origin = false,
	setVisible,
	accountPlanId = false,
}) {
	const [data, setData] = useState<any>([]);
	const [blocks, setBlocks] = useState<any>([]);
	const [_, setLoading] = useState(false);
	const [editBlock, setEditBlock] = useState(false);
	const [formattedPayments, setFormattedPayments] = useState<any>([]);

	const { paymentMethods } = usePaymentMethods();

	const router = useRouter();
	const { createToast } = useToast();
	const finishReceiptPermission = useUserHasPermission("ENT07");
	const updatePaymentsPermission = useUserHasPermission("ENT05");
	const removePaymentsPermission = useUserHasPermission("ENT06");

	sortItems(paymentMethods, "description");

	useEffect(() => {
		const arr: any = [];
		payments?.map((item) => {
			if (!arr.includes(item?.block) && item?.status !== "Excluido") {
				arr.push(item?.block);
			}
		});
		setBlocks(arr);
	}, [payments]);

	const formatPayments = () => {
		setFormattedPayments(
			payments
				?.filter((payment) => payment?.status !== "Excluido")
				.map((payment, i) => {
					const paymentData: any = data?.find(
						(item) => item?.id === payment?.id,
					);

					return {
						flagDescription: paymentData?.flag,
						paymentMethodDescription: paymentData?.paymentMethod,
						block: paymentData?.block,
						date: (
							<DatePicker
								disabled={!(paymentData?.block === editBlock)}
								slotProps={{ textField: { variant: "standard" } }}
								value={paymentData?.expirationDate}
								onChange={(val) => {
									let newArr = [...data];
									newArr.splice(i, 1, {
										...data[i],
										expirationDate: val,
									});
									setData(newArr);
								}}
							/>
						),
						originValue: paymentData?.installmentValue,
						value: (
							<Input
								value={paymentData?.installmentValue}
								disabled={!(paymentData?.block === editBlock)}
								onChange={(e) => {
									let newArr = [...data];
									newArr.splice(i, 1, {
										...data[i],
										installmentValue: currencyFormatter(
											convertIntlCurrency(e.target.value),
										),
									});
									setData(newArr);
								}}
							/>
						),
						paymentMethod: (
							<Select
								className="uk-width-1-1"
								value={paymentData?.paymentMethod?.id}
								disabled={!(paymentData?.block === editBlock)}
								onChange={(val) => {
									let newArr = [...data];
									newArr.splice(i, 1, {
										...data[i],
										paymentMethod: val,
										flags: paymentMethods?.find((item) => item?.id === val)
											?.flags,
									});
									setData(newArr);
								}}
							>
								{paymentMethods?.map((pm) => (
									<Option value={pm?.id}>{pm?.description}</Option>
								))}
							</Select>
						),
						flag: (
							<Select
								disabled={!(paymentData?.block === editBlock)}
								value={paymentData?.tefFlagId}
								onChange={(val) => {
									let newArr = [...data];
									newArr.splice(i, 1, {
										...paymentData,
										tefFlagId: val,
										tefAcquiredId: data?.flags?.find(
											(item) => item?.flag?.id === val,
										)?.acquirer?.id,
									});
									setData(newArr);
								}}
							>
								{paymentData?.flags?.length > 0 &&
									paymentData?.flags?.map((flag) => (
										<Option value={flag?.flag?.id}>
											{flag?.flag?.description}
										</Option>
									))}
							</Select>
						),
						nsu: (
							<Input
								value={paymentData?.nsuDocument}
								disabled={!(paymentData?.block === editBlock)}
								onChange={(e) => {
									let newArr = [...data];
									newArr.splice(i, 1, {
										...paymentData,
										nsuDocument: e.target.value,
									});
									setData(newArr);
								}}
							/>
						),
					};
				}),
		);
	};

	useEffect(() => {
		payments?.length > 0 && formatPayments();
	}, [payments, paymentMethods, editBlock, data]);

	useEffect(() => {
		setData(
			payments
				?.filter((payment) => payment?.status !== "Excluido")
				.map((payment) => ({
					...payment,
					expirationDate: moment(payment?.expiration_date),
					installmentValue: currencyFormatter(payment?.installment_value),
					paymentMethod: payment?.payment_method || payment?.paymentMethod,
					nsuDocument: payment?.nsu_document,
					tefFlagId: payment?.flag?.id,
					flags: payment?.paymentMethod
						? paymentMethods?.find(
								(pm) => pm?.id === payment?.paymentMethod?.id,
							)?.flags
						: [],
					edit: false,
				})),
		);
	}, [payments, paymentMethods]);

	const paymentsColumns = [
		{ title: "Data", key: "date", dataIndex: "date" },
		{ title: "Valor", key: "value", dataIndex: "value" },
		{
			title: "Forma pagamento",
			key: "paymentMethod",
			dataIndex: "paymentMethod",
		},
		{
			title: "Comprovante/Nsu",
			key: "nsu",
			dataIndex: "nsu",
		},
		{
			title: "Bandeira",
			key: "flag",
			dataIndex: "flag",
		},
	];

	const submitPaymentUpdate = useCallback(() => {
		receiptService
			.updateReceiptPayment({
				items: data?.map((item) => ({
					receiptPaymentId: item?.id,
					paymentMethodId: item?.paymentMethod?.id || item?.paymentMethod,
					installmentValue: convertIntlCurrency(item?.installmentValue),
					expirationDate: moment(item?.expirationDate).toISOString(),
					nsuDocument: item?.nsuDocument,
					tefFlagId: item?.tefFlagId,
					tefAcquirerId: item?.tefAcquiredId,
				})),
			})
			.then((_res) => {
				setReload((prv) => !prv);
				setEditBlock(false);

				return createToast({
					status: "success",
					message: "Informações do pagamento atualizadas com sucesso!",
				});
			})
			.catch((err) => {
				if (err?.response?.data?.message) {
					return createToast({
						status: "error",
						message: err?.response?.data?.message?.split(":")[1],
					});
				}
			});
	}, [data]);

	const removePaymentBlock = (data) => {
		setLoading(true);

		receiptService
			.removePaymentBlock(data)
			.then((_res) => {
				setReload((prv) => !prv);
				setLoading(false);

				return createToast({
					status: "success",
					message: "Bloco removido com sucesso!",
				});
			})
			.catch((_err) => {
				setLoading(false);

				return createToast({
					status: "error",
					message: "Houve um erro ao remover o bloco de pagamento",
				});
			});
	};

	const submitFinishReceipt = useCallback(() => {
		setLoading(true);

		receiptService
			?.finishReceipt({ receiptId: receipt?.id })
			.then((res) => {
				setReload((prv) => !prv);
				setVisible(false);

				return createToast({
					status: "success",
					message: "Nota de entrada finalizada com sucesso",
				});
			})
			.catch((err) => {
				return createToast({
					status: "error",
					message: err?.response?.data?.message?.split(":")[1],
				});
			});
	}, [receipt?.id]);

	return (
		<>
			{!origin && (
				<AddPayments
					receipt={receipt}
					setReload={setReload}
					accountPlanId={accountPlanId}
				/>
			)}

			{payments?.filter((payment) => payment?.status !== "Excluido")?.length >
				0 &&
				blocks?.map((i) => {
					const paymentsList: any = formattedPayments?.filter(
						(item) => item?.block === i,
					);
					return (
						<Collapse className="uk-margin-small-top">
							<Panel
								key="test"
								header={
									<div>
										{paymentsList?.[0]?.paymentMethodDescription?.tef !== "NAO"
											? `
                      ${
												paymentsList?.[0]?.paymentMethodDescription?.tef !==
												"NAO"
													? paymentsList?.[0]?.paymentMethodDescription?.tef
													: ""
											}\n
                      CARTÃO ${
												paymentsList?.[0]?.paymentMethodDescription?.type
											} - ${
												paymentsList?.[0]?.flagDescription?.description || ""
											}
                      `
											: paymentsList?.[0]?.paymentMethodDescription
													?.description}{" "}
										{currencyFormatter(
											paymentsList?.reduce(
												(acc, current) =>
													acc + convertIntlCurrency(current?.originValue),
												0,
											),
										)}{" "}
										{paymentsList?.length}x
									</div>
								}
							>
								<div className=" uk-flex uk-flex-right">
									<Popconfirm
										title="Deseja remover este bloco?"
										onConfirm={() =>
											removePaymentBlock({
												receiptId: receipt?.id,
												block: i,
											})
										}
									>
										{paymentsList?.[0]?.block !== editBlock && (
											<>
												{removePaymentsPermission && (
													<Button
														className="uk-margin-small-right"
														text="Remover bloco"
													/>
												)}
											</>
										)}
									</Popconfirm>
									{paymentsList?.[0]?.block !== editBlock ? (
										<>
											{updatePaymentsPermission && (
												<Button
													text="Alterar dados"
													onClick={() => setEditBlock(paymentsList?.[0]?.block)}
												/>
											)}
										</>
									) : (
										<>
											<Button
												onClick={() => submitPaymentUpdate()}
												text="Salvar"
											/>

											<Button
												text="Cancelar"
												onClick={() => {
													setReload((prv) => !prv);
													setEditBlock(false);
												}}
											/>
										</>
									)}
								</div>
								<Table columns={paymentsColumns} dataSource={paymentsList} />
							</Panel>
						</Collapse>
					);
				})}
			<div
				className="uk-margin-small-top uk-flex uk-flex-right"
				style={{ display: "flex", gap: 10 }}
			>
				<Button
					text="Voltar"
					onClick={() => (setVisible ? setVisible(false) : router.back())}
				/>

				{finishReceiptPermission && (
					<Button onClick={() => submitFinishReceipt()} text="Finalizar nota" />
				)}
			</div>
		</>
	);
}

export default PaymentsPanel;
