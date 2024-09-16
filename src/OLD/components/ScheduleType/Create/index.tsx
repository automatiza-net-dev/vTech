// @ts-nocheck
import { Form, Input, Modal, Select, notification } from "antd";
import { LoadingSpin } from "@/OLD/components/mini-components";
import { CreateTypeService } from "@/OLD/components/ServiceType/Create";
import { memo, useCallback, useEffect, useState } from "react";
import Editor from "@/OLD/components/Editor";
const { Option } = Select;

// services
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import { productService } from "@/OLD/services/product.service";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Button } from "infinity-forge";

export const Create = ({ setRefreshTable }) => {
  const { Option } = Select;
  const [loading, setLoading] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [data, setData] = useState({ active: "true" });
  const [isModalServiceType, setIsModalServiceType] = useState(false);
  const [refreshServiceTypes, setRefreshServiceTypes] = useState(false);
  const [body, setBody] = useState("");

  const canCreateScheduleService = useUserHasPermission("ASV01");

  const handleGetServiceTypes = useCallback(() => {
    setLoading(true);
    scheduleTypeServices
      .getScheduleServiceGroups()
      .then((res) => {
        setServiceTypes(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getProducts = useCallback(() => {
    setLoading(true);
    productService
      .listProducts()
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao buscar os produtos disponíveis",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleOk = useCallback(() => {
    document.getElementById("submit-button").click();
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canCreateScheduleService) {
      return notification.error({ message: "Ação não permitida" });
    }

    setLoading(true);
    scheduleTypeServices
      .createScheduleServiceType({ ...data, resume: body })
      .then((res) => {
        setRefreshTable();
        setIsModalVisible(false);
        setData(null);
        notification.success({
          message: "Sucesso",
          description: "Serviço de Agendamento cadastrado",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Erro",
          description: "Erro ao criar serviço de Agendamento",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data, loading, body]);

  useEffect(() => {
    handleGetServiceTypes();
    getProducts();
  }, [refreshServiceTypes]);

  return (
    <div>
      <Button
        onClick={() => setIsModalVisible(true)}
        disabled={canCreateScheduleService}
        text="Cadastrar"
      />

      <Modal
        title="Criar Serviços de Agendamento"
        onCancel={() => setIsModalVisible(false)}
        visible={isModalVisible}
        footer={null}
      >
        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <div className="uk-flex">
            <Form.Item
              label="Descrição"
              className="uk-margin-small-right uk-width-3-4"
            >
              <Input
                required
                placeholder=""
                value={data?.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Status" className="uk-width-1-4">
              <Select
                onChange={(val) => setData({ ...data, active: val })}
                value={data?.active}
              >
                <Option value="true">Ativo</Option>
                <Option value="false">Inativo</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="uk-flex">
            <Form.Item
              label="Minutos bloqueio agenda"
              className="uk-width-1-2 uk-margin-small-right"
            >
              <Input
                required
                placeholder=""
                type="number"
                value={data?.reservedMinutes}
                onChange={(e) =>
                  setData({ ...data, reservedMinutes: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Permite Retorno" className="uk-width-1-2">
              <Select
                onChange={(val) => setData({ ...data, allowReturn: val })}
                value={data?.allowReturn}
              >
                <Option value="true">Sim</Option>
                <Option value="false">Não</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="Tipo de serviço">
            <Select
              required
              value={data?.scheduleServiceGroupId}
              onChange={(e) => {
                setData({ ...data, scheduleServiceGroupId: e });
              }}
            >
              {!loading ? (
                serviceTypes.map((item, key) => {
                  return (
                    <Option key={key} value={item.id}>
                      {item.description}
                    </Option>
                  );
                })
              ) : (
                <LoadingSpin />
              )}
              <Option value="">
                <Button
                  className="uk-width-1-1"
                  onClick={() => setIsModalServiceType(true)}
                  text="Criar novo tipo de serviço"
                />
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="Conteúdo / Descritivo do atendimento">
            <Editor editorState={body} setEditorState={setBody} />
          </Form.Item>
          <input type="submit" id="submit-button" style={{ display: "none" }} />
        </Form>

        <CreateTypeService
          isModalVisible={isModalServiceType}
          setIsModalVisible={setIsModalServiceType}
          setRefresh={() => setRefreshServiceTypes(!refreshServiceTypes)}
        />

        <footer
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <Button text="Cancelar" onClick={() => setIsModalVisible(false)} />
          <Button text="Salvar" onClick={() => handleOk()} />
        </footer>
      </Modal>
    </div>
  );
};
