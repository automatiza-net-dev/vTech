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
          const label = `${item?.itemProdutividade || ""} ${
            item.executionDate !== "-"
              ? item?.executionDate
              : item.scheduleDate !== "-"
              ? item?.scheduleDate
              : ""
          }`;

          const id =
            String(item?.treatmentId) +
            String(item?.treatmentItemId) +
            String(item?.treatmentExecutionId) +
            String(index);

          if (!item.itemProdutividade) {
            return <></>;
          }

          return (
            <div key={String(id)} className="content">
              <div className="input-box">
                <input
                  id={String(id)}
                  type="checkbox"
                  disabled={
                    !!(
                      item?.executionDate !== "-" || item?.scheduleDate !== "-"
                    )
                  }
                  checked={
                    !!values?.executions?.find((item) => item?.id === id)
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFieldValue("executions", [
                        ...values?.executions,
                        {
                          ...item,
                          checked: true,
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
                {item?.produto} - {label}
              </label>
            </div>
          );
        })}
      </div>
    </S.ServiceStages>
  );
}
