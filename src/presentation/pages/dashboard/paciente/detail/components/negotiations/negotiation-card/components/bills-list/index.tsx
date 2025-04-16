import { Accordion, formatNumberToCurrency } from "infinity-forge";

import { billStatusFormatter } from "@/OLD/components/Bill/utils/status-formater";

import { NegotiationCardProps } from "../../interfaces";


export function BillsList(props: NegotiationCardProps) {

    return <div className="budget-list">
        {props.bills?.map((bill) => {
            return (
                <div className="budgets-list" key={bill.id}>
                    <div>
                        <h3>
                            <div>
                                Venda {bill.tag} (
                                {billStatusFormatter(bill
                                )}
                                )
                            </div>

                            <div>Desconto</div>
                            <div>Valor</div>
                        </h3>

                        {bill?.items?.map((item) => (
                            <>
                                <div key={item.id} className="content_budget">
                                    <div>
                                        {item.quantity}x{" "}
                                        {(item?.productVariation?.product.description +
                                            (item?.departmentItems && item?.departmentItems.length > 0
                                                ? " - " +
                                                item?.departmentItems?.map(
                                                    (item) => item.department_item_description
                                                )
                                                : ""))}
                                    </div>

                                    <div>
                                        {item.discount_value
                                            ? formatNumberToCurrency(item.discount_value)
                                            : "-"}
                                    </div>

                                    <div>
                                        {item.total_value
                                            ? formatNumberToCurrency(item.total_value)
                                            : "-"}
                                    </div>
                                </div>
                            </>
                        ))}

                        <div className="content">
                            <div></div>
                            <div className="total">Total</div>
                            <div className="-bold">
                                {formatNumberToCurrency(bill.total_value)}
                            </div>
                        </div>

                    </div>

                    {bill?.payments && bill.payments.length > 0 && (
                        <h3
                            className="font-20-bold"
                            style={{ marginTop: 20, marginBottom: 10 }}
                        >
                            <div>
                                Pagamentos
                            </div>
                        </h3>
                    )}

                    {bill.payments &&
                        bill.payments.length > 0 &&
                        bill?.payments?.map((item) => {
                            const title = `${item?.paymentMethod?.description} - ${item?.tefAcquirer?.description} - ${item?.tefFlag?.description} - ${formatNumberToCurrency(item.total_value || 0)} (${item.installments}x)`
                            console.log(item, "item")
                            return (
                                <Accordion key={item.id} title={title}>

                                   a
                                </Accordion>
                            );
                        })}
                </div>
            );
        })}
    </div>
}

