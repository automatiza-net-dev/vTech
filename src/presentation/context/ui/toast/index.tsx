import { useContext, createContext, useState } from "react";
import ReactDOM from "react-dom"; 

import { ToastItem } from "./toast-item";
import { uid } from "@/presentation";

import { Toast } from "./interfaces";

import * as S from "./styles";

const ToastContext = createContext<{ createToast: (item: Toast) => void }>({
  createToast: () => {},
});

function ToastProvider({ children }) {
  const [toasts, setToast] = useState<Toast[]>([]);

  function createToast(item: Toast) {

    const id = uid(32);
    setToast((s) => [...s, { ...item, uid: id }]);
  }

  return (
    <ToastContext.Provider value={{ createToast }}>
      {ReactDOM.createPortal(
        <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 9999 }}>
          <S.Toast>
            {toasts?.map((toast, index) => (
              <ToastItem key={index} {...toast} setToast={setToast} />
            ))}
          </S.Toast>
        </div>,
        document.body
      )}

      <div>{children}</div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  return context;
}

export { ToastProvider, useToast };
