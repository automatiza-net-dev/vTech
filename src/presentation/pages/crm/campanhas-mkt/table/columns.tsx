import moment from "moment";
import { Column, formatNumberToCurrency } from "infinity-forge";
import { Marketing } from "@/domain";

export const columns = [
  {
    id: "description",
    label: "Nome Camapnha",
    width: 100,
  },
  {
    id: "startDate",
    label: "Data Início",
    width: 60,
    Component: {
      Element: (props) =>
        moment(props?.startDate).add(3, "hours").format("DD/MM/YYYY"),
      props: {},
      
    },
  },
  {
    id: "endDate",
    label: "Data Fim",
    width: 60,
    Component: {
      Element: (props) =>
        moment(props?.endDate).add(3, "hours").format("DD/MM/YYYY"),
      props: {},
      
    },
  },
  {
    id: "investmentValue",
    label: "Valor investido",
    width: 80,
    Component: {
      Element: (props) => formatNumberToCurrency(props?.investmentValue),
      props: {},
      
    },
  },
  {
    id: "active",
    label: "Ativo",
    width: 30,
    Component: {
      Element: (props) => (props?.active ? "Sim" : "Não"),
      props: {},
      
    },
  },
] as Column<Marketing>[];
