import { currencyFormatter } from "@/OLD/components/Budget";
import { authorizationFormater } from "../../utils";

export function PaymentHeader({ paymentsList }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
      }}
      className="font-16-medium"
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <div>
          {paymentsList?.[0]?.paymentMethod?.description}
          &nbsp;
          {paymentsList?.[0]?.qty_installments > 1 ? "(Parcelado)" : ""}
          &nbsp;
          {paymentsList?.[0]?.flag?.description
            ? paymentsList?.[0]?.flag?.description
            : ""}
          &nbsp;
          {paymentsList?.[0]?.paymentMethod?.type}
        </div>
        <div>
          {currencyFormatter(
            paymentsList.reduce((acc, current) => acc + current.total_value, 0)
          )}
        </div>
        <div>{paymentsList?.length}x</div>
      </div>
      <div style={{ display: "flex" }}>
        {paymentsList?.[0]?.pending && "Pendente"}
        {authorizationFormater(paymentsList?.[0], "payment")}
      </div>
    </div>
  );
}
