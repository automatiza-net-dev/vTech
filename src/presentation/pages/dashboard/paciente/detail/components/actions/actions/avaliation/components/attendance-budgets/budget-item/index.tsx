import { useState } from "react";
import AddBudgetItem from "@/OLD/components/Budget/Actions/AddBudgetItem";
import { BudgetAttendance } from "@/domain";
import moment from "moment";

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

      <AddBudgetItem
        budget={props}
        setExternVisible={setVisible}
        externVisible={visible}
        setReload={undefined}
        tableRender={false}
      />
    </>
  );
}
