import {
	Column,
	Popconfirm,
	useMutation,
	useQueryClient,
	useToast,
} from "infinity-forge";
import { FiTrash2 } from "react-icons/fi";
import moment from "moment";

import { ScheduleVaccine } from "@/domain";
import { NameVaccine } from "./name-vaccine";
import { timelineService } from "@/OLD/services/timeline.service";
import { AxiosError } from "axios";

export const columns: Column<ScheduleVaccine>[] = [
	{
		id: "patient",
		label: "Vacina / Vermífugo",
		hasAsc: false,
		width: 200,
		Component: {
			Element: (props) => <NameVaccine {...props} />,
			props: {},
		},
	},
	{
		id: "protocol",
		label: "Protocolo | Qtd. doses | intervalo",
		hasAsc: false,
		width: 300,
		Component: {
			Element: (props) => (
				<div>
					{props.protocol.name} | {props.protocol.doses} |
					{props.protocol.interval}
				</div>
			),
			props: {},
		},
	},
	{
		id: "vaccine",
		label: "Tipo",
		hasAsc: false,
		width: 200,
		Component: {
			Element: (props) => (
				<div>{props?.vaccine?.type === "vaccine" ? "Vacina" : "Vermífugo"}</div>
			),
			props: {},
		},
	},
	{
		id: "created_at",
		label: "Data de criação",
		hasAsc: false,
		width: 200,
		Component: {
			Element: (props) => (
				<div>{moment(props.created_at).format("DD/MM/YYYY")}</div>
			),
			props: {},
		},
	},
	{
		id: "user",
		label: "Responsável",
		hasAsc: false,
		width: 200,
		Component: {
			Element: (props) => <div>{props.user.name}</div>,
			props: {},
		},
	},
	{
		id: "actions",
		label: "",
		hasAsc: false,
		width: 50,
		Component: {
			Element: (props) => {
				const { createToast } = useToast();
				const queryClient = useQueryClient();

				const deleteVaccineRecord = useMutation({
					queryKey: ["sql-vaccine", props.id],
					queryFn: async () => {
						await timelineService.deleteVaccine(props.id);

						queryClient.invalidateQueries(["LoadAllPatientVaccines"]);
					},
					onError(error) {
						if (error instanceof AxiosError) {
							createToast({
								message:
									error.response?.data?.message ?? "Erro excluindo registro",
								status: "error",
							});
							return;
						}

						createToast({
							message: "Erro excluindo registro",
							status: "error",
						});
					},
				});

				return (
					<Popconfirm
						onConfirm={async () => {
							deleteVaccineRecord.mutate();
						}}
						idTooltip="a"
						title="Você deseja mesmo apagar esse item?"
						position="top-right"
					>
						<FiTrash2
							style={{
								cursor: "pointer",
								color: "red",
							}}
						/>
					</Popconfirm>
				);
			},
			props: {},
		},
	},
];
