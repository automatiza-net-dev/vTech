import { useVerifyPermissions } from "@/presentation/hooks";

type PermissionItemProps = {
  hash: string;
  children?: React.ReactNode;
};

export function PermissionItem({ hash, children }: PermissionItemProps) {
  const hasPermission = useVerifyPermissions(hash);

  if (!hasPermission) {
    return null;
  }

  return children;
}
