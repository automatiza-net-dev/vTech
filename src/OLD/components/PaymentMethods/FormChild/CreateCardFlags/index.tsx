// @ts-nocheck

// Core

import React, { memo, useState, useCallback } from "react";

// Hooks
import { useTefFlags } from "@/OLD/hooks/useTefFlags";
import { useTefAcquirers } from "@/OLD/hooks/useTefAquirers";

// Services
import { paymentMethodsService } from "@/OLD/services/paymentMethods.service";

// Components
import { Container as CustomForm } from "./styles";
import { Checkbox, Select, Input, Button } from "antd";
const { Option } = Select;

// Utils
import { sortItems } from "@/OLD/utils/sortItems";
import { useToast } from "infinity-forge";

function CardFlags({ method, reload, setReload, setVisible, methodId }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { acquirers } = useTefAcquirers();
  const { tefFlags } = useTefFlags(
    false,
    method?.type === "CREDITO" ? "C" : "D"
  );

  const { createToast } = useToast();

  const submitFlag = useCallback(() => {
    setLoading(true);
    let error = false;
    paymentMethodsService
      .createFlag({
        ...data,
        paymentMethodId: methodId,
        checkingAccountId: method?.checkingAccountId,
      })
      .then((_res) =>
        createToast({
          message: "Bandeira cadastrada com sucesso!",
          status: "success",
        })
      )
      .catch((err) => {
        error = true;
        setLoading(false);
        const errMessage = err?.response?.data?.errors;
        if (errMessage) {
          return createToast({
            message: errMessage[0].message,
            status: "error",
          });
        }

        return createToast({
          message:
            "Houve um erro ao cadastrar a bandeira ao metodo selecionado...",
          status: "error",
        });
      })
      .finally(() => {
        if (!error) {
          setLoading(false);
          setReload(!reload);
          setData({});
          setVisible(false);
        }
      });
  }, [data, method, methodId]);

  sortItems(tefFlags, "description");

  return (
    <CustomForm
      onSubmit={(e) => {
        e.preventDefault();
        submitFlag();
      }}
    >
      <div className="uk-flex uk-flex-around">
        <div className="uk-flex uk-flex-wrap">
          {tefFlags?.length > 0 &&
            tefFlags.map((flag, index) => {
              return (
                <div className="uk-width-1-4">
                  <Checkbox
                    checked={flag?.id === data?.tefFlagId}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setData({ ...data, tefFlagId: flag?.id });
                      }
                    }}
                  >
                    {flag?.description}
                  </Checkbox>
                </div>
              );
            })}
        </div>
      </div>
      <div>
        <div style={{ display: "flex", gap: "5px" }}>
          <div style={{ width: "70%" }}>
            <label>Adquirente</label>
            <Select
              style={{ width: "100%" }}
              onChange={(e) => setData({ ...data, tefAcquirerId: e })}
              value={data?.tefAcquirerId}
            >
              {acquirers?.length > 0 &&
                acquirers.map((acquirer) => (
                  <Option value={acquirer?.id}>{acquirer?.description}</Option>
                ))}
            </Select>
          </div>
          <div style={{ width: "30%" }}>
            <label>Dias Repasse adm. cartão</label>
            <Input
              type="number"
              onChange={(e) =>
                setData((prv) => ({
                  ...prv,
                  daysUntilTransfer: e.target.value,
                }))
              }
            />
          </div>
        </div>
        {/*
        <div className="uk-width-1-3">
          <label>Taxa Desc. Adm. Cartão</label>
          <Input
            type="number"
            onChange={(e) => setData({ ...data, fee: e.target.value })}
          />
        </div>
        */}
      </div>
      <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
        <div style={{ width: "30%" }}>
          <label>N° Maximo parcelas</label>
          <Input
            type="number"
            onChange={(e) =>
              setData({ ...data, maxInstallments: e.target.value })
            }
            value={data?.maxInstallments}
          />
        </div>
        <div style={{ width: "30%" }}>
          <label>N° Max parcelas sem senha</label>
          <Input
            type="number"
            onChange={(e) =>
              setData({ ...data, installmentsWithoutPassword: e.target.value })
            }
            value={data?.installmentsWithoutPassword}
          />
        </div>
      </div>
      <hr />
      <footer>
        <Button type="primary" htmlType="submit">
          {" "}
          Salvar
        </Button>
      </footer>
    </CustomForm>
  );
}

export default CardFlags;
