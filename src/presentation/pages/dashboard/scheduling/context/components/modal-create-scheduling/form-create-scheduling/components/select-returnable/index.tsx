import { useEffect } from "react";

import moment from "moment";
import { useFormikContext } from "formik";
import { Select, useToast } from "infinity-forge";

import {
  useLoadAllScheduleServicesGroups,
  useLoadReturnablesSchedulePatient,
} from "@/presentation";

function SelectComponent({ isReturn }) {
  
  const { createToast} = useToast()
  const { values, setFieldValue } = useFormikContext<any>();

  const serviceType = values["scheduleServiceTypeId"] as any;

  const { data, isLoading } = useLoadReturnablesSchedulePatient(
    (values as any).patientId
  );

  useEffect(() => {
    if (data && data.length === 0 && isReturn && !isLoading) {
      setFieldValue("scheduleServiceTypeId", []);

      createToast({
        message: "Nenhuma consulta para reagendar.",
        status: "error",
      });
  
    }
  }, [data, isLoading, serviceType]);

  if (data && data.length === 0) {
    return <></>;
  }

  return (
    <Select
      label="Selecione a consulta de retorno"
      name="scheduleOriginId"
      placeholder="Selecione a consulta de retorno"
      options={
        data?.map((item) => ({
          label:
            moment.parseZone(item.start_hour).format("DD/MM/YYYY hh:mm") +
            " " +
            item.description,
          value: item.id,
        })) || []
      }
    />
  );
}

export function SelectReturnable() {
  const { initialValues, values, setFieldValue } = useFormikContext<any>();

  const initialValue =
    values["scheduleServiceTypeId"] || initialValues["scheduleServiceTypeId"];

  const { data } = useLoadAllScheduleServicesGroups();

  const options = data?.reduce((reducer: any, result) => {
    return [
      ...reducer,
      {
        label: result.description,
        options: result.types.map((type) => ({
          value: type.id,
          label: type.description,
        })),
      },
    ];
  }, []);

  const serviceSelected = options?.find((o) =>
    o.options.find((item) => {
      return (
        item.value === (values["scheduleServiceTypeId"][0] || initialValue[0])
      );
    })
  );

  const isReturn = serviceSelected?.label === "Retorno";

  useEffect(() => {
    if (!isReturn) {
      setFieldValue("scheduleOriginId", undefined);
    }
  }, [isReturn]);

  if (!isReturn) {
    return <></>;
  }

  return <SelectComponent isReturn={isReturn} />;
}
