import { useState } from "react";
import { ITriggerModalProps } from "./interfaces";
import { Modal } from "infinity-forge";

export function TriggerModal({
  triggerContent,
  content,
  width,
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
        <Modal open={visible} onClose={() => setVisible(false)} styles={{ maxWidth: width }} >
          {content}
        </Modal>
      )}
    </>
  );
}
