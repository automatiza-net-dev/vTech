import { FormHandler, InputSwitch } from "infinity-forge";
import { useScheduling } from "../../context";

export function SwitchToggleCancelledEvents({ data }) {
  const selectedDate = useScheduling((state) => state.selectedDate);
  const setRemovedCancelledEvents = useScheduling(
    (state) => state.setRemovedCancelledEvents
  );

  return (
    <FormHandler
      initialData={{ canceled_schedules: true }}
      onChangeForm={{
        callbackResult: (dataForm) => {
          setRemovedCancelledEvents(dataForm.canceled_schedules);
        },
        additionalDependencies: [data, selectedDate],
      }}
    >
      <InputSwitch name="canceled_schedules" label="Listar cancelados?" />
    </FormHandler>
  );
}
