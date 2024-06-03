export const customStyles = ({ maxWidth }) => ({
    overlay: {
      zIndex: 99,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      cursor: "pointer",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: maxWidth || "0",
      width: "100%",
      padding: "0",
      cursor: "default",
      backgroundColor: "transparent",
      border: "unset",
      overflow: "unset",
    },
    closeModal: {
      position: "absolute",
    },
  });
