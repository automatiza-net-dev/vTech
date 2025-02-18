import { useMe, useVerifyPermissions } from "@/presentation/hooks";
import { LoaderCircle } from "infinity-forge";

type PermissionItemProps = {
  hash: string;
  children?: React.ReactNode;
  DaniedComponent?: () => React.ReactNode;
};

export function PermissionItem({
  hash,
  children,
  DaniedComponent,
}: PermissionItemProps) {
  const { isFetching } = useMe();
  const hasPermission = useVerifyPermissions(hash);

  if(isFetching) {
    return <LoaderCircle size={30} color="#000" />
  }

  if (!hasPermission) {
    return DaniedComponent ? <DaniedComponent /> : <></>;
  }

  return children;
}
