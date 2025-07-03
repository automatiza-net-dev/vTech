import { useState, useEffect } from "react";

import { useCheckingAccountReports } from "@/OLD/hooks/useReports";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import Filters from "./Filters";
import PrintTable from "./PrintTable";
import AccessDenied from "@/OLD/components/AccessDenied";
import { PageWrapper } from "infinity-forge";

function CheckingAccountReport() {
	const { clinic } = useProfile();

	const [filters, setFilters] = useState({
		businessUnit: clinic?.id,
		noSearch: false,
	});
	const [_, setValues] = useState({});
	const [reload, setReload] = useState(false);

	const reportQuery = useCheckingAccountReports(filters, reload);

	const hasPermission = useUserHasPermission("REL02");

	return !hasPermission || hasPermission === "loading" ? (
		<AccessDenied loading={hasPermission} />
	) : (
		<PageWrapper title="Relatório de contas correntes">
			<Container>
				<Filters
					filters={filters}
					setFilters={setFilters}
					setReload={setReload}
					setValues={setValues}
				/>
				<hr />
				<PrintTable
					reports={reportQuery.checkingAccountReports ?? []}
					filters={filters}
				/>
			</Container>
		</PageWrapper>
	);
}

export default CheckingAccountReport;
