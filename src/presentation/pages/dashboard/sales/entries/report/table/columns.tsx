import { Column } from "infinity-forge";

import { EntrieReport } from "@/domain";

export const columns: Column<EntrieReport>[] = [
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
