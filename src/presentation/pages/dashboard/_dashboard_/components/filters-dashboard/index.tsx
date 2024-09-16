import { useRouter } from "next/router";

import moment from "moment";
import { FormHandler, InputDatePicker, updateRoute } from "infinity-forge";

import * as S from "./styles";

type FiltersDashboardParams = {
  fromDate: Date;
  ToDate: Date;
};

export function FiltersDashboard() {
  const router = useRouter();

  return (
    <S.FiltersDashboard>
      <FormHandler
        initialData={{
          toDate: moment(
            router.query.toDate || moment().format("YYYY-MM-DD"),
            "YYYY-MM-DD"
          ).toDate(),
          fromDate: moment(
            router.query.fromDate || moment().format("YYYY-MM-DD"),
            "YYYY-MM-DD"
          ).toDate(),
        }}
        onChangeForm={{
          callbackResult: ({ fromDate }: FiltersDashboardParams) => {
            const fromDateStartMonth = moment(fromDate)
              .startOf("month")
              .format("YYYY-MM-DD");

            if (fromDateStartMonth !== (router.query as any).fromDate) {
           
              updateRoute({
                params: {
                  fromDate: fromDateStartMonth,
                  toDate: moment(fromDate).endOf("month").format("YYYY-MM-DD"),
                },
                router,
              });
            }
          },
        }}
      >
        <InputDatePicker
          name="fromDate"
          mode="month"
          date={{}}
          language="pt"
        />
      </FormHandler>
    </S.FiltersDashboard>
  );
}
