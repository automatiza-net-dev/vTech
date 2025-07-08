import { memo, useCallback, useState } from "react";

import {
	Input,
	InputNumber,
	Checkbox,
	Table,
	Form,
	AutoComplete,
	Switch,
} from "antd";
import { api, Modal, useQuery } from "infinity-forge";
import { Container } from "../styles";
import { Button, PageWrapper, useToast } from "infinity-forge";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

// Utils
import { useEconomicGroup } from "@/OLD/hooks/useEconomicGroup";
import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";

type TCreateDepartment = {
	economicGroupId?: string;
	businessUnitId?: string;

	description: string;
	image?: Blob;

	items: {
		description: string;
		requiresObservation: boolean;
		order: number;
		photo?: Blob;
	}[];

	products: { id: string; description: string }[];
};

const itemsColumns = [
	{
		title: "Descrição",
		dataIndex: "description",
		key: "description",
	},
	{
		title: "Existe Observação",
		dataIndex: "requiresObservation",
		key: "requiresObservation",
	},
	{
		title: "Ações",
		dataIndex: "actions",
		key: "actions",
	},
];

const productsColumns = [
	{
		title: "Descrição",
		dataIndex: "description",
		key: "description",
	},
	{
		title: "Ações",
		dataIndex: "actions",
		key: "actions",
	},
];

