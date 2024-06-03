import React, { useState } from "react";

import { Tutor } from "@/domain";
import { Edit } from "@/OLD/components/Tutor/Edit";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export default function TutorEditPage(props: Tutor) {
  const [visible, setVisible] = useState(false);

  const listTutorsPermission = useUserHasPermission("TUT00");

  return !listTutorsPermission || listTutorsPermission === "loading" ? (
    <AccessDenied loading={listTutorsPermission} />
  ) : (
    <div className="uk-padding">
      <Edit tutorId={props.id} setVisible={setVisible} />
    </div>
  );
}
