import { useAuthFranchisor } from "../context";

export function AuthenticatedTemplate({ children }) {
  const { user } = useAuthFranchisor();
  
  if (!user) {
    return <></>;
  }

  return <>{children}</>;
}
