import { useEffect, useState } from "react";
import { productivityItemsService } from "@/OLD/services/productivityItems.service";

export const useProductivityItems = (productID: string) => {
	const [items, setItems] = useState<
		{
			id: number;
			p_id: number;
			description: string;
			quantity: number;
			reserved_minutes: number;
			order: number;
			active: boolean;
		}[]
	>([]);
	const [loading, setLoading] = useState(false);

	const fetchData = () => {
		if (!productID) {
			return;
		}

		setLoading(true);

		productivityItemsService
			.getProductivityProducts({ product: productID })
			.then((res) => setItems(res.data))
			.catch(() => setLoading(false))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchData();
	}, [productID]);

	return {
		items,
		loadingItems: loading,
		fetchItems: fetchData,
	};
};
