// @ts-nocheck
// Core
import React, { memo, useState, useEffect } from "react";
import { useRouter } from "next/router";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

//Icons
import { EditTwoTone } from "@ant-design/icons";

// Components
import { Container } from "./styles";
import { Modal } from "antd";
import Update from "../Update";

const Actions = memo(function Actions({ banking, reload, setReload }) {
  const [updateVisible, setUpdateVisible] = useState(false);

  const updateMovementPermission = useUserHasPermission("BAN02");

  return (
    <Container>
      {updateMovementPermission && (
        <EditTwoTone onClick={() => setUpdateVisible(true)} />
      )}
      <Modal
        title="Atualizar informações de transação"
        visible={updateVisible}
        width={900}
        footer={null}
        onCancel={() => setUpdateVisible(false)}
      >
        <Update
          banking={banking}
          reload={reload}
          setReload={setReload}
          setVisible={setUpdateVisible}
        />
      </Modal>
    </Container>
  );
});

export default Actions;
