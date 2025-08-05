import api from "@/OLD/services";

const getReceipts = async (params) => await api.get("/receipts", { params });

const getReceipt = async (params) =>
	await api.get("/receipts/show", { params });

const getProducts = async () => await api.get("/receipts/products");

const getReceiptsWithProduct = async () =>
	await api.get("/receipts/with-products");

const getFiscalDocuments = async (params) =>
	await api.get("/fiscal-documents/business-unit/issued-nfe", { params });

const createReceipt = async (data) =>
	await api.post("/receipts/create", { ...data, receiptType: "E" });

const addReceiptItem = async (data) =>
	await api.post("/receipts/create-item", data);

const removeReceiptItem = async (data) =>
	await api.post("/receipts/delete-item", data);

const importXml = async (data) =>
	await api.post("/receipts/import-xml", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

const createSupplierProduct = async (data) =>
	await api.post("/receipts/create-supplier-products", data);

const createReceiptProduct = async (data) =>
	await api.post("/receipts/create-receipt-products", data);

const updateReceiptPayment = async (data) =>
	api.post("/receipts/update-payment", { ...data, receiptType: "E" });

const finishReceipt = async (data) =>
	await api.post("/receipts/finish-import", data);

const reopenReceipt = async (data) => await api.post("/receipts/reopen", data);

const createReceiptPayment = async (data) =>
	await api.post("/receipts/create-payment", data);

const removePaymentBlock = async (data) =>
	await api.post("/receipts/delete-payment", data);

const updateXmlItems = async (data) =>
	await api.post("/receipts/update-xml-items", data);

const updateReceiptItems = async (data: {
	receiptId: string;
	items: { receiptItemId: string; fractionValue: number }[];
}) => await api.post("/receipts/update-receipt-items", data);

export const receiptService = {
	getReceipts,
	getProducts,
	getReceipt,
	getFiscalDocuments,
	createReceipt,
	addReceiptItem,
	removeReceiptItem,
	importXml,
	createSupplierProduct,
	createReceiptProduct,
	reopenReceipt,
	updateReceiptPayment,
	finishReceipt,
	removePaymentBlock,
	createReceiptPayment,
	getReceiptsWithProduct,
	updateXmlItems,
	updateReceiptItems,
};
