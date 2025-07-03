// @ts-nocheck
import { memo, useCallback, useState } from "react";
import { useProductivityItems } from "@/OLD/hooks/useProductivityItems";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Table, Tooltip, Modal } from "antd";
import { productivityItemsService } from "@/OLD/services/productivityItems.service";
import {
	FormHandler,
	useToast,
	schema,
	InputSwitch,
	Input,
	useQuery,
	Popconfirm,
} from "infinity-forge";

const ProductivityItems = memo(function ProductivityItems({ productId }) {
	const { createToast } = useToast();

	const productivityProducts = useQuery({
		queryKey: ["productivity-item-products", productId],
		queryFn: () =>
			productivityItemsService.getProductivityProducts({ product: productId }),
		enabled: !!productId,
	});

	const [editProductivityItemState, setEditProductivityItemState] = useState<
		"closed" | "form"
	>("closed");
	const [editingProductivityItem, setEditingProductivityItem] = useState({
		id: 0,
		description: "",
		active: false,
		order: 0,
	});

	const deleteItemProduct = useCallback(async (itemProductID: number) => {
		productivityItemsService
			.deleteProductivityItemProduct(itemProductID)
			.then(() => {
				productivityProducts.refetch();
			})
			.catch((err) => {
				return createToast({
					message: err.response.data.message,
					status: "error",
				});
			});
	}, []);

	return (
		<>
			<Table
				style={{ width: "100%" }}
				dataSource={productivityProducts.data?.data.map((r) => ({
					quantity: r.quantity,
					description: r.description,
					order: r.order,
					actions: (
						<div className="uk-flex" style={{ gap: 20 }}>
							<Tooltip title={"Editar"}>
								<FiEdit2
									style={{ cursor: "pointer" }}
									onClick={async () => {
										setEditProductivityItemState("form");
										setEditingProductivityItem({
											id: r.id,
											description: r.description,
											order: r.order,
											active: r.active,
										});
									}}
								/>
							</Tooltip>
							<Tooltip title={"Apagar"}>
								<Popconfirm
									onConfirm={async () => {
										await deleteItemProduct(r.id);
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
					{ title: "Qtd", key: "qtd", dataIndex: "quantity" },
					{
						title: "Descrição item produtividade",
						key: "description",
						dataIndex: "description",
					},
					{
						title: "Sequência",
						key: "order",
						dataIndex: "order",
					},
					{
						title: "Ações",
						key: "actions",
						dataIndex: "actions",
					},
				]}
			/>
			{editingProductivityItem.id !== 0 && (
				<Modal
					title={`Atualizar item de produtividade: ${editingProductivityItem.description}`}
					width={700}
					visible={editProductivityItemState !== "closed"}
					onCancel={() => {
						setEditProductivityItemState("closed");
						setEditingProductivityItem({
							id: 0,
							description: "",
							order: 0,
							active: false,
						});
					}}
					footer={null}
					style={{}}
				>
					<FormHandler
						isStickyButtons
						schema={{
							order: schema.required(),
							// active: schema.required(),
						}}
						initialData={editingProductivityItem}
						onSucess={async (formData) => {
							await productivityItemsService.updateProductivityItemProduct({
								id: editingProductivityItem.id,
								active: formData.active,
								order: formData.order,
							});

							productivityProducts.refetch();
							setEditingProductivityItem({
								id: 0,
								description: "",
								order: 0,
								active: false,
							});
							setEditProductivityItemState("closed");
						}}
						disableEnterKeySubmitForm
						cleanFieldsOnSubmit={false}
						button={{ text: "Salvar" }}
					>
						<section className="form-container">
							<div className="uk-flex uk-flex-wrap">
								<div className="uk-width-1-2" style={{ paddingLeft: "10px" }}>
									<Input
										name="order"
										label="* Sequência"
										type="number"
										required
									/>
								</div>

								<div className="uk-width-1-2" style={{ paddingLeft: "10px" }}>
									<InputSwitch name="active" label="* Ativo" />
								</div>
							</div>
						</section>
					</FormHandler>
				</Modal>
			)}
		</>
	);
});

export default ProductivityItems;
