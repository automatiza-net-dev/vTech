import { useRef } from "react";
import { User } from "@/domain";

import { RemoteBills } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import { useState } from "react";
import { useQuery } from "react-query";

import { Modal, Tooltip, useToast, Button, useAuthAdmin } from "infinity-forge";
import PrintHeader from "@/OLD/components/mini-components/Print/PrintHeader";

import api from "@/OLD/services";

import * as S from "./styles";

import moment from "moment";
import ReactToPrint from "react-to-print";

function ModalListagem({ bill }) {
  const { GetUser } = useAuthAdmin();
  const { createToast } = useToast();
  const { data } = useQuery({
    queryKey: ["LoadDocuments"],
    queryFn: async () => {
      const response = await api.get(
        `/product-documents/documents/${bill?.id}`
      );

      return response.data;
    },
  });

  const [template, setTemplate] = useState("");

  const user = GetUser<User>();
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <S.ModalListagem>
      <section className="custom-header">
        <strong>{bill?.tag}</strong>
      </section>
      <section className="custom-header">
        <strong>{bill?.client?.name}</strong>
      </section>
      <table>
        <thead>
          <tr>
            <th>Documento</th>
            <th>Usuário gerou</th>
            <th>Data geração</th>
            <th>Usuário imprimiu</th>
            <th>Data impressão</th>
            <th>Imprimir</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.length > 0 &&
            data.map((item) => (
              <tr>
                <td>{item?.description}</td>
                <td>{item?.generationUser}</td>
                <td>
                  {item?.createdAt
                    ? moment(item?.createdAt).format("DD/MM/YYYY")
                    : "-"}
                </td>
                <td>{item?.printUser || "-"}</td>
                <td>
                  {item?.printedAt
                    ? moment(item?.printedAt).format("DD/MM/YYYY")
                    : "-"}
                </td>
                <td>
                  <div
                    onMouseOver={() => {
                      setTemplate(item.template);
                    }}
                  >
                    <ReactToPrint
                      onBeforePrint={() => {
                        container
                          .get<RemoteBills>(TypesAutomatiza.RemoteBills)
                          .printDocument({ billDocumentId: item?.id });
                      }}
                      trigger={() => <Button text="imprimir" />}
                      content={() => componentRef.current}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <footer>
        <Button
          text="gerar documentos"
          className="generate-documents-button"
          onClick={async () => {
            try {
              await api.post("/product-documents/generate", {
                billId: bill.id,
                patientId: bill.client.id,
              });

              createToast({
                message: "Documentos gerados com sucesso",
                status: "success",
              });
            } catch (err) {
              createToast({
                message: "Erro ao gerar documento",
                status: "error",
              });
            }
          }}
        />
      </footer>
      <section style={{ display: "none" }}>
        <div ref={componentRef}>
          <div style={{ margin: "10px !important", fontSize: "15px" }}>
            <PrintHeader unit={user.unit} />
            <div
              dangerouslySetInnerHTML={{
                __html: template,
              }}
            />
          </div>
        </div>
      </section>
    </S.ModalListagem>
  );
}

export function ModalListagemDocumentosVenda({ bill }) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        styles={{ minWidth: "800px" }}
      >
        <ModalListagem bill={bill} />
      </Modal>

      <Tooltip
        position="top-center"
        content="Listagem Documentos Venda"
        enableHover
        trigger={
          <button
            type="button"
            onClick={async () => setModal(true)}
            style={{ background: "transparent", border: "0", padding: "0" }}
          >
            <a>{bill?.document_status}</a>
          </button>
        }
      />
    </>
  );
}
