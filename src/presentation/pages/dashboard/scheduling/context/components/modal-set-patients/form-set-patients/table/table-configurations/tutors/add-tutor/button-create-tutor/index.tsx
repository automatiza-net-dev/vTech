import { useState } from "react";

import { Button } from "infinity-forge";
import { Modal, PermissionItem } from "@/presentation";
import { CreateTutor } from "@/OLD/components/Tutor/Create";

export function ButtonCreateTutor({ refetch, setInitialHolder }: any) {
  const [visible, setVisible] = useState(false);

  async function onSuccess(data) {
    await refetch();
    setInitialHolder(data.id);
  }

  return (
    <PermissionItem hash={"TUT01" || "PET01"}>
      {visible && (
        <Modal stateModal={visible} maxwidth="1200px" setModal={setVisible}>
          <CreateTutor
            onSuccess={onSuccess}
            isSchedule
            setVisible={setVisible}
          />
        </Modal>
      )}

      <Button
        text="Novo Tutor"
        type="button"
        onClick={() => setVisible(true)}
      />
    </PermissionItem>
  );
}

//
