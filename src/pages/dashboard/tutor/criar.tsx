import { useState } from "react";
import { useQueryClient } from "react-query";

import { CreateTutor } from "@/OLD/components/Tutor/Create";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Modal } from "@/presentation";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export default function TutorCreatePage() {
  const [visible, setVisible] = useState(false);

  const queryClient = useQueryClient();
  const listTutorsPermission = useUserHasPermission("TUT00");

  const props = {
    setVisible,
    isSchedule: true,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["RemoteLoadAllPatientTutor"],
      });
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
