import { Modal, useScheduling } from "@/presentation";
import { FormCreateScheduling } from "./form-create-scheduling";

export function ModalCreateScheduling() {
  const createSchedulingArgs = useScheduling(
    (state) => state.createSchedulingArgs
  );
  const setCreateSchedulingArgs = useScheduling(
    (state) => state.setCreateSchedulingArgs
  );

  if (!createSchedulingArgs) {
    return <></>;
  }


  return (
    <Modal
      maxwidth="800px"
      stateModal={true}
      disableOverflow
      onCloseModal={() => setCreateSchedulingArgs(null)}
    >
      <FormCreateScheduling />
    </Modal>
  );
}
