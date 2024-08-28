import * as Yup from "yup";

export const schema = {
  email: Yup.string().required("E-mail é obrigatório"),
  password: Yup.string().required("Senha é obrigatório"),
  description: Yup.string().required("Descrição é obrigatório"),
};
