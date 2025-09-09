// @ts-nocheck
import React, { memo } from "react";

import moment from "moment";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";

import { Radio, Space, Checkbox, Select, DatePicker } from "antd";
import { Container } from "./styles";
const { Group } = Radio;

const Header = memo(function ({
  plans,
  paymentMethods,
  checkingAccounts,
  options,
  setOptions,
  data,
  setData,
}) {
  return (
    <Container>
      <section className="uk-flex uk-flex-around">
        <div>
          <Group defaultValue="now">
            <Space
              direction="horizontal"
              onChange={(e) => {
                if (e.target.value === "now") {
                  setData(
                    data?.map((title) => {
                      const dailyFee =
                        (convertIntlCurrency(title?.originalValue) *
                          title?.feePercentage) /
                        100 /
                        30;

                      const totalFee =
                        moment(new Date()).diff(title?.expirationDate, "days") *
                        dailyFee;

                      const totalDiscount =
                        (convertIntlCurrency(title?.originalValue) *
                          title?.feeDiscountPercentage) /
                        100;

                      return {
                        ...title,
                        paymentDate: moment(new Date()),
                        fee: currencyFormatter(totalFee),
                        discountValue: currencyFormatter(totalDiscount),
                        paymentValue: currencyFormatter(
                          totalFee +
                            convertIntlCurrency(title?.originalValue) -
                            totalDiscount
                        ),
                      };
                    })
                  );

                  return setOptions({
                    ...options,
                    expirationDateType: "now",
                  });
                }

                if (e.target.value === "expirationDate") {
                  setData(
                    data?.map((title) => {
                      const dailyFee =
                        (convertIntlCurrency(title?.originalValue) *
                          title?.feePercentage) /
                        100 /
                        30;

                      const totalFee =
                        moment(title?.expirationDate).diff(
                          title?.expirationDate,
                          "days"
                        ) * dailyFee;

                      const totalDiscount =
                        (convertIntlCurrency(title?.originalValue) *
                          title?.feeDiscountPercentage) /
                        100;

                      return {
                        ...title,
                        paymentDate: moment(title?.expirationDate),
                        fee: currencyFormatter(totalFee),
                        discountValue: currencyFormatter(totalDiscount),
                        paymentValue: currencyFormatter(
                          totalFee +
                            convertIntlCurrency(title?.originalValue) -
                            totalDiscount
                        ),
                      };
                    })
                  );
                  return setOptions({
                    ...options,
                    expirationDateType: "expirationDate",
                  });
                } else {
                  setOptions({
                    ...options,
                    expirationDateType: e.target.value,
                  });
                }
              }}
            >
              <Radio value="now">Hoje</Radio>
              <Radio value="expirationDate">Data Vencimento</Radio>
              <Radio value="chooseDate">Escolher Data</Radio>
            </Space>
          </Group>
          <br />
          {options?.expirationDateType === "chooseDate" && (
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(e) => {
                setData(
                  data?.map((title) => {
                    const dailyFee =
                      (convertIntlCurrency(title?.originalValue) *
                        title?.feePercentage) /
                      100 /
                      30;

                    const totalFee =
                      moment(e).diff(title?.expirationDate, "days") * dailyFee;

                    const totalDiscount =
                      (convertIntlCurrency(title?.originalValue) *
                        title?.feeDiscountPercentage) /
                      100;

                    return {
                      ...title,
                      paymentDate: moment(e),
                      fee: currencyFormatter(totalFee),
                      discountValue: currencyFormatter(totalDiscount),
                      paymentValue: currencyFormatter(
                        totalFee +
                          convertIntlCurrency(title?.originalValue) -
                          totalDiscount
                      ),
                    };
                  })
                );
              }}
            />
          )}
        </div>
        <div>
          <Checkbox
            onChange={(e) => {
              setOptions({ ...options, paymentReplic: e.target.checked });
              if (!e.target.checked) {
                const newObj = { ...options };
                delete newObj?.paymentReplic;
                delete newObj?.newPaymentMethodId;
                setOptions(newObj);
              }
            }}
          >
            Replicar forma de pagamento
          </Checkbox>
          <br />
          <Select
            className="uk-width-1-1"
            disabled={!options?.paymentReplic}
            onChange={(val) => {
              setOptions({ ...options, newPaymentMethodId: val });
              setData(
                data?.map((title) => {
                  return { ...title, paymentMethodId: val, flagId: null };
                })
              );
            }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
            value={options?.newPaymentMethodId}
          >
            {paymentMethods?.length > 0 &&
              paymentMethods?.map((paymentMethod, i) => (
                <Option key={i} value={paymentMethod?.id}>
                  {paymentMethod?.description}
                </Option>
              ))}
          </Select>
        </div>
        <div>
          <Checkbox
            onChange={(e) => {
              setOptions({
                ...options,
                checkingAccountReplic: e.target.checked,
              });
              if (!e.target.checked) {
                const newObj = { ...options };
                delete newObj?.checkingAccountReplic;
                delete newObj?.newCheckingAccountId;
                setOptions(newObj);
              }
            }}
          >
            Replicar conta corrente
          </Checkbox>
          <br />
          <Select
            className="uk-width-1-1"
            disabled={!options?.checkingAccountReplic}
            onChange={(val) => {
              setOptions({ ...options, newCheckingAccountId: val });
              setData(
                data?.map((title) => {
                  return { ...title, checkingAccountId: val };
                })
              );
            }}
                 showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
            value={options?.newCheckingAccountId}
          >
            {checkingAccounts?.length > 0 &&
              checkingAccounts?.map((checkingAccount, i) => (
                <Option key={i} value={checkingAccount?.id}>
                  {checkingAccount?.description}
                </Option>
              ))}
          </Select>
        </div>
        <div>
          <Checkbox
            onChange={(e) => {
              setOptions({ ...options, planReplic: e.target.checked });
              if (!e.target.checked) {
                const newObj = { ...options };
                delete newObj?.planReplic;
                delete newObj?.newPlanId;
                setOptions(newObj);
              }
            }}
          >
            Replicar plano de contas
          </Checkbox>
          <br />
          <Select
            className="uk-width-1-1"
            disabled={!options?.planReplic}
            onChange={(val) => {
              setOptions({ ...options, newPlanId: val });
              setData(
                data?.map((title) => {
                  return {
                    ...title,
                    planId: val,
                  };
                })
              );
            }}
                 showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
            value={options?.newPlanId}
          >
            {plans?.length > 0 &&
              plans?.map((plan, i) => (
                <Option key={i} value={plan?.id}>
                  {plan?.description}
                </Option>
              ))}
          </Select>
        </div>
      </section>
      <hr />
    </Container>
  );
});

export default Header;
