import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import { RemoteBills } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import { useQuery, useQueryClient } from "react-query";

import { Modal, useToast, Button, api } from "infinity-forge";

import { PrintHeader } from "@/presentation";

import * as S from "./styles";

import moment from "moment";
import { Tooltip } from "antd";

function ModalListagem({ bill }) {
  const [template, setTemplate] = useState("");

  const { createToast } = useToast();

  const { data } = useQuery({
    queryKey: ["LoadDocuments"],
    queryFn: async () => {
      const response = await api({
        url: `/product-documents/documents/${bill?.id}`,
        method: "get",
      });

      return response.data;
    },
  });

  const componentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const imprimir = useReactToPrint({
    contentRef: componentRef,
  });

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
                    <Button
                      text="imprimir"
                      onClick={async () => {
                        await container
                          .get<RemoteBills>(TypesAutomatiza.RemoteBills)
                          .printDocument({ billDocumentId: item?.id });

                        imprimir();
                      }}
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
              await api({
                method: "post",
                url: "/product-documents/generate",
                body: {
                  billId: bill.id,
                  patientId: bill.client.id,
                },
              });

              queryClient.invalidateQueries(["LoadDocuments"]);

              return createToast({
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
            <PrintHeader />
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

export function ModalListagemDocumentosVenda({ bill, refresh }) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Modal
        open={modal}
        onClose={() => {
          setModal(false);
          refresh();
        }}
        styles={{ minWidth: "800px" }}
      >
        <ModalListagem bill={bill} />
      </Modal>

      <Tooltip title="Listagem Documentos Venda">
        <button
          type="button"
          onClick={async () => setModal(true)}
          style={{ background: "transparent", border: "0", padding: "0" }}
        >
          <a>{bill?.document_status}</a>
        </button>
      </Tooltip>
    </>
  );
}
