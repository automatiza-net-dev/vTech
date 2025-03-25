import { useState } from "react";

import moment from "moment";
import {
  Input,
  Select,
  Button,
  FormHandler,
  InputCurrency,
} from "infinity-forge";

import {
  Modal,
  useDictionary,
  useLoadPatient,
  useLoadAllPatientTutor,
  useConfigurationsSystem,
} from "@/presentation";

export function ButtonNewBudget() {
  const [modal, setModal] = useState(false);
  const [cartItems] = useState([]);
  const [modalProducts, setModalProducts] = useState(false);

  const patient = useLoadPatient();
  const { data, isFetching } = useLoadAllPatientTutor({});

  const { getWord } = useDictionary();
  const {type} = useConfigurationsSystem();

  return (
    <>
      <Modal stateModal={modal} setModal={setModal} maxwidth="1400px">
        <FormHandler
          initialData={{
            budgetDate: new Date(),
            patientId: patient.data?.name,
            expirationDate: moment().add(1, "day").toDate(),
            clientId: patient.data?.tutor.id,
          }}
          button={{ text: "Salvar" }}
          onSucess={async (data) => {
            const payload = {
              ...data,
              patientId: patient.data?.id,

              dailyMovementId: "cc78aa89-44bf-4a91-939a-482c9af78715",
              items: [
                {
                  unitaryValue: 100,
                  discountValue: 0,
                  productVariationId: "5121562a-aec9-4c6c-a19c-7fa691faaa4a",
                  quantity: 1,
                  saleValue: 100,
                },
              ],
              clientName: "1231233333333 testeeeee",
            };
          }}
        >
          <div className="row">
            <Input
              type="datetime-local"
              name="budgetDate"
              label="Data da Criação"
            />

            <Input
              type="date"
              name="expirationDate"
              label="Data da Expiração"
            />
          </div>

          <div className="row">
            {type === "Vet" && (
              <Input name="patientId" label="Paciente" readOnly />
            )}

            <Select
              onlyOneValue
              label={type === "Vet" ? "Tutor" : "Cliente"}
              name={"clientId"}
              options={
                data?.map((tutor) => ({
                  label: tutor.name,
                  value: tutor.id,
                })) || []
              }
              loading={isFetching}
              placeholder="Cliente"
            />
          </div>

          <div className="row">
            <Input name="observation" label="Observação" />

            <Input name="internalObservation" label="Observação interna" />
          </div>

          <Button
            text="Adicionar items"
            type="button"
            onClick={() => setModalProducts(true)}
          />

          <Modal
            stateModal={modalProducts}
            setModal={setModalProducts}
            maxwidth="700px"
          >
            <FormHandler button={{ text: "FILTRAR" }}>
              <div className="row">
                <Input name="ean" placeholder="EAN" />

                <Input name="description" placeholder="Descrição" />
              </div>
            </FormHandler>

            <FormHandler onSucess={async (data) => {}}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <div className="PRODUCT" style={{ background: "#ccc" }}>
                  <div className="name">
                    <span>NOME PRODUTO - ean: 123</span>
                  </div>

                  <div style={{ display: "flex" }}>
                    {/* Parametro que habilita ou desabilita o valor unitario ver qual é no código antigo */}
                    <InputCurrency
                      name="valorUnitario"
                      readOnly={false}
                      placeholder="Valor unitario"
                    />

                    <InputCurrency
                      name="valorDesconto"
                      placeholder="Valor desconto"
                    />

                    <Input type="number" name="qtd" placeholder="Quantidade" />

                    <Button text="ADICIONAR AO CARRINHO" type="button" />
                  </div>
                </div>

                <div className="PRODUCT" style={{ background: "#ccc" }}>
                  <div className="name">
                    <span>NOME PRODUTO - ean: 123</span>
                  </div>

                  <div style={{ display: "flex" }}>
                    {/* Parametro que habilita ou desabilita o valor unitario ver qual é no código antigo */}
                    <InputCurrency name="valorUnitario" readOnly={false} />

                    <InputCurrency name="valorDesconto" />

                    <Input type="number" name="qtd" />

                    <Button text="ADICIONAR AO CARRINHO" type="button" />
                  </div>
                </div>
              </div>
            </FormHandler>
          </Modal>

          <h3>Items adicionados</h3>
          <table>
            <thead>
              <tr>
                <th>id</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item: any) => (
                <tr>
                  <td>{item?.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormHandler>
      </Modal>

      <Button
        type="button"
        text={`NOVO ${getWord("Orçamento")}`}
        onClick={() => setModal(true)}
      />
    </>
  );
}
