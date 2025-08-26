// @ts-nocheck
// Core
import React, { memo, useState, useEffect } from "react";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Icons
import { ImArrowLeft, ImArrowRight } from "react-icons/im";

// Components
import { Container, SectionBox } from "./styles";
import { Button } from "antd";

// Utils
import Masks from "@/OLD/utils/masks";

const CashierPanel = memo(function CashierPanel({
  setType,
  setVisible,
  entries,
}) {
  const [expenses, setExpenses] = useState([]);
  const [receipts, setReceipts] = useState([]);

  const launchExpensePermission = useUserHasPermission("CAI05");
  const launchReceiptPermission = useUserHasPermission("CAI06");

  const getExpenseAndReceipt = () => {
    setExpenses(entries.filter((expense) => expense.type === "DEBITO"));
    setReceipts(entries.filter((receipt) => receipt.type === "CREDITO"));
  };

  const convertValueToCash = (value) => {
    const options = { style: "currency", currency: "BRL" };
    return new Intl.NumberFormat("pt-br", options).format(value);
  };

  useEffect(() => {
    entries?.length > 0 && getExpenseAndReceipt();
  }, [entries]);

  return (
    <Container>
      <div className="uk-flex uk-flex-around">
        <SectionBox type="receipt">
          {launchReceiptPermission && (
            <Button
              style={{
                height: 70,
              }}
              onClick={() => {
                setVisible(true);
                setType("Recebimento");
              }}
            >
              <ImArrowRight size={50} color="var(--green)" />
              &nbsp; Lançar suprimento 
            </Button>
          )}
          <div className="uk-padding-small sub-section uk-margin-top">
            <label>Suprimentos</label>
            <div className="uk-flex uk-flex-around">
              <div>
                <label>Descrição</label>
                <br />
                {receipts?.map((receipt, i) => (
                  <p className="uk-margin-remove" key={i}>
                    {receipt?.description}
                  </p>
                ))}
              </div>
              <div>
                <label>Valor</label>
                <br />
                {receipts?.map((receipt, i) => (
                  <p className="uk-margin-remove" key={i}>
                    {convertValueToCash(receipt?.value)}
                  </p>
                ))}
              </div>
              <div>
                <label>Opções</label>
                <br />
                [opções]
              </div>
            </div>
          </div>
        </SectionBox>
        <SectionBox type="expenses">
          {launchExpensePermission && (
            <Button
              style={{
                height: 70,
              }}
              onClick={() => {
                setVisible(true);
                setType("Despesa");
              }}
            >
              <ImArrowLeft size={50} color="var(--red)" />
              &nbsp; Lançar sangria 
            </Button>
          )}
          <div className="uk-padding-small sub-section uk-margin-top">
            <label>Sangrias</label>
            <div className="uk-flex uk-flex-around">
              <div>
                <label>Descrição</label>
                <br />
                {expenses?.map((expense, i) => (
                  <p className="uk-margin-remove" key={i}>
                    {expense?.description}
                  </p>
                ))}
              </div>
              <div>
                <label>Valor</label>
                <br />
                {expenses?.map((expense, i) => (
                  <p className="uk-margin-remove" key={i}>
                    {convertValueToCash(expense?.value)}
                  </p>
                ))}
              </div>
              <div>
                <label>Opções</label>
                <br />
                [opções]
              </div>
            </div>
          </div>
        </SectionBox>
      </div>
    </Container>
  );
});

export default CashierPanel;
