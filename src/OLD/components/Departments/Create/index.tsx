import { memo, useCallback, useEffect, useState } from "react";

import {
	Input,
	InputNumber,
	Checkbox,
	Table,
	Form,
	Switch,
	Popconfirm,
} from "antd";
import { api, Modal, useAuthAdmin, useQuery } from "infinity-forge";
import { Button, useToast } from "infinity-forge";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

import type { TDepartment } from "../departments";

type TCreateDepartment = {
	economicGroupId?: string;
	businessUnitId?: string;

	description: string;
	image?: Blob;
	active?: boolean;

	items: {
		id?: number;
		description: string;
		requiresObservation: boolean;
		order: number;
		photo?: Blob;
		active?: boolean;
	}[];

	products: { id: string; description: string; mode: "create" | "update" }[];
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

const UpsertDepartment = memo(function UpsertDepartment(props: {
	initialData?: TDepartment;
	shouldRefresh: () => void;
	shouldClose: () => void;
}) {
	const { createToast } = useToast();
	const { user } = useAuthAdmin();

	const [data, setData] = useState<TCreateDepartment>({
		// 	economicGroupId?: string;
		// businessUnitId?: string;

		description: "",
		// image?: File;

		items: [],

		products: [],
	});
	useEffect(() => {
		if (!props.initialData) {
			return;
		}

		setData({
			economicGroupId: props.initialData.economic_group_id ?? undefined,
			businessUnitId: props.initialData.business_unit_id ?? undefined,
			description: props.initialData.description,
			items: props.initialData.items.map((item) => ({
				id: item.id,
				description: item.description,
				requiresObservation: item.requiresObservation,
				order: item.order,
				// photo
				active: item.active,
			})),
			products: props.initialData.products.map((product) => ({
				id: product.product.id,
				description: product.product.description,
				mode: "update",
			})),
			active: props.initialData.active,
		});
	}, [props.initialData]);

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
	const [productsToAdd, setProductsToAdd] = useState<
		{
			id: string;
			description: string;
			mode: "create" | "update";
		}[]
	>([]);
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
	useEffect(() => {
		if (productFormState === "closed") {
			return;
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				productsQuery.refetch();
			}
		};

		document.addEventListener("keypress", handleKeyDown);

		return () => document.removeEventListener("keypress", handleKeyDown);
	}, [productFormState]);

	const addItem = useCallback(() => {
		if (typeof itemFormState === "number") {
			setData((old) => ({
				...old,
				items: old.items.map((item, index) => {
					if (index === itemFormState) {
						return { id: item.id, active: item.active, ...createItem };
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

	const deleteItem = useCallback(
		async (idx: number) => {
			if (!!props.initialData?.items[idx]?.id) {
				await api({
					url: `departments/delete-item`,
					method: "put",
					body: {
						departmentId: props.initialData.id,
						departmentItemId: props.initialData.items[idx].id,
					},
				});
			}

			setData((old) => ({
				...old,
				items: old.items.filter((_, i) => i !== idx),
			}));

			props.shouldRefresh();
		},
		[props.initialData],
	);

	const deleteProduct = useCallback(
		async (idx: number) => {
			setData((old) => ({
				...old,
				products: old.products.filter((_, i) => i !== idx),
			}));

			if (props.initialData?.products[idx]?.product.id) {
				await api({
					url: `departments/delete-products`,
					method: "put",
					body: {
						departmentId: props.initialData.id,
						products: [props.initialData.products[idx].product.id],
					},
				});

				props.shouldRefresh();
			}
		},
		[props.initialData],
	);

	const submitCreate = useCallback(async () => {
		try {
			const formData = new FormData();

			formData.append("economicGroupId", user.unit.economicGroup.id);

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
				if (product.mode === "create") {
					formData.append(`products[${index}]`, product.id);
				}
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
				message: props.initialData
					? "Erro ao editar departamento, confirme os dados e tente novamente"
					: "Erro ao criar departamento, confirme os dados e tente novamente",
				status: "error",
			});
		}
	}, [data, user]);

	const submitUpdate = useCallback(async () => {
		if (!props.initialData) return;

		try {
			const tasks = data.items.reduce((acc, curr) => {
				const formData = new FormData();
				formData.append("departmentId", props.initialData!.id.toString());
				formData.append("description", curr.description);
				if (curr.photo) {
					formData.append("photo", curr.photo);
				}
				formData.append("active", curr.active?.toString() ?? "");
				formData.append("order", curr.order.toString());
				formData.append(
					"requiresObservation",
					curr.requiresObservation.toString(),
				);

				if (curr.id) {
					acc.push(
						api({
							url: `departments/update-item/${curr.id}`,
							method: "put",
							headers: {
								"Content-Type": "multipart/form-data; boundary=something",
							},
							body: formData,
						}),
					);
				} else {
					acc.push(
						api({
							url: `departments/store-item`,
							method: "post",
							headers: {
								"Content-Type": "multipart/form-data; boundary=something",
							},
							body: formData,
						}),
					);
				}

				return acc;
			}, [] as Promise<any>[]);
			await Promise.all(tasks);

			await api({
				url: `departments/update-products`,
				method: "put",
				headers: {},
				body: {
					departmentId: props.initialData.id,
					products: data.products.reduce((acc, curr) => {
						// if (curr.mode === "update") {
						acc.push(curr.id);
						// }

						return acc;
					}, [] as string[]),
				},
			});

			await api({
				url: `departments/${props.initialData.id}`,
				method: "put",
				headers: {},
				body: {
					description: data.description,
					active: data.active,
					// image: data.image,
				},
			});

			createToast({
				message: "Departamento atualizado com sucesso",
				status: "success",
			});
			props.shouldClose();
		} catch (err) {
			createToast({
				message:
					"Erro ao editar departamento, confirme os dados e tente novamente",
				status: "error",
			});
		}
	}, [data]);

	return (
		<div
			className="uk-margin-top "
			style={{
				paddingLeft: "10px",
				paddingRight: "10px",
			}}
		>
			<form
				className=""
				onSubmit={(e) => {
					e.preventDefault();
					if (props.initialData?.id) {
						submitUpdate();
					} else {
						submitCreate();
					}
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

					{props.initialData?.id && (
						<Form.Item
							labelAlign="left"
							required={true}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<label>Ativo</label>
							<Switch
								checked={data.active}
								onChange={(e) => {
									setData({ ...data, active: e });
								}}
							/>
						</Form.Item>
					)}
				</div>

				<hr />
				<Table
					className="uk-margin-top"
					dataSource={data.items.map((d, idx) => ({
						description: [d.id ? "✅" : "❌", d.description].join(" "),
						requiresObservation: d.requiresObservation ? "Sim" : "Não",
						actions: (
							<div className="uk-flex uk-flex-around">
								<MdEdit
									size={20}
									onClick={() => {
										setItemFormState(idx);
										setCreateItem({
											description: data.items[idx].description,
											requiresObservation: data.items[idx].requiresObservation,
											order: data.items[idx].order,
											photo: data.items[idx].photo,
										});
									}}
								/>
								<Popconfirm
									title="Deseja remover esse item?"
									onConfirm={() => deleteItem(idx)}
									okText="Sim"
									cancelText="Não"
									placement="left"
								>
									<FaRegTrashAlt style={{ cursor: "pointer" }} />
								</Popconfirm>
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
						description:
							d.mode === "create"
								? `❌${d.description}`
								: `✅ ${d.description}`,
						actions: (
							<div className="uk-flex uk-flex-around">
								<Popconfirm
									title="Deseja remover esse produto?"
									onConfirm={() => deleteProduct(idx)}
									okText="Sim"
									cancelText="Não"
									placement="left"
								>
									<FaRegTrashAlt style={{ cursor: "pointer" }} />
								</Popconfirm>
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
								onClick={() => {
									setProductFormState("open");
									if (props.initialData) {
										setProductsToAdd(
											data.products.map((p) => ({
												id: p.id,
												description: p.description,
												mode: "update",
											})),
										);
									}
								}}
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
					open={itemFormState === "open" || typeof itemFormState === "number"}
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
											checked={productsToAdd.some((f) => f.id === d.id)}
											onChange={(e) => {
												if (e.target.checked) {
													setProductsToAdd((old) => [
														...old,
														{
															id: d.id,
															description: d.description,
															mode: "create",
														},
													]);
												} else {
													setProductsToAdd((old) =>
														old.filter((p) => p.id !== d.id),
													);
												}
											}}
										/>
									</div>
								),
							}))}
						/>

						<div
							style={{
								display: "flex",
								gap: "10px",
								alignItems: "center",
								justifyContent: "flex-end",
								paddingTop: "10px",
							}}
						>
							<Button
								text="SALVAR"
								onClick={() => {
									setData((old) => ({
										...old,
										products: productsToAdd,
									}));
									setProductFormState("closed");
								}}
							/>
						</div>
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

					<Button
						type="button"
						onClick={() => props.shouldClose()}
						text="Voltar"
					/>
				</footer>
			</form>
		</div>
	);
});

export default UpsertDepartment;
