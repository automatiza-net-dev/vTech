import { useMemo } from "react";
import { Select, FormHandler } from "infinity-forge";

export function SelectMidia({ data, setData, options, disabled }) {
  const memoizedOptions = useMemo(() => {
    const mappedOptions =
      options?.map((origin) => ({
        label: origin?.description,
        value: origin?.id,
      })) || [];

    if (data?.clientOriginItemDescription) {
      mappedOptions.push({
        label: data?.clientOriginItemDescription,
        value: data?.clientOriginItemDescription,
      });
    }

    return mappedOptions;
  }, [options, data?.clientOriginItemDescription]);

  return (
    <div className="uk-width-1-4 uk-margin-small-right">
      <label>Campanha mídia</label>
      <FormHandler
        onChangeForm={{
          callbackResult: async (props) => {
            const midia = props?.midia;

            if (midia) {
              if (typeof midia === "number") {
                const updatedData = {
                  ...data,
                  clientOriginItemDescription: null,
                };
                setData({ ...updatedData, marketingCampaignId: midia });
                return;
              }

              const updatedData = { ...data, marketingCampaignId: null };
              setData({
                ...updatedData,
                clientOriginItemDescription: midia,
              });
              return;
            }
          },
        }}
      >
        <Select
          disabled={disabled}
          creatableSelect
          menuPlacement="bottom"
          name="midia"
          options={memoizedOptions}
          onlyOneValue
          value={
            data?.marketingCampaignId
              ? data.marketingCampaignId
              : memoizedOptions.find(
                  (option) => option.value === data?.clientOriginItemDescription
                )?.value
          }
        />
      </FormHandler>
    </div>
  );
}
