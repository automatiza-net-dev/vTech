import { LoaderCircle } from "infinity-forge";
import { useFormikContext } from "formik";
import { useLoadSyncableScheduleExecutions } from "@/presentation";
import * as S from "./styles";
import { Fragment } from "react";

export function ServiceStages() {
  const { initialValues, setFieldValue, values } = useFormikContext<any>();

  const { data, isFetching } = useLoadSyncableScheduleExecutions({
    scheduled: true,
    idPaciente: initialValues?.patientId?.[0],
    tutorId: initialValues?.holderId?.[0],
  });

  const groupedData = data?.reduce((acc, item) => {
    if (!item.produto) return acc;
    if (!acc[item.produto]) {
      acc[item.produto] = [];
    }
    acc[item.produto].push(item);
    return acc;
  }, {});

  return (
    <S.ServiceStages>
      {isFetching && <LoaderCircle size={30} color="#000" />}
      <div className="radio-box">
        {groupedData &&
          Object.entries(groupedData).map(([produto, items]: any) => (
            <div key={produto} className="group">
              {items.map((item, index) => {
                const label = `${item?.itemProdutividade || ""}`;

                const id =
                  String(item?.treatmentId) +
                  String(item?.treatmentItemId) +
                  String(item?.treatmentExecutionId) +
                  String(index);

                if (!item.itemProdutividade) {
                  return null;
                }

                return (
                  <Fragment key={id}>
                    {index === 0 && <h3>{produto}</h3>}

                    <div className="content">
                      <div className="input-box">
                        <input
                          id={id}
                          type="checkbox"
                          disabled={
                            item.financeBlocked ||
                            !!(
                              item?.executionDate !== "-" ||
                              item?.scheduleDate !== "-"
                            )
                          }
                          checked={
                            !!values?.executions?.find(
                              (exec) => exec?.id === id,
                            )
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
                                values?.executions?.filter(
                                  (exec) => exec?.id !== id,
                                ),
                              );
                            }
                          }}
                        />
                      </div>

                      <div className="text">
                        <label htmlFor={id}>{label}</label>

                        <div className="information">
                          {item.scheduleDate !== "-"
                            ? item?.scheduleDate
                            : "Não agendado"}
                        </div>

                        <div className="information">
                          {item.executionDate !== "-"
                            ? item?.executionDate
                            : "Não Executado"}
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          ))}
      </div>
    </S.ServiceStages>
  );
}
