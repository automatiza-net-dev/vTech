import { useFormikContext } from "formik";

import { Contact } from "@/domain";
import { ContactItem } from "./contact-item";

import * as S from "./styles";

export function Contacts() {
  const { values, setFieldValue } = useFormikContext<{ contacts: Contact[] }>();

  const contacts = values["contacts"] || [];

  return (
    <S.Contacts>
      <h3 className="font-18-bold">Contatos</h3>

      {contacts?.map((contact, index) => {
        return <ContactItem key={index} {...contact} index={index} />;
      })}

      <button
        type="button"
        className="add_tutor"
        onClick={() => {
          setFieldValue("contacts", [
            ...contacts,
            {
              contact: "",
              main: false,
              notGiven: false,
              observation: "",
              type: "email",
            },
          ] as Contact[]);
        }}
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
            d="M14.25 14.25V11.25H15.75V14.25H18.75V15.75H15.75V18.75H14.25V15.75H11.25V14.25H14.25ZM15 22.5C10.8579 22.5 7.5 19.1421 7.5 15C7.5 10.8579 10.8579 7.5 15 7.5C19.1421 7.5 22.5 10.8579 22.5 15C22.5 19.1421 19.1421 22.5 15 22.5ZM15 21C18.3137 21 21 18.3137 21 15C21 11.6863 18.3137 9 15 9C11.6863 9 9 11.6863 9 15C9 18.3137 11.6863 21 15 21Z"
            fill="#828282"
          />
        </svg>

        <span className="font-16-regular">Adicionar contato</span>
      </button>
    </S.Contacts>
  );
}
