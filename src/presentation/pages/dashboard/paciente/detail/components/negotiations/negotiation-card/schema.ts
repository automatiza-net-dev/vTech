import * as yup from "yup";

export const negotiationSchema = {
  budgets: yup
    .array()
    .of(
      yup.object().shape({
        motivo: yup
          .string()
          .nullable()
          .test("motivo", "Campo requerido", (value, dataForm) => {
            const checked = dataForm.parent.checked;

            if (checked) {
              return true;
            }

            return !!(!checked && value);
          }),
        observacao: yup
          .string()
          .nullable()
          .test("observacao", "Campo requerido", (value, dataForm) => {
            const checked = dataForm.parent.checked;

            if (checked) {
              return true;
            }

            return !!(!checked && value);
          }),
      })
    )
    .required(""),
};
