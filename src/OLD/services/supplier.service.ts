// @ts-nocheck
import api from "@/OLD/services";

const create = async (data) =>
	await api.post("/patient-suppliers", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

const index = async ({ name, document } = false) =>
	await api.get(
		`/patient-suppliers${name ? `?name=${name}` : ""}${
			document ? `${name ? "&" : "?"}document=${document}` : ""
		}`,
	);

const show = async (id) => await api.get(`/patient-suppliers/${id}`);

const update = async (id, data) =>
	await api.put(`/patient-suppliers/${id}`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

const destroy = async (id) => await api.delete(`/patient-suppliers/${id}`);

export const supplierService = {
	create,
	index,
	show,
	update,
	destroy,
};
