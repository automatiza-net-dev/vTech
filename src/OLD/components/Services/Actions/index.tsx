// @ts-nocheck
import React, { useState, memo, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
	useQuery,
	FormHandler,
	Tab,
	useToast,
	Input,
	InputSwitch,
	api,
	schema,
	Textarea,
	InputCurrency,
	useQueryClient,
	Popconfirm,
	useAuthAdmin,
} from "infinity-forge";
import { Select } from "antd";

import { servicesService } from "@/OLD/services/services.service";
import { productivityItemsService } from "@/OLD/services/productivityItems.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import { VscTasklist } from "react-icons/vsc";
import { FaPlus } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

import { Modal, Button, Table, Tooltip, Input as AntdInput } from "antd";
import EditForm from "./EditForm";
import ProductivityItems from "@/OLD/components/mini-components/ProductivityItems";
import ServiceDetails from "../Single";

const verifyErrors = (msg) => {
	const fields = msg?.map((item) => item?.field);

	if (fields?.includes("subgroupId")) {
		return "Campo subgrupo obrigatório";
	}

	if (fields?.includes("taxationGroupId")) {
		return "campo grupo de imposto obrigatório";
	}
};

const Actions = memo(function Actions({ service, setReload }) {
	const [data, setData] = useState({});
	const [updateVisible, setUpdateVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [productivityVisible, setProductivityVisible] = useState(false);
	const [serviceId, setServiceId] = useState("");
	const [detailsVisible, setDetailsVisible] = useState(false);

	const queryClient = useQueryClient();

	const [addProductivityState, setAddProductivityState] = useState<
		"closed" | "listing" | "form"
	>("closed");
	const [editingProductivity, setEditingProductivity] = useState({
		id: 0,
		description: "",
		active: false,
		reservedMinutes: 0,
		order: 0,
	});

	const productivityItems = useQuery({
		queryKey: ["productivity-items"],
		queryFn: () => productivityItemsService.getProductivityItems({}),
		enabled: productivityVisible,
	});

	const [term, setTerm] = useState("");
	const filteredOptions = useMemo(() => {
		if (!productivityItems.data?.data) {
			return [];
		}

		if (term === "") {
			return productivityItems.data?.data;
		}

		return productivityItems.data?.data.filter((item) =>
			JSON.stringify(item).toLowerCase().includes(term.toLowerCase()),
		);
	}, [term, productivityItems.data?.data]);

	useEffect(() => {
		productivityItems.refetch();
	}, [addProductivityState]);

	const [documentState, setDocumentState] = useState<"closed" | "open">(
		"closed",
	);

	const canEditService = useUserHasPermission("SRV02");
	const canDeleteService = useUserHasPermission("SRV03");
	const { createToast } = useToast();

	const router = useRouter();

	const removeService = useCallback(() => {
		if (!canDeleteService) {
			return createToast({ message: "Ação não permitida", status: "error" });
		}

		servicesService
			.removeService(service.id)
			.then((_res) =>
				createToast({
					message: "Serviço removido com sucesso!",
					status: "success",
				}),
			)
			.catch((err) =>
				createToast({
					message: "Houve um erro ao remover o serviço selecionado",
					status: "error",
				}),
			)
			.finally(() => {
				setReload((prv) => !prv);
			});
	}, [service?.id]);

	const setUpdateData = () => {
		setData({
			courtesy: service?.courtesy,
			description: service?.description,
			active: `${service?.active}`,
			referenceCode: service?.referenceCode,
			subgroupId: service?.subgroup?.id,
			taxationGroupId: service?.taxationGroup?.id,
			features: service?.features,
			serviceCode: service?.serviceCode,
			// serviceType: service?.type,
			serviceType: service.serviceType,
		});
	};

	useEffect(() => {
		updateVisible && setUpdateData();
	}, [updateVisible]);

	const updateService = useCallback(() => {
		let error = false;
		setLoading(true);
		servicesService
			.updateService(service?.id, {
				...data,
				active: data?.active === "true" ? true : false,
			})
			.then((_res) =>
				createToast({
					message: "Serviço atualizado com sucesso!",
					status: "success",
				}),
			)
			.catch((err) => {
				const message = verifyErrors(err?.response?.data?.errors) ?? "-";
				createToast({ message, status: "warning" });

				error = true;
				setLoading(false);
			})
			.finally(() => {
				if (!error) {
					setData({});
					setUpdateVisible(false);
					setReload((prv) => !prv);
				}
			});
	}, [data, service?.id]);

	const deleteItem = useCallback(async (itemID: number) => {
		productivityItemsService
			.deleteProductivityItem(itemID)
			.then(() => {
				productivityItems.refetch();
				return createToast({
					message: "Item de produtividade excluído com sucesso!",
					status: "success",
				});
			})
			.catch((err) => {
				return createToast({
					message: err.response.data.message,
					status: "error",
				});
			});
	}, []);

	return (
		<section className="uk-flex uk-flex-around">
			<FiEdit2
				onClick={() => {
					setServiceId(service?.id);
					setDetailsVisible(true);
					{
						/* router.push(`/dashboard/servico/${service?.id}`); */
					}
				}}
				style={{ cursor: "pointer", fontSize: "1.2rem" }}
			/>
			<VscTasklist
				onClick={() => {
					setServiceId(service?.id);
					setProductivityVisible(true);
				}}
			/>

			<IoDocumentTextOutline
				onClick={() => {
					setDocumentState("open");
				}}
			/>

			{/*canEditService && <FiEdit2 onClick={() => setUpdateVisible(true)} />*/}
			<Popconfirm
				idTooltip="sut"
				title="Deseja remover esse serviço?"
				onConfirm={removeService}
				okText="Sim"
				cancelText="Não"
			>
				{canDeleteService && (
					<FiTrash2
						className="uk-link"
						style={{ cursor: "pointer", fontSize: "1.2rem", color: "red" }}
					/>
				)}
			</Popconfirm>

			<Modal
				width={800}
				title="Alterar dados do serviço"
				footer={null}
				open={updateVisible}
				onCancel={() => setUpdateVisible(false)}
			>
				<EditForm
					data={data}
					setData={setData}
					submit={updateService}
					setVisible={setUpdateVisible}
				/>
			</Modal>

			{productivityVisible && (
				<Modal
					title={`Items de produtividade: ${service.description ?? "-"}`}
					width={600}
					open={productivityVisible}
					onCancel={() => setProductivityVisible(false)}
					footer={null}
					style={{}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
							justifyContent: "center",
							gap: "10px",
							width: "100%",
						}}
					>
						<Button onClick={() => setAddProductivityState("listing")}>
							Adicionar
						</Button>
						<Modal
							title={
								addProductivityState === "listing"
									? "Items de produtividade"
									: "Cadastrar item de produtividade"
							}
							width={700}
							open={addProductivityState !== "closed"}
							onCancel={() => {
								setAddProductivityState((prev) =>
									prev === "form" ? "listing" : "closed",
								);
								setEditingProductivity(() => ({
									id: 0,
									description: "",
									reservedMinutes: 0,
									origin: "Unidade",
									order: 0,
									active: false,
								}));
							}}
							footer={null}
							style={{}}
						>
							{addProductivityState === "listing" && (
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-end",
										justifyContent: "center",
										gap: "10px",
										width: "100%",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											width: "100%",
											gap: "16px",
										}}
									>
										<AntdInput
											name="description"
											addonBefore="Item de Produtividade"
											value={term}
											onChange={(e) => setTerm(e.target.value)}
										/>

										<Button onClick={() => setAddProductivityState("form")}>
											Novo item produtividade
										</Button>
									</div>

									<Table
										dataSource={filteredOptions.map((r) => ({
											description: `${r.description} (${r.type_qty ?? "-"})`,
											actions: (
												<div className="uk-flex" style={{ gap: 20 }}>
													<Tooltip title={"Adicionar ao produto"}>
														<FaPlus
															style={{ cursor: "pointer" }}
															onClick={async () => {
																await productivityItemsService.createProductivityProduct(
																	{
																		items: [
																			{
																				productivityItemId: r.id,
																				productId: service.id,
																				quantity: 1,
																				order: 1,
																			},
																		],
																	},
																);
																productivityItems.refetch();
																queryClient.invalidateQueries(
																	"productivity-item-products",
																);
																createToast({
																	message:
																		"Item de produtividade adicionado com sucesso!",
																	status: "success",
																});
															}}
														/>
													</Tooltip>
													<Tooltip title={"Editar"}>
														<FiEdit2
															style={{ cursor: "pointer" }}
															onClick={async () => {
																setAddProductivityState("form");
																setEditingProductivity({
																	id: r.id,
																	description: r.description,
																	order: r.order,
																	reservedMinutes: r.reserved_minutes,
																	active: r.active,
																});
															}}
														/>
													</Tooltip>
													<Tooltip title={"Apagar"}>
														<Popconfirm
															onConfirm={async () => {
																await deleteItem(r.id);
															}}
															idTooltip="a"
															title="Você deseja mesmo apagar esse item?"
															position="top-right"
														>
															<FiTrash2 style={{ cursor: "pointer" }} />
														</Popconfirm>
													</Tooltip>
												</div>
											),
										}))}
										columns={[
											{
												title: "Descrição",
												key: "description",
												dataIndex: "description",
											},
											{
												title: "Ações",
												key: "actions",
												dataIndex: "actions",
											},
										]}
										className="uk-margin-small-top"
										style={{ width: "100%" }}
									/>
								</div>
							)}
							{addProductivityState === "form" && (
								<FormHandler
									isStickyButtons
									schema={
										editingProductivity.id === 0
											? {
													description: schema.required(),
													reservedMinutes: schema.required(),
													order: schema.required(),
												}
											: {
													description: schema.required(),
													reservedMinutes: schema.required(),
													order: schema.required(),
													active: schema.required(),
												}
									}
									initialData={editingProductivity}
									onSucess={async (formData) => {
										if (editingProductivity.id === 0) {
											await productivityItemsService.createProductivityItem({
												description: formData.description,
												reservedMinutes: formData.reservedMinutes,
												origin: "Unidade",
												order: formData.order,
											});
										} else {
											await productivityItemsService.updateProductivityItem({
												id: editingProductivity.id,
												description: formData.description,
												reservedMinutes: formData.reservedMinutes,
												origin: "Unidade",
												order: formData.order,
												active: formData.active,
											});
										}

										productivityItems.refetch();
										setEditingProductivity({
											id: 0,
											description: "",
											reservedMinutes: 0,
											// origin: "Unidade",
											order: 0,
											active: false,
										});
										setAddProductivityState("listing");
										createToast({
											message: "Item de produtividade adicionado com sucesso!",
											status: "success",
										});
									}}
									disableEnterKeySubmitForm
									cleanFieldsOnSubmit={false}
									button={{ text: "Salvar" }}
								>
									<section className="form-container">
										<div className="uk-flex uk-flex-wrap">
											<div className="uk-width-1-1">
												<Input
													name="description"
													label="* Descrição"
													required
												/>
											</div>

											<div
												className="uk-width-1-2"
												style={{ paddingRight: "10px" }}
											>
												<Input
													name="reservedMinutes"
													label="* Minutos reservados"
													type="number"
													required
												/>
											</div>

											<div
												className="uk-width-1-2"
												style={{ paddingLeft: "10px" }}
											>
												<Input
													name="order"
													label="* Sequência"
													type="number"
													required
												/>
											</div>

											{editingProductivity.id !== 0 && (
												<div
													className="uk-width-1-2"
													style={{ paddingLeft: "10px" }}
												>
													<InputSwitch name="active" label="* Ativo" />
												</div>
											)}
										</div>
									</section>
								</FormHandler>
							)}
						</Modal>

						<ProductivityItems productId={serviceId} />
					</div>
				</Modal>
			)}
			{detailsVisible && (
				<Modal
					open={detailsVisible}
					onCancel={() => setDetailsVisible(false)}
					width={1200}
					footer={null}
				>
					<ServiceDetails
						setReloadService={setReload}
						serviceId={service?.id}
						setVisible={setDetailsVisible}
					/>
				</Modal>
			)}

			<Modal
				title={`Vincular Documentos ao Serviço: ${service?.description}`}
				width={700}
				open={documentState === "open"}
				onCancel={() => {
					setDocumentState("closed");
				}}
				footer={null}
				style={{}}
			>
				<DocumentTable serviceId={service.id} />
			</Modal>
		</section>
	);
});

