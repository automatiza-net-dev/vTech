import { TimeLine } from "@/domain";
import moment from "moment";
import { Input } from "antd";

export default function ReadTimelineExecution(props: TimeLine & {}) {
	if (!props.timeline_info.treatment) return <p>Não há dados</p>;

	return (
		<div className="uk-flex-column uk-flex-between">
			<p
				style={{
					fontSize: "20px",
					color: "black",
					fontWeight: "semibold",
				}}
			>
				Execução de tratamento
			</p>
			<hr />

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gridTemplateRows: "auto auto",
					gap: "10px",
				}}
			>
				<div style={{ gridColumn: "span 1", gridRow: "1" }}>
					<span>Código do tratamento</span>
					<Input
						value={props.timeline_info.treatment.execution.id}
						readOnly
						style={{
							backgroundColor: "rgba(10, 10, 10, 0.05)",
						}}
					/>
				</div>
				<div style={{ gridColumn: "2 / span 2", gridRow: "1" }}>
					<span>Cliente</span>
					<Input
						value={props.timeline_info.treatment.client?.name ?? "-"}
						readOnly
						style={{
							backgroundColor: "rgba(10, 10, 10, 0.05)",
						}}
					/>
				</div>
				<div style={{ gridColumn: "span 1", gridRow: "2" }}>
					<span>Data Lançamento</span>
					<Input
						value={
							props.timeline_info.treatment.execution.issueDate
								? moment(
										props.timeline_info.treatment.execution.issueDate,
									).format("DD/MM/YYYY HH:mm:ss")
								: "-"
						}
						style={{
							backgroundColor: "rgba(10, 10, 10, 0.05)",
						}}
						readOnly
					/>
				</div>
				<div style={{ gridColumn: "span 1", gridRow: "2" }}>
					<span>Data Agendamento</span>
					<Input
						value={
							props.timeline_info.treatment.execution.scheduleDate
								? moment(props.timeline_info.treatment.execution.scheduleDate)
										.add(3, "hours")
										.format("DD/MM/YYYY HH:mm:ss")
								: "-"
						}
						style={{
							backgroundColor: "rgba(10, 10, 10, 0.05)",
						}}
						readOnly
					/>
				</div>
				<div style={{ gridColumn: "span 1", gridRow: "2" }}>
					<span>Data Execução</span>
					<Input
						value={
							props.timeline_info.treatment.execution.executionDate
								? moment(
										props.timeline_info.treatment.execution.executionDate,
									).format("DD/MM/YYYY HH:mm:ss")
								: "-"
						}
						style={{
							backgroundColor: "rgba(10, 10, 10, 0.05)",
						}}
						readOnly
					/>
				</div>

				<div style={{ gridColumn: "span 2", gridRow: "3" }}>
					<span>Usuário Lançamento</span>
					<Input
						value={props.timeline_info.requester?.name ?? "-"}
						style={{
							backgroundColor: "rgba(10, 10, 10, 0.05)",
						}}
						readOnly
					/>
				</div>

				<div style={{ gridColumn: "span 2", gridRow: "3" }}>
					<span>Profissional Execução</span>
					<Input
						value={props.timeline_info.technician?.name ?? "-"}
						style={{
							backgroundColor: "rgba(10, 10, 10, 0.05)",
						}}
						readOnly
					/>
				</div>

				<div style={{ gridColumn: "1 / -1", gridRow: "4" }}>
					<span>Item executado</span>
					<Input
						value={[
							props.timeline_info.treatment.item.description,
							props.timeline_info.treatment.execution
								.productivityItemDescription,
						]
							.filter(Boolean)
							.join(" - ")}
						style={{
							backgroundColor: "rgba(10, 10, 10, 0.05)",
						}}
						readOnly
					/>
				</div>

				<div style={{ gridColumn: "1 / -1", gridRow: "5" }}>
					<span>Observações</span>
					<Input
						value={props.timeline_info.treatment.execution.observations ?? "-"}
						style={{
							backgroundColor: "rgba(10, 10, 10, 0.05)",
						}}
						readOnly
					/>
				</div>
			</div>
		</div>
	);
}
