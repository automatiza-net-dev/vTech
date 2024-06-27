import { FormCreateTutor, PermissionItem } from "@/presentation";

export function ButtonCreateTutor({ refetch, setInitialHolder }: any) {
  async function onSuccess(data) {
    await refetch();
    setInitialHolder(data.id);
  }

  return (
    <PermissionItem hash={"TUT01" || "PET01"}>
      <FormCreateTutor
        isModal
        origin="Agenda"
        onSuccess={onSuccess}
      />
    </PermissionItem>
  );
}

