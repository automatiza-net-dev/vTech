// @ts-nocheck
import React, { useState, memo, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
	useQuery,
	FormHandler,
	Tab,
	useToast,
	Input,
	Select,
	InputSwitch,
	api,
	schema,
	Textarea,
	InputCurrency,
	useQueryClient,
	Popconfirm,
} from "infinity-forge";

import { servicesService } from "@/OLD/services/services.service";
import { productivityItemsService } from "@/OLD/services/productivityItems.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import { VscTasklist } from "react-icons/vsc";
import { FaPlus } from "react-icons/fa";

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
				const message = verifyErrors(err?.response?.data?.errors);
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
			.then((res) => {
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

			{/*canEditService && <FiEdit2 onClick={() => setUpdateVisible(true)} />*/}
			<Popconfirm
				title="Deseja remover esse serviço?"
				onConfirm={removeService}
				okText="Sim"
				cancelText="Não"
				placement="left"
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
				visible={updateVisible}
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
					visible={productivityVisible}
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
							visible={addProductivityState !== "closed"}
							onCancel={() => {
								setAddProductivityState((prev) =>
									prev === "form" ? "listing" : "closed",
								);
								setEditingProductivity((p) => ({
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
					visible={detailsVisible}
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
		</section>
	);
});

export default Actions;
