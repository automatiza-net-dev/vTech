import { Error } from "@/presentation";

import { Login } from "../login";
import { useAuthFranchisor } from "../context";

export function PrivatePageFranchisor({ children }: { children: React.ReactNode }) {
  const { user } = useAuthFranchisor();

  if (user) {
    return <Error name="private-page">{children}</Error>;
  }

  return (
    <Error name="private-page">
      <Login />
    </Error>
  );
}
