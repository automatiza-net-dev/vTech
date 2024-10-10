import * as Yup from "yup";

export const step02Schema = {
  phone: Yup.string().required("Campo obrigatório"),
  name: Yup.string().required("Campo obrigatório"),
  state: Yup.string().required("Campo obrigatório"),
  city: Yup.string().required("Campo obrigatório"),
};
