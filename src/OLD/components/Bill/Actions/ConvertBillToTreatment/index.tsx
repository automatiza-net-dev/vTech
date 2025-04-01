import { billService } from "@/OLD/services/bills.service";

import { AiOutlineCheckCircle } from "react-icons/ai";
import { Tooltip, useToast } from "infinity-forge";
import { useSystem } from "@/presentation";
import { Bill } from "@/domain";

export default function ConvertBillToTreatment({ bill, setReload }: { bill: Bill, setReload?: any }) {


  const { unit } = useSystem()
  const { createToast } = useToast();

  const convertBill = (bill) => {

    billService
      .convertBillToTreatment({
        billId: bill?.id,
        sellerId: bill?.seller?.id,
      })
      .then((res) => {
        setReload && setReload((prv) => !prv);

        return createToast({
          status: "success",
          message: "Venda convertida com sucesso",
        });
      })
      .catch((err) => {
        createToast({
          status: "error",
          message:
            "Houve um erro ao converter a venda, contacte o administrador do sistema para mais detalhes",
        });
      });
  };

  //false - só baixada 
  //true - em ambas

  const generate_treatment_opened_bill = unit?.configs?.bills?.generate_treatment_opened_bill

  if((!generate_treatment_opened_bill && bill.status !== "BAIXADA") || (generate_treatment_opened_bill && bill.status !== "ABERTA" && bill.status !== "BAIXADA")) {
    return <></>
  }

  return (
    <Tooltip
      idTooltip="test"
      enableHover
      position="top-right"
      content={"Converter Venda em Tratamento"}
      trigger={
        <AiOutlineCheckCircle
          onClick={() => convertBill(bill)}
          size={20}
          style={{ cursor: "pointer" }}
        />
      }
    />
  );
}
