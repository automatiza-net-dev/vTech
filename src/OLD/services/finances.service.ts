import api from "@/OLD/services";

// GET
const getAllFinances = async (params) =>
	await api.get("/finances", {
		params,
	});

const getOverallResume = async (params) =>
	await api.get("/finances/overall-resume", { params });

const getExpiringPayments = async (params) =>
	await api.get("/finances/expiring-payments", { params });

const getExpiringExpenses = async (params) =>
	await api.get("/finances/expiring-expenses", { params });

const getResumeOpenCashiers = async (params) =>
	await api.get("/finances/open-cashiers-resume", { params });

const getResumeClosedCashiers = async (params) =>
	await api.get("/finances/closed-cashiers-resume", { params });

const getResumeRevisedCashiers = async (params) =>
	await api.get("/finances/revised-cashiers-resume", { params });

const getTodaysCashierResume = async (params) =>
	await api.get("/finances/today-cashiers-resume", { params });

const getReducedFinances = async (params) =>
	await api.get("/finances/reduced", { params });

const showBordero = async (id, params) =>
	await api.get(`/borderos/show/${id}`, { params });

const getGroupedFinances = async (params) =>
	await api.get(`/finances/grouped`, { params });

const getControlResume = async (params) =>
	await api.get<{ label: string; value: string }[]>(
		`/finances/control-resume`,
		{ params },
	);

const getPaymentGroup = async (params) =>
	await api.get("/finances/payment-group", { params });

const getFinancesBalance = async (params) =>
	await api.get("/finances/balance", { params });

// POST
const create = async (data) => await api.post("/finances/create", data);

const acceptManyFinances = async (ids) =>
	await api.post("/finances/accept-many", { ids });

const createMultiple = async (data) =>
	await api.post("/finances/create-multiple", data);

const createBordero = async (data) => await api.post("/borderos/create", data);

const createBorderoItems = async (data) =>
	await api.post("/borderos/create-items", data);

const closeBordero = async (data) => await api.post("/borderos/close", data);

const reopenBordero = async (data) => await api.post("/borderos/reopen", data);

const downBordero = async (data) => await api.post("/borderos/down", data);

const revertDownBordero = async (data) =>
	api.post("/borderos/revert-down", data);

const removeItemsBordero = async (data) =>
	await api.post("/borderos/exclude-items", data);

const removeBordero = async (data) => await api.post("/borderos/exclude", data);

// PUT
const update = async (id, data) =>
	await api.put(`/finances/update/${id}`, data);

const updateDown = async (data) => await api.put(`/finances/update-down`, data);

const updateExpirationDates = async (data) =>
	await api.put(`/finances/update-expiration-dates`, data);

const groupedDown = async (data) =>
	await api.put(`/finances/grouped-down`, data);

const updateReversal = async (id, data) =>
	api.put(`/finances/update-reversal/${id}`, data);

// DELETE
const remove = async (id) => await api.delete(`/finances/delete/${id}`);

export const financesService = {
	create,
	createMultiple,
	createBordero,
	createBorderoItems,
	update,
	remove,
	updateDown,
	updateExpirationDates,
	updateReversal,
	acceptManyFinances,
	closeBordero,
	reopenBordero,
	revertDownBordero,
	downBordero,
	removeItemsBordero,
	removeBordero,
	groupedDown,
	getAllFinances,
	getResumeClosedCashiers,
	getResumeOpenCashiers,
	getResumeRevisedCashiers,
	getOverallResume,
	getExpiringPayments,
	getExpiringExpenses,
	getTodaysCashierResume,
	getReducedFinances,
	showBordero,
	getPaymentGroup,
	getGroupedFinances,
	getFinancesBalance,
	getControlResume,
};
