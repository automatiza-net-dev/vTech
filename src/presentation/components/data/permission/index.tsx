import { useVerifyPermissions } from "@/presentation/hooks";

export function PermissionItem({
  hash,
  children,
}: {
  hash: string;
  children: React.ReactNode;
}) {
  const hasPermission = useVerifyPermissions(hash);

  if (!hasPermission) {
    return <></>;
  }

  return children;
}
