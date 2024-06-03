import { useContext } from "react";
import { AppContext } from "@/OLD/context/appContext";

export function useAuth() {
  const context = useContext(AppContext);
  return context;
}
