import { useConfigurationsSystem } from "@/presentation";

import { AddProductDefault } from "./components";
import { CreateOdontogram } from "../../../odontologia";

export function AddProduct() {
  const { type } = useConfigurationsSystem();

  if (type === "Odonto") {
    return <CreateOdontogram />;
  }

  return <AddProductDefault />;
}
