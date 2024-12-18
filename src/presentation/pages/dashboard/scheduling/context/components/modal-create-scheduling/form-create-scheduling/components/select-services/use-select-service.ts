import { useEffect } from "react";

import { useFormikContext } from "formik";
import { ScheduleServiceItem } from "@/domain";

export function useSelectService({
  scheduleServiceItems,
}: {
  scheduleServiceItems?: ScheduleServiceItem[];
}) {
  const { initialValues, setFieldValue, values } = useFormikContext<any>();

  const options = scheduleServiceItems?.reduce((reducer, result) => {
    const options = result.types.map((type) => {
      return {
        value: type.id,
        label: type.description,
        type: result.type,
      };
    });

    return [
      ...reducer,
      {
        label: result.description,
        hasServicesStage: !!options?.find(
          (b) =>
            b.type === "T" && b.value === values["scheduleServiceTypeId"][0]
        ),
        options,
      },
    ];
  }, [] as { label: string; hasServicesStage: boolean; options: { label: string; value: string; type: string }[] }[]);

  const hasServicesStage = options?.find((item) => item.hasServicesStage);

  function setTimingService(value: string[]) {
    const selectedValue = scheduleServiceItems?.find((item) =>
      item.types.find((type) => type.id === value[0])
    );
    const reserved_minutes = selectedValue?.types?.find(
      (type) => type.id === value[0]
    )?.reserved_minutes;

    setFieldValue("duration", reserved_minutes);
    setFieldValue("hasServicesStage", selectedValue?.type === "T");
  }

  const initialValue = initialValues["scheduleServiceTypeId"];

  useEffect(() => {
    if (
      scheduleServiceItems &&
      Array.isArray(initialValue) &&
      initialValue.length > 0
    ) {
      setTimingService(initialValue);
    }
  }, [initialValue, scheduleServiceItems]);

  useEffect(() => {
    if (!hasServicesStage) {
      setFieldValue("executions", []);
    }
  }, [hasServicesStage]);

  return { hasServicesStage, options, setTimingService };
}
