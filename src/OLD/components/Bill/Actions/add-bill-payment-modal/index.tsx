import AddBillPayment from "@/OLD/components/Bill/Actions/AddBillPayment";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { Modal, Tooltip } from "infinity-forge";
import React from "react";

import { useQueryClient } from "react-query";
import { MdMonetizationOn } from "react-icons/md";
import { Bill } from "@/domain";

export function AddBillPaymentModal({
  bill,
  setReload,
  setSelectedId,
}: {
  bill?: Bill;
  setSelectedId?: any;
  setReload?: any;
}) {
  const [paymentsVisible, setPaymentsVisible] = React.useState(false);

  const queryClient = useQueryClient();
  const addPaymentPermission = useUserHasPermission("VEN04");

  if(!addPaymentPermission) {
    return <></>
  }

  return (
    <>
      <Modal
        styles={{ maxWidth: 1500, width: "100%" }}
        open={paymentsVisible}
        onClose={() => {
          setPaymentsVisible(false);
          queryClient.invalidateQueries(["RemotePatient"]);
        }}
      >
        <AddBillPayment
          billId={bill?.id}
          setReloadBill={setReload}
          setVisible={(value) => {
            setPaymentsVisible(value);
            queryClient.invalidateQueries(["RemotePatient"]);
          }}
        />
      </Modal>

      {addPaymentPermission && (
        <Tooltip
          idTooltip="test"
          enableHover
          position="top-right"
          content={"Lançar Pagamentos"}
          trigger={
            <MdMonetizationOn
              className="icon"
              size={20}
              onClick={() => {
                setSelectedId?.(bill?.id);
                setPaymentsVisible(true);
              }}
            />
          }
        />
      )}
    </>
  );
}
