// @ts-nocheck

// Core
import React, { memo, useState, useEffect } from "react";

// Utils
import { Columns } from "./Columns";

// Components
import { Table } from "antd";
import Actions from "./Actions";

const FlagsTable = memo(function FlagsTable({ flags, reload, setReload }) {
  const [formatedFlags, setFormatedFlags] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatFlags = () => {
    flags?.length > 0
      ? setFormatedFlags(
          flags.map((flag) => {
            return {
              acquirer: flag?.acquirer?.description,
              flag: flag?.flag?.description,
              installments: flag?.max_installments,
              fee: flag?.fee,
              actions: (
                <Actions flag={flag} reload={reload} setReload={setReload} />
              )
            };
          })
        )
      : setFormatedFlags([]);
  };

  useEffect(() => {
    formatFlags();
  }, [flags, reload]);

  return (
    <section>
      Bandeira/Taxa adicionadas:
      <Table columns={Columns} dataSource={formatedFlags} />
    </section>
  );
});

export default FlagsTable;
