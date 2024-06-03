import { useRouter } from "next/router";

import moment from "moment";
import {
  FormHandler,
  updateRoute,
  DatePickerInput,
} from "infinity-forge";

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
          toDate: moment(router.query.toDate || moment().format("DD-MM-YYYY"), "DD-MM-YYYY").toDate(),
          fromDate: moment(router.query.fromDate || moment().format("DD-MM-YYYY"), "DD-MM-YYYY").toDate(),
        }}
        onChangeForm={{
          callbackResult: ({ fromDate }: FiltersDashboardParams) => {
            if(moment(fromDate).format("DD-MM-YYYY") !== (router.query as any).fromDate) {
              updateRoute({
                params: {
                  fromDate: moment(fromDate)
                    .startOf("month")
                    .format("DD-MM-YYYY"),
                  toDate: moment(fromDate).endOf("month").format("DD-MM-YYYY"),
                },
                router,
              });
            }
          },
        }}
      >
        <DatePickerInput
          hasIcon
          name="fromDate"
          typePicker="month"
          maxDate={new Date()}
        />
      </FormHandler>
    </S.FiltersDashboard>
  );
}
