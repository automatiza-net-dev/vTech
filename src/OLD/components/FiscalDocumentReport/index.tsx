import { PageWrapper, useQuery } from "infinity-forge";
import { memo, useState } from "react";
import Filters from "./Filters";
import PrintTable from "./PrintTable";
import { Container } from "./styles";
import { reportsService } from "@/OLD/services/reports.service";
import moment from "moment";

const FiscalDocumentReport = memo(function FiscalDocumentReport() {
	const [filters, setFilters] = useState({
		status: "",
		fromDate: moment().startOf("month"),
		toDate: moment().endOf("month"),
	});

	const reportQuery = useQuery({
		queryKey: ["fiscal-document-report", filters],
		queryFn: () =>
			reportsService
				.getFiscalDocumentReport({
					fromDate: filters.fromDate.toISOString(),
					toDate: filters.toDate.toISOString(),
					status: filters.status,
				})
				.then((r) => r.data),
	});

	return (
		<PageWrapper title={`Relatório de notas emitidas`}>
			<Container>
				<Filters filters={filters} setFilters={setFilters} />
				<PrintTable
					label={[
						filters.fromDate && filters.toDate
							? `${moment(filters.fromDate).format("DD/MM/YYYY")} à ${moment(filters.toDate).format("DD/MM/YYYY")}`
							: `-`,
						filters.status
							? filters.status === "transmitidas"
								? "Transmitidas"
								: "Com erro"
							: "Todos",
					].join(" - ")}
					reports={reportQuery.data ?? []}
				/>
			</Container>
		</PageWrapper>
	);
});

export default FiscalDocumentReport;
