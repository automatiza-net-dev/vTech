import { useRouter } from "next/router";

import moment from "moment";
import { FormHandler, updateRoute, DatePickerInput } from "infinity-forge";

import * as S from "./styles";

type FiltersDashboardParams = {
  period: Date;
};

export function FiltersCrm() {
  const router = useRouter();

  return (
    <S.FiltersCrm>
      <FormHandler
        initialData={{
          period: moment(
            router.query.period || moment().format("YYYY-MM-DD"),
            "YYYY-MM-DD"
          ).toDate(),
        }}
        onChangeForm={{
          callbackResult: ({ period }: FiltersDashboardParams) => {
            if (
              moment(period).format("YYYY-MM-DD") !==
              (router.query as any).period
            ) {
              updateRoute({
                params: {
                  period: moment(period).startOf("month").format("YYYY-MM-DD"),
                },
                router,
              });
            }
          },
        }}
      >
        <DatePickerInput
          hasIcon
          name="period"
          typePicker="month"
          maxDate={new Date()}
        />
      </FormHandler>
    </S.FiltersCrm>
  );
}
