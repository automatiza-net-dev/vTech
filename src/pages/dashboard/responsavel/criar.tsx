import { useState } from "react";

import { useQueryClient } from "infinity-forge";

import { Modal, useLoadAllPatientTutorKEY } from "@/presentation";

import AccessDenied from "@/OLD/components/AccessDenied";
import { CreateTutor } from "@/OLD/components/Tutor/Create";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export default function TutorCreatePage() {
  const [visible, setVisible] = useState(false);

  const listTutorsPermission = useUserHasPermission("TUT00");

  const {refetch} = useQueryClient()
  const patientTutorKey = useLoadAllPatientTutorKEY()

  const props = {
    setVisible,
    isSchedule: true,
    onSuccess: () => {
      refetch(patientTutorKey)
    },
  };

  return !listTutorsPermission || listTutorsPermission === "loading" ? (
    <AccessDenied loading={listTutorsPermission} />
  ) : (
    <div className="uk-padding">
      <Modal stateModal={visible} maxwidth="1200px" setModal={setVisible}>
        <CreateTutor {...props} />
      </Modal>
    </div>
  );
}
