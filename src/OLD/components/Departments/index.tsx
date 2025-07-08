import { useState, useEffect, useCallback } from "react";

// Utils
import moment from "moment";
import "moment/locale/pt-br";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Icons
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

// Components
import { Select, Table, Popconfirm } from "antd";
import {
	api,
	BadRequestError,
	Button,
	PageWrapper,
	useToast,
} from "infinity-forge";
import { useQuery, Modal } from "infinity-forge";
import columns from "./Columns";
import { Container, Input } from "./styles";
import CreateDepartment from "./Create";

const { Option } = Select;

const mapper = ({ data }) => ({
	id: data.id,
	description: data.description,
	status: data.active ? "Ativo" : "Inativo",
	createdAt: moment(data?.created_at).format("DD/MM/YYYY - HH:mm"),
});

function Departments() {
	const { createToast } = useToast();

	const [filters, setFilters] = useState<Record<string, string | boolean>>({
		noSearch: true,
		type: "sistema",
	});
	const [createFormState, setCreateFormState] = useState<"closed" | "open">(
		"open",
	);

	const departmentsQuery = useQuery({
		queryKey: ["departments"],
		queryFn: () => {
			return api<
				{
					id: number;
					description: string;
					image: string | null;
					active: boolean;
					created_at: string;
					create_user_name: string;
					update_user_name: string | null;
				}[]
			>({
				url: "departments",
				method: "get",
				body: filters,
			});
		},
		enabled: !filters.noSearch,
	});

	const deleteDepartment = useCallback(async (deptoID: number) => {
		try {
			await api({
				url: `departments/${deptoID}`,
				method: "delete",
			});
			departmentsQuery.refetch();
		} catch (err) {
			const msg =
				err instanceof BadRequestError
					? err.error.message
					: "Erro ao excluir departamento";
			createToast({ status: "error", message: msg });
		}
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				departmentsQuery.refetch();
			}
		};

		document.addEventListener("keypress", handleKeyDown);

		return () => document.removeEventListener("keypress", handleKeyDown);
	}, []);

	return (
		<PageWrapper title="Controle de departamentos">
			<Container>
				<div className="uk-margin-right uk-flex uk-flex-between uk-margin-top">
					<Input>
						<input
							type="search"
							placeholder="Descrição"
							onChange={(e) =>
								setFilters({
									...filters,
									description: normalizeStr(e.target.value),
								})
							}
						/>
					</Input>

					<div className="uk-width-1-5 uk-margin-small-right">
						<label>Status</label>
						<Select
							onChange={(val) => {
								if (val === "all") {
									const newObj = { ...filters };
									delete newObj?.active;
									return setFilters(newObj);
								}
								setFilters({ ...filters, active: val });
							}}
							className="uk-width-1-1"
						>
							<Option value={"Ativos"}>Ativo</Option>
							<Option value={"Inativos"}>Inativo</Option>
							<Option value="all">Todos</Option>
						</Select>
					</div>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						gap: "10px",
						marginTop: "5px",
					}}
				>
					<Button
						onClick={() => {
							if (!filters.noSearch) {
								departmentsQuery.refetch();
							} else {
								setFilters({ ...filters, noSearch: false });
							}
						}}
						text="Filtrar"
						disabled={departmentsQuery.isFetching}
					/>
					<Button
						onClick={() => {
							setCreateFormState("open");
						}}
						text="Cadastrar"
					/>
				</div>
				<hr />
				<Table
					className="uk-margin-top"
					dataSource={departmentsQuery.data
						?.map((d) =>
							mapper({
								data: d,
							}),
						)
						.map((d) => ({
							...d,
							actions: (
								<div className="uk-flex uk-flex-around">
									<MdEdit size={20} onClick={() => {}} />

									<Popconfirm
										title="Deseja remover esse departamento?"
										onConfirm={() => deleteDepartment(d.id)}
										okText="Sim"
										cancelText="Não"
										placement="left"
									>
										<FaRegTrashAlt
											style={{ cursor: "pointer" }}
											onClick={() => {}}
										/>
									</Popconfirm>
								</div>
							),
						}))}
					columns={columns}
					locale={{
						emptyText:
							Object.keys(filters).length === 0 ? (
								<>Pesquise acima para exibir o resultado</>
							) : (
								<>Nenhum resultado encontrado</>
							),
					}}
				/>

				<Modal
					styles={{
						width: "100%",
						maxWidth: "800px",
					}}
					title="Cadastrar departamento"
					open={createFormState === "open"}
					onClose={() => setCreateFormState("closed")}
				>
					<CreateDepartment
						shouldClose={() => {
							setCreateFormState("closed");
							departmentsQuery.refetch();
						}}
					/>
				</Modal>
			</Container>
		</PageWrapper>
	);
}

export default Departments;
