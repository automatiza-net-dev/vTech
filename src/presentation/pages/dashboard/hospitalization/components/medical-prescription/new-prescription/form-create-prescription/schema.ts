import * as yup from "yup";

function isRequiredIfRecurrent(fieldName) {
  return yup
    .mixed()
    .test(fieldName, "Campo requerido", (value, context) =>
      context.parent.frequency !== "RECURRENT" ? true : !!value
    );
}

function isRequiredIfNotProcedure(fieldName) {
  return yup
    .mixed()
    .test(fieldName, "Campo requerido", (value, context) =>
      context.parent.type === "PROCEDURE" ? true : !!value
    );
}

function isRequiredIfFluidTherapy(fieldName) {
  return yup
    .mixed()
    .test(fieldName, "Campo requerido", (value, context) =>
      context.parent.type !== "FLUID_THERAPY" ? true : !!value
    );
}

export const schema = {
  executionStart: yup.string().required("Campo requerido"),
  executionHour: yup.string().required("Campo requerido"),

  frequencyUnit: isRequiredIfRecurrent("frequencyUnit"),
  frequencyQuantity: isRequiredIfRecurrent("frequencyQuantity"),
  frequencyQuantityUnit: isRequiredIfRecurrent("frequencyQuantityUnit"),
  frequencyInterval: isRequiredIfRecurrent("frequencyInterval"),

  dose: isRequiredIfNotProcedure("dose"),
  volume: isRequiredIfNotProcedure("volume"),
  description: isRequiredIfNotProcedure("description"),
  prescriptionUnitId: isRequiredIfNotProcedure(
    "prescriptionUnitId"
  ),
  drugAdministrationId: isRequiredIfNotProcedure(
    "drugAdministrationId"
  ),

  fluidSet: isRequiredIfFluidTherapy("fluidSet"),
  fluidSpeed: isRequiredIfFluidTherapy("fluidSpeed"),
  supplement: isRequiredIfFluidTherapy("supplement"),
  fluidUnitId: isRequiredIfFluidTherapy("fluidUnitId"),
};
