// @ts-nocheck
import React, { memo } from "react";
import { useRouter } from "next/router";
import { Container, InputBox } from "./styles";
import { Input, notification, Switch } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

const FormChild = memo(function FormChild({ data, setData, submit, action }) {
  const router = useRouter();

  const catchFields = () => {
    if (!data?.description) {
      return notification.error({ message: "Informe a descrição" });
    }

    return submit();
  };

  return (
    <>
      <Container className="uk-flex uk-flex-middle uk-margin-top">
        <InputBox className="">
          <p className="uk-margin-remove">Descrição:</p>
          <Input
            value={data?.description}
            placeholder="Descrição"
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </InputBox>
        <InputBox className="uk-flex uk-flex-around uk-flex-middle">
          <p className="uk-margin-remove">Data Inicio:</p>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            value={data?.fromExpiration}
            format="DD/MM/YYYY"
            onChange={(val) => setData({ ...data, fromExpiration: val })}
          />
        </InputBox>
        <InputBox className="uk-flex uk-flex-around uk-flex-middle">
          <p className="uk-margin-remove">Data Fim:</p>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            value={data?.toExpiration}
            format="DD/MM/YYYY"
            onChange={(val) => setData({ ...data, toExpiration: val })}
          />
        </InputBox>
        {action === "update" && (
          <div className="uk-flex uk-flex-center switch-box">
            <div>
              <label>Ativo</label>
              <br />
              <Switch
                checked={data?.active}
                onChange={(e) => setData({ ...data, active: e })}
              />
            </div>
          </div>
        )}
        {action !== "update" && (
          <div className="uk-flex">
            <CustomButton onClick={() => catchFields()}>Cadastrar</CustomButton>
            <CustomButton onClick={() => router.back()}>Voltar</CustomButton>
          </div>
        )}
      </Container>
    </>
  );
});

export default FormChild;
