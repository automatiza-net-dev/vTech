import { Contact } from "@/domain";
import { useFormikContext } from "formik";
import { Input, InputMask, InputSwitch, Select } from "infinity-forge";

import * as S from "./styles";

export function ContactItem({
  type,
  main,
  index,
  isCrm,
  notGiven,
  errorMessage,
}: Contact & { index: number; isCrm: boolean; errorMessage?: string }) {
  const { values, setFieldValue } = useFormikContext<{ contacts: Contact[] }>();
  const types = [
    { value: "email", label: !isCrm ? "Email*" : "Email" },
    { value: "celular", label: "Celular*" },
    { value: "residencial", label: "Tel. Residencial" },
    { value: "comercial", label: "Tel. Comercial" },
    { value: "recado", label: "Tel. Recado" },
  ];

  const contacts = values["contacts"];

  return (
    <S.ContactItem>
      <Select
        onlyOneValue
        menuPlacement="top"
        name={`contacts[${index}].type`}
        options={types}
        label="Tipo Contato*"
        onChangeInput={(value) => {
          if (type === "email" && value !== "email") {
            setFieldValue(`contacts[${index}].contact`, "");
          }

          setFieldValue(`contacts[${index}].notGiven`, false);
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {type === "email" ? (
          <Input
            name={`contacts[${index}].contact`}
            label="Email*"
            readOnly={notGiven}
          />
        ) : (
          <InputMask
            label={types.find((t) => t.value === type)?.label || ""}
            name={`contacts[${index}].contact`}
            mask="(__) _____-____"
          />
        )}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>

      <Input name={`contacts[${index}].observation`} label="Observação" />

      <div>
        <button
          type="button"
          className="main"
          onClick={() => {
            contacts.forEach((_, i) => {
              setFieldValue(`contacts[${i}].main`, false);
            });

            setFieldValue(`contacts[${index}].main`, !main);
          }}
        >
          <svg
            width="23"
            height="22"
            viewBox="0 0 23 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.4127 18.0517L4.35926 21.9999L5.93459 14.0716L0 8.58355L8.02704 7.63181L11.4127 0.291748L14.7983 7.63181L22.8253 8.58355L16.8908 14.0716L18.4661 21.9999L11.4127 18.0517Z"
              fill={main ? "#F7931D" : "transparent"}
              stroke={main ? "#F7931D" : "#000"}
            />
          </svg>
        </button>

        {type == "email" ? (
          <InputSwitch
            name={`contacts[${index}].notGiven`}
            label="Não informado"
            onChangeInput={(ev) => {
              setFieldValue(`contacts[${index}].notGiven`, ev);
              if (ev === true) {
                setFieldValue(`contacts[${index}].contact`, "");
              }
            }}
          />
        ) : (
          <div></div>
        )}

        {index > 1 && (
          <button
            type="button"
            onClick={() =>
              setFieldValue(
                "contacts",
                contacts.filter((_, i) => i !== index),
              )
            }
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="30" height="30" rx="5" fill="#E1E1E1" />
              <path
                d="M18.3333 10.9999H21.6666V12.3333H20.3333V20.9999C20.3333 21.3681 20.0348 21.6666 19.6666 21.6666H10.3333C9.96513 21.6666 9.66665 21.3681 9.66665 20.9999V12.3333H8.33331V10.9999H11.6666V8.99992C11.6666 8.63173 11.9651 8.33325 12.3333 8.33325H17.6666C18.0348 8.33325 18.3333 8.63173 18.3333 8.99992V10.9999ZM19 12.3333H11V20.3333H19V12.3333ZM13 14.3333H14.3333V18.3333H13V14.3333ZM15.6666 14.3333H17V18.3333H15.6666V14.3333ZM13 9.66659V10.9999H17V9.66659H13Z"
                fill="#828282"
              />
            </svg>
          </button>
        )}
      </div>
    </S.ContactItem>
  );
}
