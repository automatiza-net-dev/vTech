import { useLoadCampaings, useLoadTutorOrigins } from "@/presentation/hooks";
import { useFormikContext } from "formik";
import { Select } from "infinity-forge";

export function SelectOrigin() {
	const { data, isFetching } = useLoadTutorOrigins();

	const { values } = useFormikContext();

	const campaignsQuery = useLoadCampaings({
		active: true,
		clientOriginId: values?.clientOriginId,
	});
	const selectedOrigin = data?.find((cq) => cq.id === values?.clientOriginId);
	const shouldDisplayMarketingSelect = selectedOrigin
		? selectedOrigin.default ||
			selectedOrigin.description === "Campanha de Mkt Ativa"
		: false;

	return (
		<div style={{ display: "flex", gap: 15 }}>
			<Select
				onlyOneValue
				menuPlacement="bottom"
				name="clientOriginId"
				label="Como conheceu a clínica?"
				loading={isFetching}
				options={
					data?.map((origin) => ({
						label: origin.description,
						value: origin.id,
					})) || []
				}
			/>

			{shouldDisplayMarketingSelect && (
				<Select
					onlyOneValue
					menuPlacement="bottom"
					name="marketingCampaignId"
					label="Campanha/Mídia"
					loading={campaignsQuery.isLoading}
					options={
						campaignsQuery.data?.map((origin) => ({
							label: origin.description,
							value: origin.id,
						})) || []
					}
				/>
			)}
		</div>
	);
}
