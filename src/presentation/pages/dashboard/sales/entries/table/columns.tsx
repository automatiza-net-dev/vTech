import { Column } from "infinity-forge";

import { Entrie } from "@/domain";

export const columns: Column<Entrie>[] = [
  {
    id: "id",
    label: "ID da entrada",
    width: 200,
    hasAsc: false,
    // Component: {
    //   props: {},
    //   
    //   Element: (props) => (
    //     <button type="button" onClick={() => window.alert(props.id)}>
    //       {props.id}
    //     </button>
    //   ),
    // },
  },

];
