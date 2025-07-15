import { clinicService } from "@/OLD/services/clinic.service";
import { userService } from "@/OLD/services/user.service";
import { useEffect, useState } from "react";

export const useBusinessUnitsByUser = (filters = false, reload?: any) => {
	const [businessUnits, setBusinessUnits] = useState<
		{
			id: string;
			identification: string;
			document: string;
			fantasyName: string;
			companyName: string;
			phone: string;
			group: {
				id: string;
				fantasy_name: string;
				company_name: string;
				document: null;
				responsible_email: string;
				responsible_phone: string;
				created_at: string;
				updated_at: string;
				colors: string[];
				status: string;
			};
		}[]
	>([]);
	const [loading, setLoading] = useState(false);

	const fetchData = () => {
		setLoading(true);

		clinicService
			.getClinicsByUser()
			.then((res) => setBusinessUnits(res.data))
			.catch((_err) => setLoading(false))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchData();
	}, [reload]);

	return {
		businessUnits,
		loadingBusinessUnits: loading,
		fetchBusinessUnits: fetchData,
	};
};

export const useAvailableChangeUnits = (fetch) => {
	const [units, setUnits] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchData = () => {
		setLoading(true);

		if (!fetch) {
			return;
		}

		userService
			.listAvailableChangeUnits()
			.then((res) => setUnits(res.data))
			.catch(() => setLoading(false))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchData();
	}, [fetch]);

	return {
		units,
		loadingUnits: loading,
		fetchUnits: fetchData,
	};
};
