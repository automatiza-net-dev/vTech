// @ts-nocheck
import { memo } from "react";

import AddPayments from "@/OLD/components/Notes/AddPayments";
import { DetailsPanel } from "../../Bill/Actions/AddBillPayment/DetailsPanel";

const Negotiation = memo(function Negotiation({
  budgetId,
}: {
  budgetId: string;
}) {
  return (
    <section>
      <AddPayments origin="budgets" budgetId={budgetId} />
    </section>
  );
});

export default Negotiation;
