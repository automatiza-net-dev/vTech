import { useState } from "react";
import { ITriggerModalProps } from "./interfaces";
import { Modal } from "infinity-forge";

export function TriggerModal(props: ITriggerModalProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {props?.triggerContent && (
        <button
          type="button"
          onClick={() => props?.setVisible ? props?.setVisible(true) : setVisible(true)}
          style={{
            padding: 0,
            border: "none",
            background: "none",
            color: "#007bff",
          }}
        >
          {props?.triggerContent}
        </button>
      )}

      {props?.content && (
        <Modal open={props?.visible || visible} onClose={() => props?.setVisible ? props?.setVisible(false) : setVisible(false)} styles={{ maxWidth: props?.width }} >
          {props?.content}
        </Modal>
      )}
    </>
  );
}
