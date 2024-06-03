// @ts-nocheck
import { memo } from "react";

import { Container } from "./styles";
import { Input, Select, Button, Tooltip, Checkbox, notification } from "antd";
const { Option } = Select;

import { DeleteTwoTone } from "@ant-design/icons";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

import masks from "@/OLD/utils/masks";

const types = [
  { value: "email", description: "Email" },
  { value: "celular", description: "Celular" },
  { value: "residencial", description: "Tel. Residencial" },
  { value: "comercial", description: "Tel. Comercial" },
  { value: "recado", description: "Tel. Recado" },
];

const formatContact = (type, ctt) => {
  if (type !== "email") {
    return masks.phone(ctt);
  }
  return ctt;
};

const MultipleContacts = memo(function MultipleContacts({
  contacts,
  setContacts,
}) {
  return (
    <Container>
      <h5 className="uk-heading-line uk-margin-remove">
        <span>Contatos</span>
      </h5>
      <div className="uk-flex uk-flex-right">
        <Button
          onClick={() => {
            let arr = [...contacts];
            arr.push({ main: false });
            return setContacts(arr);
          }}
        >
          Adicionar
        </Button>
      </div>
      {contacts?.map((contact, i) => (
        <div className="uk-flex form-container uk-margin-small-top" key={i}>
          <div className="uk-width-1-5">
            <label>Tipo Contato*</label>
            <Select
              className="uk-width-1-1"
              value={contact?.type}
              onChange={(val) => {
                const arr = [...contacts];
                arr.splice(i, 1, {
                  ...contacts[i],
                  type: val,
                });
                setContacts(arr);
              }}
            >
              {types.map((type) => (
                <Option value={type?.value}>{type.description}</Option>
              ))}
            </Select>
          </div>
          <div className="uk-width-1-3">
            <label>
              {types.find((type) => type?.value === contacts[i]?.type)
                ?.description || "Sel. o tipo contato"}
              {contact?.type === "email" && contact?.notGiven ? "" : "*"}
            </label>
            <Input
              type={contact?.type === "email" && "email"}
              value={contact?.contact}
              onBlur={() => {
                let arr = [...contacts];
                arr?.map((item, i) => {
                  if (
                    item?.type === "celular" &&
                    item?.contact?.length !== 15
                  ) {
                    notification.warning({
                      message: "o celular precisa ter 11 digitos",
                    });
                  }
                });
                setContacts(arr);
              }}
              onChange={(e) => {
                const arr = [...contacts];
                if (e.target.value !== "") {
                  arr.splice(i, 1, {
                    ...contacts[i],
                    contact: formatContact(contact?.type, e.target.value),
                    notGiven: false,
                  });
                } else {
                  arr.splice(i, 1, {
                    ...contacts[i],
                    contact: formatContact(contact?.type, e.target.value),
                  });
                }
                setContacts(arr);
              }}
            />
          </div>
          <div className="uk-margin-small-right">
            <label>Observação</label>
            <Input
              value={contact?.observation}
              onChange={(e) => {
                const arr = [...contacts];
                arr.splice(i, 1, {
                  ...contacts[i],
                  observation: e.target.value,
                });
                setContacts(arr);
              }}
            />
          </div>
          <div className="uk-flex uk-flex-middle uk-margin-top">
            <Tooltip title="Contato principal">
              {!contact?.main ? (
                <AiOutlineStar
                  size={20}
                  className="uk-margin-small-right custom-icon"
                  onClick={() => {
                    return setContacts(
                      contacts.map((ctt, idx) => ({
                        ...ctt,
                        main: idx === i,
                      }))
                    );
                  }}
                />
              ) : (
                <AiFillStar
                  size={20}
                  className="uk-margin-small-right custom-icon"
                  onClick={() => {
                    return setContacts(
                      contacts.map((ctt) => ({
                        ...ctt,
                        main: false,
                      }))
                    );
                  }}
                />
              )}
            </Tooltip>
            <DeleteTwoTone
              twoToneColor={"red"}
              size={20}
              onClick={() => {
                if (contacts?.length > 1) {
                  let arr = [...contacts];
                  arr.splice(i, 1);
                  return setContacts(arr);
                }
              }}
            />
            {contact?.type === "email" && (
              <Checkbox
                className="uk-margin-left"
                checked={contact?.notGiven}
                onChange={(e) => {
                  const arr = [...contacts];
                  if (!e.target.checked) {
                    arr.splice(i, 1, {
                      ...contacts[i],
                      notGiven: e.target.checked,
                    });
                  } else {
                    arr.splice(i, 1, {
                      ...contacts[i],
                      notGiven: e.target.checked,
                      contact: "",
                    });
                  }
                  setContacts(arr);
                }}
              >
                Não informado
              </Checkbox>
            )}
          </div>
        </div>
      ))}
    </Container>
  );
});

export default MultipleContacts;
