import { Modal } from "antd";
import { useState } from "react";
import { ITriggerModalProps } from "./interfaces";

export function TriggerModal({
  triggerContent,
  content,
  ...rest
}: ITriggerModalProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {triggerContent && (
        <button
          type="button"
          onClick={() => setVisible(true)}
          style={{
            padding: 0,
            border: "none",
            background: "none",
            color: "#007bff",
          }}
        >
          {triggerContent}
        </button>
      )}

      {content && (
        <Modal visible={visible} onCancel={() => setVisible(false)} {...rest}>
          {content}
        </Modal>
      )}
    </>
  );
}
