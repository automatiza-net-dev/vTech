import { useLoadCampaings, useLoadTutorOrigins } from "@/presentation/hooks";
import { useFormikContext } from "formik";
import { Select } from "infinity-forge";

export function SelectOrigin(props: { errorMessage?: string }) {
  const { data, isFetching } = useLoadTutorOrigins();

  const { values } = useFormikContext();

  const campaignsQuery = useLoadCampaings({
    active: true,
    // @ts-ignore error
    clientOriginId: values?.clientOriginId,
  });

  // @ts-ignore error
  const selectedOrigin = data?.find((cq) => cq.id === values?.clientOriginId);
  const shouldDisplayMarketingSelect = selectedOrigin
    ? selectedOrigin.default ||
      selectedOrigin.description === "Campanha de Mkt Ativa"
    : false;

  return (
    <div style={{ display: "flex", gap: 15 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        <Select
          onlyOneValue
          menuPlacement="bottom"
          name="clientOriginId"
          label="Como conheceu a clínica?*"
          loading={isFetching}
          options={
            data?.map((origin) => ({
              label: origin.description,
              value: origin.id,
            })) || []
          }
        />
        {props.errorMessage && (
          <p style={{ color: "red" }}>{props.errorMessage}</p>
        )}
      </div>

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
