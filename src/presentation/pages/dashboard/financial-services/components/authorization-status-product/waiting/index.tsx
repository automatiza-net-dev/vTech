import { Product } from "@/domain";
import { Cart } from "../../add-product";
import { Icon } from "infinity-forge";

export function Waiting(props: Product | Cart) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
     <Icon name="IconExclamation" fill="#000"  />
      
      <span className="font-13-regular">Pendente de liberação</span>
    </div>
  );
}
