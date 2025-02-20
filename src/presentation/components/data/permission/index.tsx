import { useMe, useVerifyPermissions } from "@/presentation/hooks";
import { LoaderCircle } from "infinity-forge";

type PermissionItemProps = {
  hash: string;
  children?: React.ReactNode;
  DaniedComponent?: () => React.ReactNode;
};

export function PermissionItem(props: PermissionItemProps) {
  const { isFetching } = useMe();
  const hasPermission = useVerifyPermissions(props?.hash);

  if(isFetching) {
    return <LoaderCircle size={30} color="#000" />
  }

  if (!hasPermission) {
    return props?.DaniedComponent ? <props.DaniedComponent /> : <></>;
  }

  return props?.children;
}