const CreateDepartment = memo(function CreateDepartment(props: {
	shouldClose: () => void;
}) {
	const { createToast } = useToast();

	const [data, setData] = useState<TCreateDepartment>({
		// 	economicGroupId?: string;
		// businessUnitId?: string;

		description: "",
		// image?: File;

		items: [],

		products: [],
	});

	const [itemFormState, setItemFormState] = useState<
		"open" | "closed" | number
	>("closed");
	const [createItem, setCreateItem] = useState<
		TCreateDepartment["items"][number]
	>({
		description: "",
		requiresObservation: false,
		order: 1,
		// photo:
	});

	const [productFormState, setProductFormState] = useState<"open" | "closed">(
		"closed",
	);
	const [productFormSearch, setProductFormSearch] = useState({
		term: "",
		shouldSearch: false,
	});
	const productsQuery = useQuery({
		enabled: productFormSearch.shouldSearch,
		queryKey: ["products"],
		queryFn: () => {
			return api<
				{
					id: string;
					description: string;
				}[]
			>({
				url: "budgets/products",
				method: "get",
				body: {
					description: productFormSearch.term,
				},
			});
		},
	});

	const economicGroupsQuery = useEconomicGroup();
	const businessUnitsQuery = useBusinessUnitsByUser();

	const addItem = useCallback(() => {
		if (typeof itemFormState === "number") {
			setData((old) => ({
				...old,
				items: old.items.map((item, index) => {
					if (index === itemFormState) {
						return createItem;
					}

					return item;
				}),
			}));
		} else {
			setData((old) => ({
				...old,
				items: [...old.items, createItem],
			}));
		}

		setCreateItem({
			description: "",
			requiresObservation: false,
			order: 1,
		});
		setItemFormState("closed");
	}, [createItem, data, itemFormState]);

	const submit = useCallback(async () => {
		try {
			const formData = new FormData();

			// Campos simples
			if (data.economicGroupId) {
				formData.append(
					"economicGroupId",
					economicGroupsQuery.allEconomicGroup.find((eg) => {
						if (eg.company_name === data.economicGroupId) {
							return true;
						}

						if (eg.fantasy_name === data.economicGroupId) {
							return true;
						}

						return false;
					})?.id ?? "",
				);
			}

			if (data.businessUnitId) {
				formData.append(
					"businessUnitId",
					businessUnitsQuery.businessUnits.find((eg) => {
						if (eg.fantasyName === data.businessUnitId) {
							return true;
						}

						if (eg.companyName === data.businessUnitId) {
							return true;
						}

						if (eg.identification === data.businessUnitId) {
							return true;
						}

						return false;
					})?.id ?? "",
				);
			}

			formData.append("description", data.description);

			if (data.image) {
				formData.append("image", data.image);
			}

			data.items.forEach((item, index) => {
				formData.append(`items[${index}][description]`, item.description);
				formData.append(
					`items[${index}][requiresObservation]`,
					String(item.requiresObservation),
				);
				formData.append(`items[${index}][order]`, String(item.order));
				if (item.photo) {
					formData.append(`photos[${index}]`, item.photo);
				}
			});

			data.products.forEach((product, index) => {
				formData.append(`products[${index}]`, product.id);
			});

			await api({
				url: "departments",
				method: "post",
				headers: {
					"Content-Type": "multipart/form-data; boundary=something",
				},
				body: formData,
			});

			createToast({
				message: "Departamento criado com sucesso",
				status: "success",
			});
			props.shouldClose();
		} catch (err) {
			createToast({
				message:
					"Erro ao criar departamento, confirme os dados e tente novamente",
				status: "error",
			});
		}
	}, [data]);

	return (
		<PageWrapper title="Criação de departamentos">
			<Container className="uk-container">
				<div className="uk-margin-top ">
					<form
						className=""
						onSubmit={(e) => {
							e.preventDefault();
							submit();
						}}
					>
						<div
							className="w-100 "
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(2, 1fr)",
								gap: "10px",
							}}
						>
							<Form.Item
								labelAlign="left"
								required={true}
								style={{
									height: "38px",
								}}
							>
								<label>Grupo Econômico</label>
								<AutoComplete
									value={data.economicGroupId}
									getPopupContainer={(trigger) => trigger.parentNode}
									onSelect={(v) => setData({ ...data, economicGroupId: v })}
									options={economicGroupsQuery.allEconomicGroup?.map((eg) => ({
										...eg,
										value: [
											eg.fantasy_name,
											eg.company_name,
											"Não definido",
										].find(Boolean) as string,
									}))}
								/>
							</Form.Item>

							<Form.Item
								labelAlign="left"
								style={{
									height: "38px",
								}}
							>
								<label>Unidade</label>
								<AutoComplete
									value={data.businessUnitId}
									getPopupContainer={(trigger) => trigger.parentNode}
									options={businessUnitsQuery.businessUnits?.map((bu) => ({
										...bu,
										value: [
											bu.identification,
											bu.fantasyName,
											bu.companyName,
											"Não definido",
										].find(Boolean) as string,
									}))}
									onSelect={(v) => setData({ ...data, businessUnitId: v })}
								/>
							</Form.Item>

							<Form.Item
								labelAlign="left"
								required={true}
								style={{
									height: "38px",
								}}
							>
								<label>* Descrição</label>
								<Input
									value={data?.description}
									required
									style={{}}
									onChange={(e) =>
										setData({ ...data, description: e.target.value })
									}
								/>
							</Form.Item>

							<Form.Item labelAlign="left" style={{}}>
								<label>Imagem</label>
								<Input
									type="file"
									accept="image/*"
									onChange={(e) => {
										const file = e.target?.files?.[0];
										if (!file) {
											return;
										}

										setData({
											...data,
											image: file,
										});
									}}
								/>
							</Form.Item>
						</div>

						<hr />
						<Table
							className="uk-margin-top"
							dataSource={data.items.map((d, idx) => ({
								description: d.description,
								requiresObservation: d.requiresObservation ? "Sim" : "Não",
								actions: (
									<div className="uk-flex uk-flex-around">
										<MdEdit
											size={20}
											onClick={() => {
												setItemFormState(idx);
												setCreateItem({
													description: data.items[idx].description,
													requiresObservation:
														data.items[idx].requiresObservation,
													order: data.items[idx].order,
													photo: data.items[idx].photo,
												});
											}}
										/>
										<FaRegTrashAlt
											style={{ cursor: "pointer" }}
											onClick={() => {
												setData((old) => ({
													...old,
													items: old.items.filter((_, i) => i !== idx),
												}));
											}}
										/>
									</div>
								),
							}))}
							columns={itemsColumns}
							footer={() => (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "flex-end",
									}}
								>
									<Button
										type="button"
										text="Adicionar Item"
										onClick={() => setItemFormState("open")}
									/>
								</div>
							)}
						/>

						<hr />
						<Table
							className="uk-margin-top"
							dataSource={data.products.map((d, idx) => ({
								description: d.description,
								actions: (
									<div className="uk-flex uk-flex-around">
										<FaRegTrashAlt
											style={{ cursor: "pointer" }}
											onClick={() => {
												setData((old) => ({
													...old,
													products: old.products.filter((_, i) => i !== idx),
												}));
											}}
										/>
									</div>
								),
							}))}
							columns={productsColumns}
							footer={() => (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "flex-end",
									}}
								>
									<Button
										type="button"
										text="Adicionar Produto"
										onClick={() => setProductFormState("open")}
									/>
								</div>
							)}
						/>

						<Modal
							styles={{
								width: "100%",
								maxWidth: "600px",
							}}
							title="Cadastrar item de departamento"
							open={
								itemFormState === "open" || typeof itemFormState === "number"
							}
							onClose={() => setItemFormState("closed")}
						>
							<div
								className="w-100 "
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(4, 1fr)",
									gap: "10px",
								}}
							>
								<Form.Item
									labelAlign="left"
									required={true}
									style={{
										height: "38px",
										gridColumn: "span 2",
									}}
								>
									<label>* Descrição</label>
									<Input
										value={createItem.description}
										required
										style={{}}
										onChange={(e) =>
											setCreateItem({
												...createItem,
												description: e.target.value,
											})
										}
									/>
								</Form.Item>

								<Form.Item
									labelAlign="left"
									required={true}
									style={{
										height: "38px",
										width: "100%",
									}}
								>
									<label>* Sequência</label>
									<InputNumber
										value={createItem.order}
										required
										min={1}
										max={99}
										style={{}}
										onChange={(e) =>
											setCreateItem({
												...createItem,
												order: e ?? 1,
											})
										}
									/>
								</Form.Item>

								<Form.Item
									labelAlign="left"
									required={true}
									style={{
										height: "38px",
										width: "100%",
									}}
								>
									<label>* Exige Observação</label>
									<Switch
										checked={createItem.requiresObservation}
										onChange={(e) =>
											setCreateItem({
												...createItem,
												requiresObservation: e,
											})
										}
									/>
								</Form.Item>

								<Form.Item
									labelAlign="left"
									style={{
										gridColumn: "span 4",
									}}
								>
									<label>Imagem</label>
									<Input
										type="file"
										accept="image/*"
										onChange={(e) => {
											const file = e.target?.files?.[0];
											if (!file) {
												return;
											}

											setCreateItem({
												...createItem,
												photo: file,
											});
										}}
									/>
								</Form.Item>
							</div>

							<footer
								style={{
									display: "flex",
									justifyContent: "flex-end",
									gap: "10px",
								}}
							>
								<Button
									type="submit"
									text="Salvar"
									disabled={false}
									onClick={() => addItem()}
								/>
							</footer>
							<hr />
						</Modal>

						<Modal
							styles={{
								width: "100%",
								maxWidth: "600px",
							}}
							title="Cadastrar produto de departamento"
							open={productFormState === "open"}
							onClose={() => setProductFormState("closed")}
						>
							<div
								className="w-100"
								style={{
									padding: "10px",
								}}
							>
								<div
									style={{
										display: "flex",
										width: "100%",
										gap: "10px",
										alignItems: "center",
										justifyContent: "flex-end",
										marginBottom: "10px",
									}}
								>
									<Form.Item
										labelAlign="left"
										required={true}
										style={{
											height: "38px",
											flex: 1,
										}}
									>
										<label>* Produto/Serviço</label>
										<Input
											value={productFormSearch.term}
											required
											style={{}}
											onChange={(e) =>
												setProductFormSearch((p) => ({
													term: e.target.value,
													shouldSearch: p.shouldSearch,
												}))
											}
										/>
									</Form.Item>
									<Button
										text="Filtrar"
										onClick={() => {
											setProductFormSearch((p) => ({
												...p,
												shouldSearch: true,
											}));
											productsQuery.refetch();
										}}
									/>
								</div>

								<Table
									columns={[
										{
											title: "Descrição",
											dataIndex: "description",
											key: "description",
										},

										{
											title: "Ações",
											dataIndex: "actions",
											key: "actions",
										},
									]}
									dataSource={productsQuery.data?.map((d) => ({
										description: d.description,
										actions: (
											<div className="uk-flex uk-flex-around">
												<Checkbox
													checked={data.products.some((f) => f.id === d.id)}
													onChange={(e) => {
														if (e.target.checked) {
															setData((old) => ({
																...old,
																products: [
																	...old.products,
																	{ id: d.id, description: d.description },
																],
															}));
														} else {
															setData((old) => ({
																...old,
																products: old.products.filter(
																	(p) => p.id !== d.id,
																),
															}));
														}
													}}
												/>
											</div>
										),
									}))}
								/>
							</div>
						</Modal>

						<hr />

						<footer
							style={{
								display: "flex",
								justifyContent: "flex-end",
								gap: "10px",
							}}
						>
							<Button type="submit" text="Salvar" disabled={false} />

							<Button onClick={() => setVisible(false)} text="Voltar" />
						</footer>
					</form>
				</div>
			</Container>
		</PageWrapper>
	);
});

export default CreateDepartment;
