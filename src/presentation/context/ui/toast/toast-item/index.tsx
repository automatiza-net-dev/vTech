import { useEffect, useState } from "react";

import { Toast } from "../interfaces";

import * as S from "./styles";

export function ToastItem({ uid, status, message, setToast }: { setToast: React.Dispatch<React.SetStateAction<Toast[]>> } & Toast) {
  const animationDuration = 4000; 

  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / animationDuration);

      setProgressWidth(100 - progress * 100);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }else {
        setToast(s => s?.filter(st => st.uid !== uid))
      }
    };

    const animation = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animation);
  }, [animationDuration]);

  const icon =
    status === "error" ? (
      <svg
        viewBox="0 0 24 24"
        width="100%"
        height="100%"
        fill="#e74c3c"
      >
        <path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"></path>
      </svg>
    ) : (
      <svg
        viewBox="0 0 24 24"
        width="100%"
        height="100%"
        fill="#07bc0c"
      >
        <path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path>
      </svg>
    );

  return (
    <S.ToastItem>
      <div className="toast-content">
        {icon} <span>{message}</span>
      </div>
      
      <div className="progressbar_container" >
        <div className="progressbar" style={{ width: `${progressWidth}%`, backgroundColor: status === "success" ? "#07bc0c" : "#e74c3c" }}></div>
      </div>
    </S.ToastItem>
  );
}
