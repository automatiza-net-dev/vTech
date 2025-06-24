import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";

import { Button, FormHandler, InputDateRange, Select } from "infinity-forge";

import * as S from "./styles";

function Filters({ filters, setFilters, setReload, setValues }) {
	const { businessUnits } = useBusinessUnitsByUser(false, false);

	function handleSubmit() {
		setFilters({ ...filters, noSearch: false });
		setReload((prv) => !prv);
	}
	return (
		<S.Filters>
			<FormHandler
				cleanFieldsOnSubmit={false}
				customAction={{
					Component: () => <Button text="Enviar" onClick={handleSubmit} />,
				}}
				onChangeForm={{
					callbackResult: (formValues) => {
						setFilters(formValues);
					},
				}}
			>
				<Select
					onlyOneValue
					name="businessUnit"
					label="Unidade"
					options={businessUnits?.map((unit) => ({
						label: unit?.fantasyName,
						value: unit?.id,
					}))}
					onChangeInput={(val) => {
						setValues((prv) => ({
							...prv,
							clinicFantasyName: businessUnits.find((unit) => unit?.id === val)
								?.fantasyName,
						}));
					}}
				/>
			</FormHandler>
		</S.Filters>
	);
}

export default Filters;
