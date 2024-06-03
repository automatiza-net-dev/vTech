import api from "@/OLD/services";

export const depositService = {
	searchDeposits: async (params) =>
		await api.get("/deposits/search-deposits", {
			params,
		}),
	getDeposit: async (id) => await api.get(`/deposits/show-deposit/${id}`),
	createDeposit: async (data) =>
		await api.post("/deposits/create-deposit", data),
	updateDeposit: async (id, data) =>
		await api.post(`/deposits/update-deposit/${id}`, data),

	searchDepositMovements: async (params) =>
		await api.get("/deposits/search-deposit-movements", {
			params,
		}),
	createDepositMovement: async (data) =>
		await api.post("/deposits/create-deposit-movement", data),
	getDepositMovements: async (params) =>
		await api.get("/deposits/show-deposit-movements/", {
			params,
		}),
};
