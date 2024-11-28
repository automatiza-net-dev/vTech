import { useState } from "react";

import moment from "moment";

import { Modal } from "infinity-forge";
import { BudgetAttendance } from "@/domain";
import { AddBudgetNew } from "@/presentation";

export function BudgetItem(props: BudgetAttendance) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className="budget" onClick={() => setVisible(true)}>
        {props.budget_date && (
          <div className="row">
            <span className="font-14-bold">Data</span>

            <span className="font-14-regular">
              {moment(props.budget_date).format("DD/MM/YYYY")}
            </span>
          </div>
        )}

        {props.tag && (
          <div className="row">
            <span className="font-14-bold">Cód</span>

            <span className="font-14-regular">{props.tag}</span>
          </div>
        )}

        {props.status && (
          <div className="row">
            <span className="font-14-bold">Status</span>

            <span className="font-14-regular">{props.status}</span>
          </div>
        )}
      </div>

      <Modal
        styles={{
          overflow: "auto",
          height: "95vh",
          maxWidth: "1400px",
          minHeight: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
        stylesContent={{ height: "100%", width: "100%" }}
        open={visible}
        onClose={() => setVisible(false)}
      >
        <AddBudgetNew setModal={setVisible} budgetId={props?.id} />
      </Modal>
    </>
  );
}
