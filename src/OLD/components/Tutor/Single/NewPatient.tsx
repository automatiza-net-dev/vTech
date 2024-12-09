// @ts-nocheck
import { memo, useCallback, useEffect, useState } from "react";

import { Form, Input, Modal, notification, Select, Upload } from "antd";
import { useRouter } from "next/router";
import {  useMutation } from "react-query";
import { petsService } from "@/OLD/services/patient.service";
import dynamic from "next/dynamic";

const ImgCrop = dynamic(() => import("antd-img-crop"), { ssr: false });

export const NewPatient = memo(({ isVisible, close }) => {
  const id = useRouter()?.query?.innerpage;
  const [payload, setPayload] = useState({ holderId: id });
  const [photo, setPhoto] = useState();
  const [fileList, setFileList] = useState([]);

  const { loading, mutate } = useMutation(
    (payload) => petsService.createPatient(payload),
    {
      onSuccess: () => {
        notification.success({
          message: "Sucesso",
          description: "Novo paciente cadastrado",
        });
        close();
      },
      onError: () => {
        notification.error({
          message: "Erro",
          message: "Erro ao cadastrar paciente",
        });
      },
    }
  );

  const handleSubmit = useCallback(() => {
    document.getElementById("create-patient-submit").click();
  }, []);

  useEffect(() => {
    setPayload({ ...payload, photo: photo });
  }, [photo]);

  return (
    <div>
      <Modal
        width="80%"
        visible={isVisible}
        onCancel={close}
        onOk={handleSubmit}
        loading={loading}
      >
        <Form layout="vertical" onSubmitCapture={() => mutate(payload)}>
          <h5>
            <span>Novo paciente</span>
          </h5>
          <div className="uk-flex uk-flex-between">
            <Form.Item label="Perfil">
              <ImgCrop
                modalTitle="Editar imagem"
                modalOk="Salvar"
                modalCancel="Cancelar"
              >
                <Upload
                  listType="picture-card"
                  onChange={(e) => {
                    setFileList(e.fileList);
                    if (e.fileList.length > 0) {
                      setPhoto(e.fileList[0].originFileObj);
                    } else {
                      setPhoto(null);
                    }
                  }}
                  accept=".png, .jpeg, .jpg"
                  action=""
                  method=""
                >
                  {fileList.length === 0 && "+ Imagem"}
                </Upload>
              </ImgCrop>
            </Form.Item>
            <div className="uk-width-5-6">
              <div
                className="uk-flex"
                style={{
                  gap: "30px",
                }}
              >
                <Form.Item label="Nome" className="uk-width-1-2">
                  <Input
                    id={"name"}
                    type="text"
                    value={payload?.name}
                    required
                    onChange={(e) =>
                      setPayload({ ...payload, name: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item label="Tag" className="uk-width-1-2">
                  <Input
                    id={"tag"}
                    type="text"
                    value={payload?.tags}
                    onChange={(e) =>
                      setPayload({ ...payload, tags: e.target.value })
                    }
                  />
                </Form.Item>
              </div>
              <div
                className="uk-flex"
                style={{
                  gap: "30px",
                }}
              >
                <Form.Item label="Gênero" className="uk-width-1-2">
                  <Select
                    id={"gender"}
                    value={payload?.gender}
                    required
                    onChange={(e) => setPayload({ ...payload, gender: e })}
                  >
                    <option value="Macho">Macho</option>
                    <option value="Femea">Femea</option>
                  </Select>
                </Form.Item>
                <Form.Item label="Dt. Nascimento" className="uk-width-1-2">
                  <Input
                    id={"birthDate"}
                    type="date"
                    value={payload?.birthDate}
                    required
                    onChange={(e) =>
                      setPayload({ ...payload, birthDate: e.target.value })
                    }
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <input
            type="submit"
            id="create-patient-submit"
            style={{ display: "none" }}
          />
        </Form>
      </Modal>
    </div>
  );
});
