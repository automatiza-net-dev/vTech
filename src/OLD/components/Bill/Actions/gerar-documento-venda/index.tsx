import api from "@/OLD/services";
import { useState } from "react";
import { LoaderCircle, useToast } from "infinity-forge";

export function GerarDocumentoVenda({
  bill,
  client,
  button,
  onSuccess,
}: {
  bill;
  client;
  button;
  onSuccess?: any;
}) {
  const [loading, setLoading] = useState(false);

  const { createToast } = useToast();

  return (
    <>
      {process.env.client === "liftone" && (
        <button
          disabled={loading}
          type="button"
          onClick={async () => {
            try {
              setLoading(true);
              await api.post("/product-documents/generate", {
                billId: bill.id,
                patientId: client.id,
              });

              createToast({
                message: "Documentos gerados com sucesso",
                status: "success",
              });

              onSuccess && onSuccess();
            } catch (err) {
              createToast({
                message: "Erro ao gerar documento",
                status: "error",
              });
            } finally {
              setLoading(false);
            }
          }}
          style={{ background: "transparent", border: "0", padding: "0" }}
        >
          {loading ? (
            <LoaderCircle size={22} color="#000" />
          ) : button ? (
            button
          ) : (
            <svg
              enableBackground="new 0 0 512 512"
              height="22"
              viewBox="0 0 512 512"
              width="22"
            >
              <g>
                <path d="m452.754 110.208-83.097-83.097c-17.478-17.479-40.719-27.107-65.441-27.111h-96.416c-26.304 0-47.133 21.351-47.133 47.133v17.133h-17.134c-25.485 0-47.133 20.557-47.133 47.133v17.133h-17.133c-25.488 0-47.133 20.558-47.133 47.133v289.2c0 25.989 21.144 47.133 47.133 47.133h224.933c25.989 0 47.133-21.144 47.133-47.133v-17.133h17.134c25.989 0 47.133-21.144 47.133-47.133v-17.133h17.133c25.872 0 47.134-20.916 47.134-47.133v-160.666c-.016-24.707-9.643-47.99-27.113-65.459zm-101.421-58.994 77.319 77.319h-60.187c-9.447 0-17.133-7.686-17.133-17.133v-60.186zm-30 413.653c0 9.447-7.686 17.133-17.133 17.133h-224.933c-9.447 0-17.133-7.686-17.133-17.133v-289.2c0-9.582 7.766-17.133 17.133-17.133h17.133v242.066c0 26.578 21.646 47.133 47.133 47.133h177.8zm64.267-64.267c0 9.447-7.686 17.133-17.133 17.133h-224.934c-9.447 0-17.133-7.686-17.133-17.133v-289.2c0-9.563 7.747-17.133 17.133-17.133h17.134v242.067c0 26.578 21.646 47.133 47.133 47.133h177.8zm64.266-64.267c0 9.337-7.549 17.133-17.134 17.133h-224.932c-9.339 0-17.133-7.551-17.133-17.133v-289.2c0-9.337 7.548-17.133 17.133-17.133h96.416c9.455 0 17.117 7.651 17.117 17.117v64.283c0 25.989 21.144 47.133 47.133 47.133h64.267c9.447 0 17.134 7.686 17.134 17.133v160.667z" />
                <path d="m376.787 195.319c-6.893-4.594-16.206-2.732-20.801 4.161l-51.786 77.679-19.653-29.479c-4.596-6.893-13.909-8.756-20.801-4.16-6.894 4.595-8.756 13.908-4.16 20.801l32.134 48.2c5.669 8.833 19.294 8.832 24.961 0l64.267-96.4c4.595-6.893 2.733-16.207-4.161-20.802z" />
              </g>
            </svg>
          )}
        </button>
      )}
    </>
  );
}
