import { FormCreateTutor, PermissionItem } from "@/presentation";

export function ButtonCreateTutor({ refetch, setInitialHolder, origin }: any) {
  async function onSuccess(data) {
    await refetch();
    setInitialHolder(data.id);
  }

  return (
    <PermissionItem hash={"TUT01" || "PET01"}>
      <FormCreateTutor
        isModal
        origin={origin || "Agenda"}
        onSuccess={onSuccess}
      />
    </PermissionItem>
  );
}
