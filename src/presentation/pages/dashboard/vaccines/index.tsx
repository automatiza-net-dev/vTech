import { useEffect, useState } from "react";

import {
	useLoadAllVaccinesProtocols,
	useLoadAllVaccinesProtocolsOnDemand,
} from "@/presentation";

import { ProtocolsTable } from "./components/protocols-table";

import { CreateVaccine } from "./components";
import { LayoutDashboard } from "@/presentation";
import { EditVaccine } from "./components/actions";
import { DeleteVaccine } from "./components/actions/delete-vaccine";
import { Input, FormHandler, PageWrapper, Button } from "infinity-forge";

import * as S from "./styles";
import { useSpecies } from "@/OLD/hooks/useSpecies";
import { AutoComplete } from "antd";
import { normalizeStr } from "@/OLD/utils/normalizeString";

export function VaccinesProtocols(props: { type: "vaccine" | "vermifuge" }) {
	const [params, setParams] = useState({ fetch: false });

	const vaccinesProtocols = useLoadAllVaccinesProtocolsOnDemand(params);
	const speciesQuery = useSpecies();

	useEffect(() => {
		function handleKeyDown(e) {
			if (e.key === "Enter") {
				vaccinesProtocols.refetch();
			}
		}

		document.addEventListener("keypress", handleKeyDown);

		return () => document.removeEventListener("keypress", handleKeyDown);
	}, []);

	const protocolsTableProps = {
		data: vaccinesProtocols.data,
		actions: [DeleteVaccine, EditVaccine],
		type: props?.type === "vaccine" ? "Vacina" : "Vermifugo",
	};

	return (
		<LayoutDashboard>
			<PageWrapper
				title={
					props.type === "vaccine" ? "Gestão de vacinas" : "Gestão de vermifugo"
				}
			>
				<S.Vaccine>
					<section>
						<FormHandler
							disableEnterKeySubmitForm
							initialData={params}
							onChangeForm={{
								callbackResult: (prv) => {
									setParams((old) => ({ ...old, ...prv }));
								},
							}}
						>
							<section className="input-container" style={{}}>
								<Input name="name" label="Nome da Vacina" />
								<Input name="protocol" label="Protocolo" />
								<div className="uk-width-1-1">
									<label>Espécie</label>
									<AutoComplete
										disabled={speciesQuery.loadingSpecies}
										className="uk-width-1-1"
										size="large"
										options={speciesQuery.species?.map((specie: any) => ({
											...specie,
											value: specie?.description,
										}))}
										onSelect={(_, option) =>
											setParams((old) => ({
												...old,
												specie: option?.id,
											}))
										}
										onClear={() =>
											setParams((old) => ({ ...old, specie: undefined }))
										}
										filterOption={(val, opt) =>
											normalizeStr(opt?.value.toUpperCase()).includes(
												normalizeStr(val?.toUpperCase()),
											)
										}
									/>
								</div>
							</section>
						</FormHandler>
						<div className="buttons-container">
							<Button
								text="Filtrar"
								style={{ marginTop: "10px" }}
								loading={vaccinesProtocols.isFetching || speciesQuery.loadingSpecies}
								onClick={() => {
									setParams((prv) => ({ ...prv, fetch: true }));
									vaccinesProtocols.mutate();
								}}
							/>
							<CreateVaccine type={props.type} />
						</div>
					</section>

					<hr />

					{vaccinesProtocols?.data && !vaccinesProtocols?.isLoading && (
						<ProtocolsTable {...protocolsTableProps} />
					)}
				</S.Vaccine>
			</PageWrapper>
		</LayoutDashboard>
	);
}
