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
            if (
              moment(fromDate).format("YYYY-MM-DD") !==
              (router.query as any).fromDate
            ) {
              updateRoute({
                params: {
                  fromDate: moment(fromDate)
                    .startOf("month")
                    .format("YYYY-MM-DD"),
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
          date={{
            maxDate: new Date(),
          }}
          language="pt"
        />
      </FormHandler>
    </S.FiltersDashboard>
  );
}
