import { useState } from "react";

import {
  api,
  useQuery,
  FormHandler,
  PageWrapper,
  InputDatePicker,
  LoaderCircle,
} from "infinity-forge";
import moment from "moment";

import { ReportDRE } from "./report";

import * as S from "./styles";

export function DreReport() {
  const [dateDRE, setDateDRE] = useState(null);

  const { data, mutate, isFetching } = useQuery({
    queryKey: ["DRE", dateDRE],
    queryFn: async () => {
      const response = await api({
        url: `reports/dre-groups?period=${moment(dateDRE).format(
          "MM/YYYY"
        )}&v2=true`,
        method: "get",
      });

      return response
    },
    enableCache: true,
  });

  return (
    <PageWrapper
      title={
        !dateDRE
          ? "Relatório DRE"
          : `Relatório DRE período ${moment(dateDRE).format("MM/YYYY")}`
      }
      breadCrumb={[]}
    >
      <S.DreReport>
        {!dateDRE && (
          <FormHandler
            initialData={{ competence: dateDRE }}
            onSucess={async (data) => {
              console.log(data);
              setDateDRE(data.competence);
            }}
            button={{ text: "CARREGAR DRE" }}
          >
            <div className="filters-container">
              <InputDatePicker
                language="pt"
                date={{ maxDate: new Date() }}
                label="Competencia"
                name="competence"
                mode="month"
              />
            </div>
          </FormHandler>
        )}

        {isFetching && <LoaderCircle size={30} color="#000" />}
      </S.DreReport>

      {data && dateDRE && !isFetching && (
        <ReportDRE dre={data as any} mutate={mutate} setDateDRE={setDateDRE} />
      )}
    </PageWrapper>
  );
}
