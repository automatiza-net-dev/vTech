// @ts-nocheck
import {
  Form,
  Input,
  Modal,
  notification,
  Select,
  Button as ButtonA,
} from "antd";
import { Button, LoadingSpin } from "@/OLD/components/mini-components";
import { CreateTypeService } from "@/OLD/components/ServiceType/Create";
import { useRouter } from "next/router";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { memo, useCallback, useEffect, useState } from "react";
import { scheduleTypeServices } from "@/OLD/services/scheduleType.service";
import Editor from "@/OLD/components/Editor";

// Icons
import { EditTwoTone } from "@ant-design/icons";

export const Edit = memo(({ reload, setReload, icon, id }) => {
  const { Option } = Select;
  const router = useRouter();
  const idRouter = router?.query?.innerpage;
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [isModalServiceType, setIsModalServiceType] = useState(false);
  const [refreshServiceTypes, setRefreshServiceTypes] = useState(false);
  const [body, setBody] = useState(false);

  const canEditScheduleService = useUserHasPermission("ASV02");

  const handleEdit = useCallback(() => {
    setLoading(true);

    scheduleTypeServices
      .editScheduleType(!idRouter ? id : idRouter, {
        description: data?.description,
        allowReturn: data?.allowReturn,
        scheduleServiceGroupId: data?.scheduleServiceGroupId,
        reservedMinutes: data?.reservedMinutes,
        active: data?.active,
        productId: data?.product_id,
        resume: body,
      })
      .then((res) => {
        setIsModalVisible(false);
        notification.success({
          message: "Sucesso",
          description: "Serviço de Agendamento editada!",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Erro",
          description: "Erro ao editar serviço de Agendamento",
        });
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload);
      });
  }, [data, id, body]);

  const handleGet = useCallback(() => {
    setLoading(true);
    isModalVisible &&
      scheduleTypeServices
        .getSingleScheduleType(!idRouter ? id : idRouter)
        .then((res) => {
          setBody(res?.data?.resume);
          setData({
            ...res.data,
            reservedMinutes: res.data.reserved_minutes,
            scheduleServiceGroupId: res.data.schedule_service_group_id,
            allowReturn: res.data.allow_return,
          });
        })
        .finally(() => {
          setLoading(false);
        });
  }, [id, isModalVisible]);

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

  useEffect(() => {
    handleGet();
    handleGetServiceTypes();
  }, [handleGet, reload]);

  return (
    <div>
      {canEditScheduleService && (
        <EditTwoTone
          onClick={() => setIsModalVisible(true)}
          className="uk-margin-small-left"
        />
      )}
      <Modal
        title="Editar"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          layout="vertical"
          onSubmitCapture={(e) => {
            e.preventDefault();
            handleEdit();
          }}
        >
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
                value={`${data?.active}`}
              >
                <Option value="true">Ativo</Option>
                <Option value="false">Inativo</Option>
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
                <ButtonA
                  className="uk-width-1-1"
                  onClick={() => setIsModalServiceType(true)}
                >
                  Criar novo tipo de serviço
                </ButtonA>
              </Option>
            </Select>
          </Form.Item>
          <div className="uk-flex">
            <Form.Item
              label="Minutos"
              className="uk-margin-small-right uk-width-1-1"
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
            <Form.Item label="Permite Retorno" className="uk-width-1-1">
              <Select
                onChange={(val) => setData({ ...data, allowReturn: val })}
                value={`${data?.allowReturn}`}
              >
                <Option value="true">Sim</Option>
                <Option value="false">Não</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item label="Conteúdo / Descritivo do atendimento">
            <Editor editorState={body} setEditorState={setBody} />
          </Form.Item>
          <footer className="uk-flex uk-flex-right">
            <ButtonA
              type="primary"
              htmlType="submit"
              className="uk-margin-right"
            >
              Salvar
            </ButtonA>
            <ButtonA onClick={() => setIsModalVisible(false)}>Cancelar</ButtonA>
          </footer>
        </Form>
        <CreateTypeService
          isModalVisible={isModalServiceType}
          setIsModalVisible={setIsModalServiceType}
          setRefresh={() => setRefreshServiceTypes(!refreshServiceTypes)}
        />
      </Modal>
    </div>
  );
});
