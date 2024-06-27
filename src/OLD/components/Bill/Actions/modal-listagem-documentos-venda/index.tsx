import { useState } from "react";
import { useQuery } from "react-query";

import { Modal, Tooltip } from "infinity-forge";

import api from "@/OLD/services";

import * as S from "./styles";

import moment from "moment";

function ModalListagem({ bill }) {
  const { data } = useQuery({
    queryKey: ["LoadDocuments"],
    queryFn: async () => {
      const response = await api.get(
        `/product-documents/documents/${bill?.id}`
      );

      return response.data;
    },
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
              </tr>
            ))}
        </tbody>
      </table>
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

      {process.env.client === "liftone" && (
        <Tooltip
          position="top-center"
          content="Listagem Documentos Venda"
          enableHover
          trigger={
            <button
              type="button"
              onClick={async () => {
                setModal(true);
              }}
              style={{ background: "transparent", border: "0", padding: "0" }}
            >
              <svg
                enable-background="new 0 0 512 512"
                height="22"
                viewBox="0 0 512 512"
                width="22"
              >
                <g>
                  <path d="m416 0h-260c-24.813 0-45 20.187-45 45v15h-15c-24.813 0-45 20.187-45 45v362c0 24.813 20.187 45 45 45h260c24.813 0 45-20.187 45-45v-15h15c24.813 0 45-20.187 45-45v-362c0-24.813-20.187-45-45-45zm-45 467c0 8.271-6.729 15-15 15h-260c-8.271 0-15-6.729-15-15v-362c0-8.271 6.729-15 15-15h15v317c0 24.813 20.187 45 45 45h215zm60-60c0 8.271-6.729 15-15 15h-260c-8.271 0-15-6.729-15-15v-362c0-8.271 6.729-15 15-15h260c8.271 0 15 6.729 15 15z" />
                  <path d="m387.82 62h-80c-8.284 0-15 6.716-15 15s6.716 15 15 15h80c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
                  <path d="m387.82 242h-80c-8.284 0-15 6.716-15 15s6.716 15 15 15h80c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
                  <path d="m387.82 182h-80c-8.284 0-15 6.716-15 15s6.716 15 15 15h80c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
                  <path d="m387.82 122h-80c-8.284 0-15 6.716-15 15s6.716 15 15 15h80c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
                  <path d="m387.82 302h-80c-8.284 0-15 6.716-15 15s6.716 15 15 15h80c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
                  <path d="m387.82 362h-80c-8.284 0-15 6.716-15 15s6.716 15 15 15h80c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />
                  <path d="m239.033 75.181-31.82 31.819-10.307-10.307c-5.711-5.711-15.014-6.236-20.987-.801-6.378 5.804-6.554 15.687-.525 21.714l21.213 21.213c5.858 5.858 15.355 5.858 21.213 0l42.426-42.426c5.858-5.857 5.858-15.355 0-21.213s-15.355-5.858-21.213.001z" />
                  <path d="m239.033 195.181-31.82 31.819-10.307-10.307c-5.711-5.711-15.014-6.236-20.987-.801-6.378 5.804-6.554 15.687-.525 21.714l21.213 21.213c5.858 5.858 15.355 5.858 21.213 0l42.426-42.426c5.858-5.857 5.858-15.355 0-21.213s-15.355-5.858-21.213.001z" />
                  <path d="m239.033 315.181-31.82 31.819-10.307-10.307c-5.711-5.711-15.014-6.236-20.987-.801-6.378 5.804-6.554 15.687-.525 21.714l21.213 21.213c5.858 5.858 15.355 5.858 21.213 0l42.426-42.426c5.858-5.857 5.858-15.355 0-21.213s-15.355-5.858-21.213.001z" />
                </g>
              </svg>
            </button>
          }
        />
      )}
    </>
  );
}
