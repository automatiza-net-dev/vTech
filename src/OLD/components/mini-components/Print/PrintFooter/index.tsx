// @ts-nocheck
import React, { memo } from "react";

import moment from "moment";

export default function PrintFooter({ user }) {
  return (
    <footer className="print-footer">
      <div>
        impresso em {moment(new Date()).format("DD/MM/YYYY - HH:mm")}
        &nbsp;Por&nbsp;{user?.name}
      </div>
    </footer>
  );
}
