import React, { memo, useState, useCallback, useEffect } from "react";

import moment from "moment";

import { usePlans } from "@/OLD/hooks/usePlans";
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";
import { useTutor } from "@/OLD/hooks/useTutor";

import { bankingService } from "@/OLD/services/banking.service";

import { Container } from "./styles";
import { api, Button, PageWrapper } from "infinity-forge";
import { Input, DatePicker, Radio, Select, AutoComplete } from "antd";

import { useToast } from "infinity-forge";
import { useQuery } from "infinity-forge";
import { AxiosError } from "axios";

const { Group } = Radio;
const { Option } = Select;

const Create = memo(function FormChild({ cleanUp }: { cleanUp: () => void }) {
	const [data, setData] = useState<any>({
		type: "transaction",
		reconciled: "true",
		feeValue: 0,
		feePercentage: 0,
		discountValue: 0,
		discountPercentage: 0,
	});
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [loading, setLoading] = useState(false);
	const [formatedTutors, setFormatedTutors] = useState<any[]>([]);
	const { plans } = usePlans();
	const { checkingAccounts } = useCheckingAccounts();
	const { tutors } = useTutor(false, false);
	const { paymentMethods } = usePaymentMethods(false, false);

	// const router = useRouter();
	const { createToast } = useToast();

	const createTransaction = useCallback(async () => {
		setLoading(true);
		let error = false;

		try {
			await bankingService.createBanking({
				...data,
				type: "DEBITO",
				originFlag: "FINANCEIRO",
				issueDate: moment(data?.issueDate).toISOString(),
				competenceDate: moment(data?.competenceDate).format("MM/YYYY"),
			});

			setLoading(false);
			setData({});
			cleanUp();
			// router.back();

			createToast({
				status: "success",
				message: "Transação salva com sucesso",
			});
		} catch (err: any) {
			const errorMessage =
				err?.response?.data?.errors[0]?.message || "Erro desconhecido";
			setLoading(false);

			createToast({
				status: "error",
				message: errorMessage,
			});

			if (err instanceof AxiosError) {
				if (
					"errors" in err.response?.data &&
					Array.isArray(err.response?.data.errors)
				) {
					setErrors(
						err.response.data.errors.reduce((acc, curr) => {
							if (!acc[curr.field]) {
								acc[curr.field] = [];
							}

							acc[curr.field].push(curr.message);

							return acc;
						}, {}),
					);
				}
			}
		}
	}, [data]);

	const formatTutors = () => {
		setFormatedTutors(
			tutors.map((tutor: any) => {
				return {
					...tutor,
					value: tutor?.name,
				};
			}),
		);
	};

	useEffect(() => {
		tutors?.length > 0 && formatTutors();
	}, [tutors]);

	const patientSuppliers = useQuery({
		queryKey: ["patient-suppliers"],
		queryFn: async () => {
			const response = await api({ url: "patient-suppliers", method: "get" });
			return response;
		},
	});

	const normalize = (text: string) => text?.toLowerCase().normalize("NFD");

	const [flags, setFlags] = useState([]);

	useEffect(() => {
		setFlags(
			paymentMethods.find((method) => method?.id === data?.paymentMethodId)
				?.flags,
		);
	}, [data, paymentMethods]);

	const tfeAquires = useQuery({
		queryKey: ["tfeAquires"],
		queryFn: async () => {
			const response = await api({
				method: "get",
				url: `payment-methods/tef-acquirers`,
			});

			return response;
		},
	});

	return (
		<PageWrapper title="Movimentação bancária">
			<Container>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						createTransaction();
					}}
				>
					<div className="form-body uk-padding uk-margin-top">
						<div className="uk-flex">
							<div className="uk-margin-small-right uk-width-1-1">
								<label>CPF/CNPJ ou nome do Titular</label>

								{patientSuppliers?.data && (
									<AutoComplete
										options={
											patientSuppliers?.data
												? [
														...patientSuppliers?.data?.map((item) => ({
															...item,
															value: item?.name,
														})),
														...formatedTutors,
													]
												: formatedTutors
										}
										className="uk-width-1-1"
										value={data?.userName}
										onChange={(e) => setData({ ...data, userName: e })}
										onSelect={(inputValue, option) =>
											setData({
												...data,
												userName: inputValue,
												clientId: option?.id,
											})
										}
										filterOption={(inputValue, option) => {
											const normalize = (str) =>
												str
													?.normalize("NFD")
													.replace(/[\u0300-\u036f]/g, "")
													.toLowerCase();

											const input = normalize(inputValue);
											const name = normalize(option?.name || "");
											const document = normalize(
												option?.tutor?.document || option?.document || "",
											);

											return name.includes(input) || document.includes(input);
										}}
									/>
								)}

								{errors["clientId"] && (
									<p style={{ color: "red" }}>
										{errors["clientId"].join(", ")}
									</p>
								)}
							</div>
							<div className="uk-margin-right">
								<label>Data emissão</label>
								<DatePicker
									className="uk-width-1-1"
									format="DD/MM/YYYY"
									value={data?.issueDate ? moment(data.issueDate) : moment()}
									onChange={(e) => setData({ ...data, issueDate: e })}
								/>
								{errors["issueDate"] && (
									<p style={{ color: "red" }}>
										{errors["issueDate"].join(", ")}
									</p>
								)}
							</div>
							<div>
								<label>Mês/Ano Competência</label>
								<DatePicker
									className="uk-width-1-1"
									format="MM/YYYY"
									picker="month"
									value={
										data?.competenceDate
											? moment(data?.competenceDate)
											: data?.issueDate
												? moment(data.issueDate)
												: moment()
									}
									onChange={(e) => setData({ ...data, competenceDate: e })}
								/>
								{errors["competenceDate"] && (
									<p style={{ color: "red" }}>
										{errors["competenceDate"].join(", ")}
									</p>
								)}
							</div>
						</div>
						<div className="uk-flex uk-margin-top">
							<div className="uk-margin-xlarge-right">
								<label>Conciliado</label>
								<br />
								<Group
									defaultValue="true"
									onChange={(e) =>
										setData({ ...data, reconciled: e.target.value })
									}
								>
									<Radio value="true">Sim</Radio>
									<Radio value="false">Não</Radio>
								</Group>

								{errors["reconciled"] && (
									<p style={{ color: "red" }}>
										{errors["reconciled"].join(", ")}
									</p>
								)}
							</div>
						</div>
						<div className="uk-flex uk-margin-top">
							<div className="uk-margin-right">
								<label>Documento</label>
								<Input
									onChange={(e) =>
										setData({ ...data, document: e.target.value })
									}
									value={data?.document}
								/>
								{errors["document"] && (
									<p style={{ color: "red" }}>
										{errors["document"].join(", ")}
									</p>
								)}
							</div>
							<div className="uk-margin-right">
								<label>Valor Lançamento</label>
								<Input
									type="number"
									onChange={(e) =>
										setData({ ...data, documentValue: e.target.value })
									}
									value={data?.documentValue}
								/>
								{errors["documentValue"] && (
									<p style={{ color: "red" }}>
										{errors["documentValue"].join(", ")}
									</p>
								)}
							</div>
							<div>
								<label>Historico</label>
								<Input
									onChange={(e) =>
										setData({ ...data, historic: e.target.value })
									}
									value={data?.historic}
								/>
								{errors["historic"] && (
									<p style={{ color: "red" }}>
										{errors["historic"].join(", ")}
									</p>
								)}
							</div>
						</div>
						<div className="uk-flex uk-margin-top">
							<div className="uk-width-1-6 uk-margin-right">
								<label>R$ Juros</label>
								<Input
									type="number"
									value={data?.feeValue}
									onChange={(e) =>
										setData({ ...data, feeValue: e.target.value })
									}
								/>
								{errors["feeValue"] && (
									<p style={{ color: "red" }}>
										{errors["feeValue"].join(", ")}
									</p>
								)}
							</div>
							<div className="uk-width-1-6 uk-margin-right">
								<label>% Juros</label>
								<Input
									type="number"
									value={data?.feePercentage}
									onChange={(e) =>
										setData({ ...data, feePercentage: e.target.value })
									}
								/>
								{errors["feePercentage"] && (
									<p style={{ color: "red" }}>
										{errors["feePercentage"].join(", ")}
									</p>
								)}
							</div>
							<div className="uk-width-1-6 uk-margin-right">
								<label>R$ Desconto</label>
								<Input
									type="number"
									value={data?.discountValue}
									onChange={(e) =>
										setData({ ...data, discountValue: e.target.value })
									}
								/>
								{errors["discountValue"] && (
									<p style={{ color: "red" }}>
										{errors["discountValue"].join(", ")}
									</p>
								)}
							</div>
							<div className="uk-width-1-6 uk-margin-right">
								<label>% Desconto</label>
								<Input
									type="number"
									value={data?.discountPercentage}
									onChange={(e) =>
										setData({ ...data, discountPercentage: e.target.value })
									}
								/>
								{errors["discountPercentage"] && (
									<p style={{ color: "red" }}>
										{errors["discountPercentage"].join(", ")}
									</p>
								)}
							</div>
						</div>
						<div
							className="uk-flex uk-flex-wrap uk-margin-top uk-width-1-1"
							style={{
								gap: 10,
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
							}}
						>
							<div>
								<label>Forma Pagamento</label>
								<Select
									className="uk-width-1-1"
									value={data?.paymentMethodId}
									showSearch
									onChange={(e) => {
										setData({ ...data, paymentMethodId: e });
									}}
									optionFilterProp="children"
									filterOption={(input, option) => {
										const normalizedInput = normalize(input);
										const normalizedOption = normalize(
											option?.children?.toString() || "",
										);
										return normalizedOption.includes(normalizedInput);
									}}
								>
									{paymentMethods.length > 0 &&
										paymentMethods.map((method, i) => (
											<Option key={"paymentMethods" + i} value={method.id}>
												{method?.description}
											</Option>
										))}
								</Select>
								{errors["paymentMethodId"] && (
									<p style={{ color: "red" }}>
										{errors["paymentMethodId"].join(", ")}
									</p>
								)}
							</div>

							<div>
								<label>Bandeira Tef</label>
								<Select
									className="uk-width-1-1"
									options={flags?.map((flag: any) => ({
										label: flag?.flag?.description,
										value: flag?.flag?.id,
									}))}
									value={data?.tefFlagId}
									onChange={(value) => {
										setData({ ...data, tefFlagId: value });
									}}
								/>
								{errors["tefFlagId"] && (
									<p style={{ color: "red" }}>
										{errors["tefFlagId"].join(", ")}
									</p>
								)}
							</div>

							<div>
								<label>Adquirente Tef</label>
								<Select
									className="uk-width-1-1"
									options={
										tfeAquires?.data?.map((item) => ({
											label: item?.description,
											value: item.id,
										})) || []
									}
									onChange={(value) => {
										setData({ ...data, acquirerId: value });
									}}
								/>
								{errors["acquirerId"] && (
									<p style={{ color: "red" }}>
										{errors["acquirerId"].join(", ")}
									</p>
								)}
							</div>

							<div>
								<label>Plano Contas Origem</label>
								<Select
									showSearch
									className="uk-width-1-1"
									value={data?.fromAccountPlanId}
									onChange={(e) => setData({ ...data, fromAccountPlanId: e })}
									optionFilterProp="children"
									filterOption={(input, option) => {
										const normalizedInput = normalize(input);
										const normalizedOption = normalize(
											option?.children?.toString() || "",
										);
										return normalizedOption.includes(normalizedInput);
									}}
								>
									{plans?.length > 0 &&
										plans?.map(
											(plan, i) =>
												plan.type === "DEBITO" && (
													<Option key={"plans-debit-" + i} value={plan?.id}>
														{plan?.description}
													</Option>
												),
										)}
								</Select>
								{errors["fromAccountPlanId"] && (
									<p style={{ color: "red" }}>
										{errors["fromAccountPlanId"].join(", ")}
									</p>
								)}
							</div>

							<div>
								<label>Conta Corrente Origem</label>
								<Select
									showSearch
									className="uk-width-1-1"
									value={data?.fromCheckingAccountId}
									onChange={(e) =>
										setData({ ...data, fromCheckingAccountId: e })
									}
									optionFilterProp="children"
									filterOption={(input, option) => {
										const normalizedInput = normalize(input);
										const normalizedOption = normalize(
											option?.children?.toString() || "",
										);
										return normalizedOption.includes(normalizedInput);
									}}
								>
									{checkingAccounts?.length > 0 &&
										checkingAccounts?.map((account, i) => (
											<Option
												key={"checkingAccounts-select" + i}
												value={account?.id}
											>
												{account?.description}
											</Option>
										))}
								</Select>
								{errors["fromCheckingAccountId"] && (
									<p style={{ color: "red" }}>
										{errors["fromCheckingAccountId"].join(", ")}
									</p>
								)}
							</div>
						</div>

						<div
							style={{
								display: "grid",
								marginTop: 20,
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: 10,
							}}
						>
							<div className="">
								<label>Plano Contas Destino</label>
								<Select
									showSearch
									className="uk-width-1-1"
									value={data?.toAccountPlanId}
									onChange={(e) => setData({ ...data, toAccountPlanId: e })}
									optionFilterProp="children"
									filterOption={(input, option) => {
										const normalizedInput = normalize(input);
										const normalizedOption = normalize(
											option?.children?.toString() || "",
										);
										return normalizedOption.includes(normalizedInput);
									}}
								>
									{plans?.length > 0 &&
										plans?.map(
											(plan, i) =>
												plan.type === "CREDITO" && (
													<Option key={"plans-credit-" + i} value={plan?.id}>
														{plan?.description}
													</Option>
												),
										)}
								</Select>
								{errors["toAccountPlanId"] && (
									<p style={{ color: "red" }}>
										{errors["toAccountPlanId"].join(", ")}
									</p>
								)}
							</div>

							<div>
								<label>Conta Corrente Destino</label>
								<Select
									showSearch
									className="uk-width-1-1"
									value={data?.toCheckingAccountId}
									onChange={(e) => setData({ ...data, toCheckingAccountId: e })}
									optionFilterProp="children"
									filterOption={(input, option) => {
										const normalizedInput = normalize(input);
										const normalizedOption = normalize(
											option?.children?.toString() || "",
										);
										return normalizedOption.includes(normalizedInput);
									}}
								>
									{checkingAccounts?.length > 0 &&
										checkingAccounts?.map((account, i) => (
											<Option key={"checkingAccounts-" + i} value={account?.id}>
												{account?.description}
											</Option>
										))}
								</Select>
								{errors["toCheckingAccountId"] && (
									<p style={{ color: "red" }}>
										{errors["toCheckingAccountId"].join(", ")}
									</p>
								)}
							</div>
						</div>
					</div>
					<footer
						style={{
							display: "flex",
							gap: "10px",
							justifyContent: "flex-end",
						}}
					>
						<Button type="submit" text="Salvar" />

						<Button onClick={() => cleanUp()} text="Voltar" type="button" />
					</footer>
				</form>
			</Container>
		</PageWrapper>
	);
});

export default Create;
