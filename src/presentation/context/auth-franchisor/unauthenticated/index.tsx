import {useAuthFranchisor} from "../context";

export function UnauthenticatedTemplate({ children }) {
  const { user } = useAuthFranchisor();

  if (user) {
    return <></>;
  }

  return children
}
