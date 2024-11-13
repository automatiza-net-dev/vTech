import { BadRequestError, useToast } from "infinity-forge";

import { RemoteCRM } from "@/data";
import { CrmTypes, container } from "@/container";
import { Modal, useScheduling } from "@/presentation";

import moment from "moment";

import * as S from "./styles";

export function ModalOpportunitie() {
  const { createToast } = useToast();

  const oppotunities = useScheduling((state) => state.oppotunities);
  const setOpportunities = useScheduling((state) => state.setOpportunities);

  if (!oppotunities) {
    return <></>;
  }

  return (
    <Modal
      maxwidth="80vw"
      stateModal={true}
      title="Vincular agendamento à oportunidades do paciente"
      onCloseModal={() => setOpportunities(null)}
    >
      <S.ModalOpportunitie>
        <table>
          <thead>
            <tr>
              <td>Oportunidade</td>

              <td>Data contato</td>

              <td>Cliente</td>

              {oppotunities.find((item) => item?.client?.name) && (
                <td>Paciente</td>
              )}

              <td></td>
            </tr>
          </thead>

          <tbody>
            {oppotunities &&
              oppotunities?.map((oppotunitie) => (
                <tr>
                  {oppotunitie?.description && (
                    <td>{oppotunitie.description}</td>
                  )}

                  {oppotunitie?.contactDate && (
                    <td>
                      {moment(oppotunitie?.contactDate).format("DD/MM/YYYY")}
                    </td>
                  )}

                  {oppotunitie?.contact?.name && (
                    <td>{oppotunitie.contact.name}</td>
                  )}

                  {oppotunitie.client?.name && (
                    <td>{oppotunitie.client?.name}</td>
                  )}

                  <td>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await container
                            .get<RemoteCRM>(CrmTypes.RemoteCRM)
                            .sync({
                              opportunityId: oppotunitie.id,
                              scheduleId: oppotunitie.scheduleId || "",
                            });

                          createToast({
                            message: "Oportunidade vinculada com sucesso!",
                            status: "success",
                          });

                          setOpportunities(null);
                        } catch (err) {
                          if (err instanceof BadRequestError) {
                            createToast({
                              message: err.error.message,
                              status: "success",
                            });
                          }
                        }
                      }}
                    >
                      Vincular
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </S.ModalOpportunitie>
    </Modal>
  );
}
