import { useLoadAllAvailableUnits } from "@/presentation/hooks";
import { FormHandler, InputDateRange, Select } from "infinity-forge";

import * as S from "./styles";
import { useRouter } from "next/router";
import moment from "moment";

export function AdminFilters() {
  const businessUnits = useLoadAllAvailableUnits();

  const router = useRouter()

  return (
    <S.AdminFilters className="filters">
      <FormHandler
        initialData={{ units:  Array.isArray(router.query.units) ? router.query.units : [router.query.units], fromDate: moment(router.query.fromDate).toDate(), toDate: moment(router.query.toDate).toDate() }}
        onChangeForm={{
          callbackResult: (data) => {
            
            router.replace({ query: { fromDate: moment(data.fromDate).format("YYYY-MM-DD"), toDate: moment(data.toDate).format("YYYY-MM-DD"), units: data.units } })
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