export default Actions;

function DocumentTable(props: { serviceId: string }) {
	const { user } = useAuthAdmin();
	const [formData, setFormData] = useState<{
		documentTemplateId: string | null;
		productId: string;
		type: string;
	}>({
		documentTemplateId: null,
		productId: props.serviceId,
		type: "geral",
	});

	const serviceDocuments = useQuery({
		queryKey: ["service-documents", props.serviceId],
		queryFn: () =>
			api<
				{
					id: number;
					system_id: number;
					system_product_id: number;
					economic_group_id: string | null;
					business_unit_id: string | null;
					product_id: string;
					document_template_id: string;
					document_template_title: string;
					type: string;
					active: boolean;
					origin: string;
				}[]
			>({
				url: "product-documents",
				method: "get",
				body: {
					product: props.serviceId,
					// product: "6a79d4b8-52ef-4881-ab66-b0281704ec94",
				},
			}),
	});
	const availableDocuments = useQuery({
		queryKey: ["available-documents", props.serviceId],
		queryFn: () =>
			api<
				{
					id: string;
					title: string;
				}[]
			>({
				url: "document-templates",
				method: "get",
				body: {},
			}),
	});

	const createDocument = useCallback(async () => {
		await api({
			url: `product-documents`,
			body: {
				economicGroupId: user.unit.economicGroup.id,
				businessUnitId: user.unit.id,
				productId: formData.productId,
				documentTemplateId: formData.documentTemplateId,
				type: formData.type,
			},
			method: "post",
		});

		setFormData({
			documentTemplateId: null,
			productId: props.serviceId,
			type: "geral",
		});

		serviceDocuments.refetch();
	}, [formData, user, props.serviceId]);

	const deleteDocument = useCallback(async (documentID: number) => {
		await api({
			url: `product-documents/${documentID}`,
			method: "delete",
		});

		serviceDocuments.refetch();
	}, []);

	return (
		<div>
			<div
				style={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					alignItems: "end",
					gap: 10,
				}}
			>
				<div
					style={{
						width: "100%",
						overflow: "hidden",
						display: "flex",
						flexDirection: "column",
						gap: 4,
					}}
				>
					<span>Documentos para Vincular</span>
					<Select
						showSearch
						autoClearSearchValue
						style={{ width: "100%" }}
						placeholder="Selecione um documento"
						value={formData.documentTemplateId}
						onChange={(v) =>
							setFormData((state) => ({ ...state, documentTemplateId: v }))
						}
						filterOption={(input, option) =>
							(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
						}
						options={availableDocuments.data?.map((r) => ({
							label: r.title,
							value: r.id,
						}))}
					/>
				</div>

				<Button
					disabled={formData.documentTemplateId === null}
					onClick={createDocument}
				>
				Vincular	
				</Button>
			</div>

			<Table
				dataSource={serviceDocuments.data?.map((r) => ({
					description: r.document_template_title,
					actions: (
						<div className="uk-flex" style={{ gap: 20 }}>
							<Tooltip title={"Apagar"}>
								<Popconfirm
									onConfirm={async () => {
										await deleteDocument(r.id);
									}}
									idTooltip="a"
									title="Você deseja desfazer o vinculo do Documento?"
									position="top-right"
								>
									<FiTrash2 style={{ cursor: "pointer" }} />
								</Popconfirm>
							</Tooltip>
						</div>
					),
				}))}
				columns={[
					{
						title: "Descrição",
						key: "description",
						dataIndex: "description",
					},
					{
						title: "Ações",
						key: "actions",
						dataIndex: "actions",
					},
				]}
				className="uk-margin-small-top"
				style={{ width: "100%" }}
			/>
		</div>
	);
}
