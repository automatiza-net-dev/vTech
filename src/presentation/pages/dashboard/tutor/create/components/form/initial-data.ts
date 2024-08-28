import { FileSystemType } from "infinity-forge";

import { Contact } from "@/domain";

export const initialData = ({ data, tutorId }) => {
  return data
    ? {
        ...data,
        id: tutorId,
        photo: [
          {
            id: 1,
            fileType: ".png",
            length: "0",
            title: data?.photo,
            url: data?.photo,
          },
        ] as FileSystemType[],
      }
    : {
        origin: origin,
        address: {
          cep: "",
          logradouro: "",
          complemento: "",
          bairro: "",
          localidade: "",
          uf: "",
          ibge: "",
          gia: "",
          ddd: "",
          siafi: "",
        },
        contacts: [
          {
            contact: "",
            main: false,
            notGiven: false,
            observation: "",
            type: "email",
          },
          {
            contact: "",
            main: true,
            notGiven: false,
            observation: "",
            type: "celular",
          },
        ] as Contact[],
      };
};
