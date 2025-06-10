import api from "@/OLD/services";

const getProductivityProducts = async (params) =>
	api.get("/productivity-items/products", { params });

const getProductivityItems = async (params: Record<string, string>) =>
	api.get<
		{
			id: number;
			description: string;
			active: boolean;
			created_at: string;
			updated_at: string;
			reserved_minutes: number;
			type_qty: number | null;
			order: number;
		}[]
	>("/productivity-items/items", { params });

const createProductivityItem = async (data: {
	description: string;
	reservedMinutes: number;
	origin: string;
	order: number;
}) => api.post("/productivity-items/create-item", data);

const updateProductivityItem = async (data: {
	id: number;
	description: string;
	reservedMinutes: number;
	origin: string;
	order: number;
	active: boolean;
}) => api.post("/productivity-items/update-item", data);

const createProductivityProduct = async (data: {
	items: {
		productivityItemId: string;
		productId: string;
		quantity: number;
		order: number;
	}[];
}) => api.post("/productivity-items/create-item-product", data);

export const productivityItemsService = {
	getProductivityProducts,
	getProductivityItems,
	createProductivityItem,
	updateProductivityItem,
	createProductivityProduct,
};
