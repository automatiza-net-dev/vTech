import { useEffect } from "react";
import { useRouter } from "next/router";

import { useFormikContext } from "formik";
import { Select, useAuthAdmin } from "infinity-forge";

import {
  useLoadPatient,
  useLoadSchedule,
  useLoadAllScheduleServicesGroups,
} from "@/presentation";
import { User } from "@/domain";
import { RemoteSystem } from "@/data";
import { TypesAutomatiza, container } from "@/container";

export function SelectTypeService({
  initialService,
}: {
  initialService?: string;
}) {
  const router = useRouter();
  const scheduleId = router.query?.scheduleId as string | undefined;

  const patient = useLoadPatient();
  const { GetUser } = useAuthAdmin();
  const schedule = useLoadSchedule(scheduleId);
  const { setFieldValue } = useFormikContext();

  const user = GetUser<User>();

  const { data, isFetching } = useLoadAllScheduleServicesGroups();


  async function AddInitialValueInResumeInput(value: string) {
    const optionSelected = data?.find((option) =>
      option.types.find((type) => type.id === value)
    );

    const resume = optionSelected?.types.find(
      (type) => type.id === value
    )?.resume;

    const response = await container
      .get<RemoteSystem>(TypesAutomatiza.RemoteSystem)
      .replace({
        businessUnitId: user.unit?.id,
        dependentId: patient?.data?.id,
        tutorId: patient?.data?.tutor?.id,
        userId: user?.user?.id,
        base: resume,
      });

    setFieldValue("protocol", response.result);
  }

  useEffect(() => {
    const initialServiceTypeId = schedule?.data?.serviceType?.id;

    if (schedule && initialServiceTypeId && router.isReady) {
      AddInitialValueInResumeInput(initialServiceTypeId);
    }
  }, [router.isReady]);

  if (!data || isFetching) {
    return <></>;
  }

  return (
    <Select
      menuPlacement={"bottom"}
      isGroup
      onChangeSelect={(ev) => {
        const value = (ev as string[])[0];

        AddInitialValueInResumeInput(value);
      }}
      disabled={!!initialService}
      name="scheduleServiceId"
      loading={isFetching}
      placeholder="Selecione o tipo de atendimento"
      options={data?.reduce((reducer: any, result: any) => {
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
      }, []) || []}
    />
  );
}
