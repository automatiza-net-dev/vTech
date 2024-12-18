import { LoaderCircle } from "infinity-forge";

import { useFormikContext } from "formik";

import { useLoadSyncableScheduleExecutions } from "@/presentation";

import * as S from "./styles";

export function ServiceStages() {
  const { initialValues, setFieldValue, values } = useFormikContext<any>();

  const { data, isFetching } = useLoadSyncableScheduleExecutions({
    scheduled: true,
    idPaciente: initialValues?.patientId?.[0],
  });

  return (
    <S.ServiceStages>
      {isFetching && <LoaderCircle size={30} color="#000" />}

      <div className="radio-box">
        {data?.map((item, index) => {
          const aditionalInformation = {
            label: `${item?.itemProdutividade || ""} ${
              item.executionDate !== "-"
                ? item?.executionDate
                : item.scheduleDate !== "-"
                ? item?.scheduleDate
                : ""
            }`,

            disabled: () => {
              if (item?.executionDate !== "-" || item?.scheduleDate !== "-") {
                return true;
              } else {
                return false;
              }
            },
          };

          const id =
            item?.treatmentId +
            item?.treatmentItemId +
            item?.treatmentExecutionId +
            index;

          return (
            <div key={String(id)} className="content">
              <div className="input-box">
                <input
                  id={String(id)}
                  type="checkbox"
                  disabled={aditionalInformation?.disabled()}
                  checked={
                    !!values?.executions?.find((item) => item?.id === id)
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFieldValue("executions", [
                        ...values?.executions,
                        {
                          ...item,
                          id,
                        },
                      ]);
                    } else {
                      setFieldValue(
                        "executions",
                        values?.executions?.filter((item) => item?.id !== id)
                      );
                    }
                  }}
                />
              </div>

              <label htmlFor={String(id)}>
                {item?.produto} - {aditionalInformation?.label}
              </label>
            </div>
          );
        })}
      </div>
    </S.ServiceStages>
  );
}
