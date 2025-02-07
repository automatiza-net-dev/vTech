import { useRouter } from "next/router";

import { useDashboard } from "../../context";

import moment from "moment";
import { FormHandler, InputDatePicker } from "infinity-forge";

import * as S from "./styles";

type FiltersDashboardParams = {
  fromDate: Date;
  ToDate: Date;
};

export function FiltersDashboard() {
  const router = useRouter();

  const { filters, setFilters } = useDashboard();

  return (
    <S.FiltersDashboard>
      <FormHandler
        initialData={{ fromDate: moment(filters?.fromDate).toDate() }}
        onChangeForm={{
          callbackResult: ({ fromDate }: FiltersDashboardParams) => {
            const fromDateStartMonth = moment(fromDate)
              .startOf("month")
              .format("YYYY-MM-DD");

            if (fromDateStartMonth !== (router.query as any).fromDate) {
              setFilters({
                fromDate: fromDateStartMonth,
                toDate: moment(fromDate).endOf("month").format("YYYY-MM-DD"),
              });
            }
          },
        }}
      >
        <InputDatePicker name="fromDate" mode="month" date={{}} language="pt" />
      </FormHandler>
    </S.FiltersDashboard>
  );
}
