// @ts-nocheck
import { memo } from "react";

import AddPayments from "@/OLD/components/Notes/AddPayments";
import { DetailsPanel } from "../../Bill/Actions/AddBillPayment/DetailsPanel";

const Negotiation = memo(function Negotiation({
  budgetId,
  onUpdatePayment
}: {
  budgetId: string;
  onUpdatePayment?: ()=> void;
}) {
  return (
    <section>
      <AddPayments origin="budgets" budgetId={budgetId} onUpdatePayment={onUpdatePayment} />
    </section>
  );
});

export default Negotiation;
