import { useEffect, useState } from "react";
import { userService } from "@/OLD/services/user.service";

export function useEconomicGroup() {
	const [economicGroup, setEconomicGroup] = useState("");
	const [allEconomicGroup, setAllEconomicGroup] = useState<
		{
			id: string;
			fantasy_name: string | null;
			company_name: string | null;
			document: string | null;
			responsible_email: string;
			responsible_phone: string;
			created_at: string;
			updated_at: string;
			colors: string[];
			status: string;
		}[]
	>([]);

	useEffect(() => {
		userService.getEconomicGroups().then((res) => {
			setEconomicGroup(res.data[0].id);
			setAllEconomicGroup(res.data);
		});
	}, []);

	return { economicGroup, allEconomicGroup };
}
