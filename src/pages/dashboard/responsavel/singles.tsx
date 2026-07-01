import React from "react";

import { Single } from "@/OLD/components/Tutor/Single";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

export default function TutorSinglePage() {
  const listTutorsPermission = useUserHasPermission("TUT00");

  return !listTutorsPermission || listTutorsPermission === "loading" ? (
    <AccessDenied loading={listTutorsPermission} />
  ) : (
    <div className="uk-padding">
      <Single selectedId={undefined} setVisible={undefined} setCreatePetVisible={undefined} setVincPetVisible={undefined} />
    </div>
  );
}
