import React, { useCallback, useEffect, useState } from "react";

import { Checkbox, notification } from "antd";

import { Button, useToast } from "infinity-forge";

import styled from "styled-components";

export function Step4(props) {
  const [inputs, setInputs] = useState<{ title?: string; value?: boolean }[]>(
    []
  );

  const {createToast} = useToast()

  const handleChangeChecked = useCallback(
    (e, text) => {
      setInputs(
        inputs.map((item) => {
          if (item.title === text) {
            item.value = e.target.checked;
          } else {
            item.value = false;
          }
          return item;
        })
      );
    },
    [inputs]
  );

  const handleSubmit = useCallback(() => {
    let inputSelected = "";

    inputs.map((item) => {
      if (item.value) {
        inputSelected = item.title || "";
      }
    });

    if (inputSelected !== "") {
      props.setData({ ...props.data, professionalProfile: inputSelected });
      props.setStep((prv) => prv + 1);
    } else {
      createToast({ status: "error", message: "Por favor, selecione pelo menos um campo" })
    }
  }, [inputs]);

  useEffect(() => {
    if (process.env.client === "liftone") {
      setInputs([
        {
          title: "Clínica ou hospital",
          value: false,
        },
        {
          title: "Profissional da saúde em Clinica",
          value: false,
        },
        {
          title: "Profissional da saúde Autônomo",
          value: false,
        },
        {
          title: "Gestor",
          value: false,
        },
        {
          title: "Recepcionista",
          value: false,
        },
      ]);
    } else {
      setInputs([
        {
          title: "Clínica ou hospital",
          value: false,
        },
        {
          title: "Veterinário de clínica ou hospital",
          value: false,
        },
        {
          title: "Veterinário autônomo",
          value: false,
        },
        {
          title: "Gestor",
          value: false,
        },
        {
          title: "Recepcionista",
          value: false,
        },
      ]);
    }
  }, []);

  return (
    <div>
      <h3>
        Prazer em te conhecer, {props.data.name}! Você pode me dizer qual o seu
        perfil profissional?
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="uk-margin-bottom">
          {inputs.map((input, key) => (
            <InputContainer key={key}>
              <Checkbox
                checked={input.value}
                id={key.toString()}
                onChange={(e) => handleChangeChecked(e, input.title)}
              >
                {input.title}
              </Checkbox>
            </InputContainer>
          ))}
        </div>
        <Button type="submit" text="Avançar" />
      </form>
    </div>
  );
}

export const InputContainer = styled.div`
  padding: 5px 0;
  width: 300px;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
`;
