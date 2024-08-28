import { useRef } from "react";

import ReactToPrint from "react-to-print";
import { useAuthAdmin } from "infinity-forge";

import { User } from "@/domain";

import * as S from "./styles";

export function Print({
  children,
  PdfContent,
  onBeforePrint,
}: {
  onBeforePrint?: () => void;
  children?: React.ReactNode;
  PdfContent: JSX.Element;
}) {
  const { user } = useAuthAdmin();


  const printContentRef = useRef<HTMLDivElement>(null);

  const item = (
    <button
      type="button"
      style={{
        height: 32,
        border: "1px solid #d9d9d9",
        background: "#fff",
        padding: "0 15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "rgba(0, 0, 0, 0.85)",
      }}
      className="font-14"
    >
      Imprimir
    </button>
  ) as any;

  return (
    <>
      <ReactToPrint
        trigger={() => children || item}
        onBeforePrint={onBeforePrint}
        content={() => printContentRef.current}
      />

      <div
        style={{
          position: "absolute",
          left: "-10000px",
          top: "-100vh",
          zIndex: "-1",
        }}
      >
        <S.Print ref={printContentRef}>
          <div className="content_pdf">
            <header>
              <img
                style={{
                  maxWidth: "200px",
                  maxHeight: "60px",
                  objectFit: "contain",
                }}
                src={`/images/logo/${process.env.client}.png`}
              />

              <p className="font-12-bold">
                {user?.unit?.fantasy_name && (
                  <span>{user?.unit?.fantasy_name}</span>
                )}

                {user?.unit?.address && <span>{user?.unit?.address} </span>}

                {user?.unit?.complement && (
                  <span>{user?.unit?.complement}</span>
                )}

                {user?.unit?.district && (
                  <span>
                    {user?.unit?.district}, {user?.unit?.city},{" "}
                    {user?.unit?.state && (
                      <span>{user?.unit?.state?.toUpperCase()} </span>
                    )}
                  </span>
                )}

                {user?.unit?.phone && (
                  <span>
                    {user?.unit?.phone
                      ?.replace(/\D+/g, "")
                      .replace(/(\d{2})(\d)/, "($1) $2")
                      .replace(/(\d{4})(\d)/, "$1-$2")
                      .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
                      .replace(/(-\d{4})\d+?$/, "$1")}
                  </span>
                )}
              </p>
            </header>

            {PdfContent}
          </div>
        </S.Print>
      </div>
    </>
  );
}
