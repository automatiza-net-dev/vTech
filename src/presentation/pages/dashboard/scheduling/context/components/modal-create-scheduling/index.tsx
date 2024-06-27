import { Modal } from "infinity-forge";

import { useScheduling } from "@/presentation";
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
      styles={{ maxWidth: "1200px", width: "100%" }}
      open={!!createSchedulingArgs}
      onClose={() => setCreateSchedulingArgs(null)}
    >
      <FormCreateScheduling />
    </Modal>
  );
}
