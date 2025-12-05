import { useState } from "react";

import {
  api,
  FormHandler,
  PageWrapper,
  LoaderCircle,
  InputDatePicker,
} from "infinity-forge";
import * as yup from "yup"
import moment from "moment";

import { ReportDRE } from "./report";

import * as S from "./styles";
import { useQuery } from "infinity-forge";

export function DreReport() {
  const [months, setMonths] = useState(0);
  const [dateDRE, setDateDRE] = useState(null);


  const { data, mutate, isFetching } = useQuery({
    queryKey: ["DRE", dateDRE, months],
    queryFn: async () => {
      const response = await api({
        url: `reports/dre-groups?period=${moment(dateDRE).format(
          "MM/YYYY"
        )}&months=${months}`,
        method: "get",
      });

      return response;
    },
    enabled: !!dateDRE
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
              setDateDRE(data.competence);
            }}
            schema={{ competence: yup.string().required("Campo requerido") }}
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
        <ReportDRE
          dre={data as any}
          mutate={mutate}
          dateDRE={dateDRE}
          setDateDRE={setDateDRE}
          months={months}
          setMonths={setMonths}
        />
      )}
    </PageWrapper>
  );
}
