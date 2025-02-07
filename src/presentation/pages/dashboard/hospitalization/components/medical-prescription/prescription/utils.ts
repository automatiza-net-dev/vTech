import { Prescription } from "../types";

function getType({ type }: Prescription) {
  if (!type) {
    return "-";
  }

  if (type === "FLUID_THERAPY") {
    return "Fluidoterapia";
  }

  if (type === "MEDICATION") {
    return "Medicação";
  }

  return "Procedimento";
}

function getIntervalTranslate(info, val) {
  if (!info) return "-";

  switch (info) {
    case "HOUR":
      return val > 1 ? "horas" : "hora";
    case "DAY":
      return val > 1 ? "dias" : "dia";
    default:
      return val > 1 ? "vezes" : "vez";
  }
}

function formatFrequency(props: Prescription) {
  if (props?.frequency === "RECURRENT") {
    return `<strong>Frequência:</strong> A cada ${
      props.frequency_interval
    } ${getIntervalTranslate(
      props.frequency_unit,
      props.frequency_interval
    )} por ${props.frequency_quantity} ${getIntervalTranslate(
      props.frequency_quantity_unit,
      props.frequency_quantity
    )}`;
  }

  const messages = {
    WHEN_NEEDED: "Quando necessário",
    ONCE: "Apenas uma vez",
  };

  return `<strong>Frequência:</strong> ${messages[props?.frequency] || "Desconhecida"}`;
}

export { formatFrequency, getIntervalTranslate, getType };
