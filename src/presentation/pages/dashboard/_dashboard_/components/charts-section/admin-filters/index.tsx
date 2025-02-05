import moment from "moment";
import { FormHandler, InputDateRange, Select } from "infinity-forge";

import { useDashboard } from "../../../context";
import { useLoadAllAvailableUnits } from "@/presentation";

import * as S from "./styles";

export function AdminFilters() {

  const { setFilters } = useDashboard()

  const businessUnits = useLoadAllAvailableUnits();

  return (
    <S.AdminFilters className="filters">
      <FormHandler
        onChangeForm={{
          callbackResult: (data) => {
            setFilters({
              to: moment(data.toDate).format("YYYY-MM-DD"),
              from: moment(data.fromDate).format("YYYY-MM-DD"),
              units: data.units,
            })
          },
        }}
      >
        <Select
          label="Clínicas"
          menuPlacement="bottom"
          name="units"
          isMultiple={true}
          loading={businessUnits.isFetching}
          options={
            businessUnits?.data?.map((unit) => ({
              value: unit?.id,
              label: unit?.identification,
            })) || []
          }
        />

        <InputDateRange label="Período" names={["fromDate", "toDate"]} />
      </FormHandler>
    </S.AdminFilters>
  );
}
