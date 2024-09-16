// @ts-nocheck
import React, { memo, useState, useEffect } from "react";

import { useScheduleTypeServices } from "@/OLD/hooks/useScheduleServicetype";

import { PlusOutline } from "styled-icons/evaicons-outline";
import { FaRegTrashAlt } from "react-icons/fa";

import { Button } from "infinity-forge";
import { Input, AutoComplete, Upload, Modal, Popconfirm, Collapse } from "antd";
import Editor from "@/OLD/components/Editor";
import Print from "@/OLD/components/mini-components/Print";
import AddBudget from "@/OLD/components/Budget/Create";

import { MdDownload } from "react-icons/md";

const { TextArea } = Input;
const { Panel } = Collapse;

const FormChild = memo(function FormChild({
  data,
  setData,
  setVisible,
  body,
  setBody,
  submit,
  beforeUpload,
  fileList,
  setFileList,
  modal = true,
  update,
  scheduleData = false,
  replaceText,
  loading,
  remove,
  patient = false,
  setReload,
  created = false,
  setCreated = false,
  eventId = false,
}) {
  const [selectedService, setSelectedService] = useState({});
  const [formatedServices, setFormatedServices] = useState([]);
  const [photosVisible, setPhotosVisible] = useState(false);
  const [budgetVisible, setBudgetVisible] = useState(false);

  const { services } = useScheduleTypeServices();

  const systemName = process.env.clientName;

  const formatServices = () => {
    setFormatedServices(
      services.map((item) => {
        return {
          ...item,
          value: <span key={item?.id}>{item?.description}</span>,
        };
      })
    );
  };

  useEffect(() => {
    services?.length > 0 && formatServices();
  }, [services]);

  useEffect(() => {
    if (scheduleData && services) {
      setData({
        scheduleServiceId: scheduleData?.serviceType?.id,
        serviceDescription: scheduleData?.serviceType?.description,
      });
      replaceText(
        services?.find(
          (service) => service?.id === scheduleData?.serviceType?.id
        )?.resume,
        setBody
      );
    }
  }, [scheduleData, services]);

  return (
    <form>
      <div className="uk-flex">
        <div className="uk-margin-small-right uk-width-1-2">
          <label>
            Tipo de {systemName === "LiftOne" ? "avaliação" : "atendimento"}
          </label>
          <AutoComplete
            disabled={update}
            className="uk-width-1-1"
            options={formatedServices}
            value={data?.serviceDescription}
            onSelect={(e, option) => {
              replaceText(option?.resume, setBody);
              setData({
                ...data,
                scheduleServiceId: option?.id,
                serviceDescription: option?.description,
              });
            }}
            onChange={(e) => {
              setSelectedService({
                ...selectedService,
                serviceDescription: e,
              });
              setData({ ...data, serviceDescription: e });
            }}
            filterOption={(inputValue, option) =>
              option.description
                .toUpperCase()
                .includes(inputValue.toUpperCase())
                ? option
                : null
            }
          />
        </div>
        <div className="uk-width-1-2">
          <label>Resumo</label>
          <Input
            value={data?.resume}
            onChange={(e) => setData({ ...data, resume: e.target.value })}
          />
        </div>
      </div>
      <div className="uk-margin-small-top uk-flex">
        <div className="uk-width-5-6">
          <Editor editorState={body} setEditorState={setBody} />
        </div>
      </div>
      {modal ? (
        <div className="uk-width-5-6 uk-margin-small-top">
          <label>Observações internas</label>
          <br />
          <TextArea
            value={data?.internalObservation}
            onChange={(e) =>
              setData({ ...data, internalObservation: e.target.value })
            }
          />
        </div>
      ) : (
        <Collapse className="uk-margin-small-top">
          <Panel header="Observações internas">
            <TextArea
              value={data?.internalObservation}
              onChange={(e) =>
                setData({ ...data, internalObservation: e.target.value })
              }
            />
          </Panel>
        </Collapse>
      )}
      {systemName === "LiftOne" && (
        <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-top">
          <label>Anexos</label>
          <Upload
            name="pet-photos"
            className="avatar-uploader uk-text-center"
            multiple={true}
            beforeUpload={beforeUpload}
            showUploadList={false}
            fileList={fileList}
            onChange={(info) => {
              setFileList(info.fileList);
            }}
          >
            <Button text="Adicionar anexos" />
          </Upload>
          {!modal && (
            <p className="uk-link" onClick={() => setPhotosVisible(true)}>
              Visualizar arquivos anexados
            </p>
          )}
          {fileList?.length > 0 && (
            <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-small-top">
              {modal && (
                <div className="uk-margin-top">
                  {fileList.map((item, i) => (
                    <div className="uk-margin-small-top uk-flex uk-flex-around uk-width-1-1">
                      {modal && (
                        <img
                          src={window.URL.createObjectURL(item.originFileObj)}
                          width={150}
                          className="uk-margin-small-right"
                        />
                      )}
                      <a
                        className="uk-link"
                        href={process.env.NEXT_PUBLIC_API + item?.url}
                        target="_blank"
                      >
                        {item.name}
                      </a>
                      &nbsp;
                      <FaRegTrashAlt
                        onClick={() =>
                          setFileList(
                            fileList.filter((file) => item.uid !== file.uid)
                          )
                        }
                        size={15}
                        className="uk-margin-bottom"
                        color="red"
                        style={{ cursor: "pointer" }}
                      />
                      <a
                        className=""
                        href={window.URL.createObjectURL(item.originFileObj)}
                        download={`${item?.name}`}
                      >
                        <MdDownload size={30} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <hr />
      <footer className="uk-flex uk-flex-right">
        {!modal && (
          <Popconfirm
            title="Deseja remover este registro?"
            onConfirm={() => remove()}
          >
            <Button
              htmlType="button"
              type="danger"
              className="uk-margin-small-right"
            >
              Excluir
            </Button>
          </Popconfirm>
        )}
        <Print
          patient={patient}
          onBeforePrint={submit}
          triggerComponent={
            <Button className="uk-margin-right">Imprimir</Button>
          }
          content={body}
          title={data?.serviceDescription}
          string={true}
        />

        <Button
          type="primary"
          loading={loading}
          onClick={() => {
            submit();
            setCreated && setCreated(false);
            setVisible && setVisible(false);
          }}
        >
          Salvar
        </Button>

        {modal && (
          <Button
            className="uk-margin-left"
            onClick={() => {
              setVisible(false);
              setData({});
              setBody("");
            }}
          >
            Cancelar
          </Button>
        )}
      </footer>
      <Modal
        visible={photosVisible}
        onCancel={() => setPhotosVisible(false)}
        title="Fotos"
        footer={null}
      >
        {fileList.map((item, i) => {
          item?.url &&
            timelineService
              .getArquivesDownload(item?.url.replace("/uploads/", ""))
              .then((res) => {
                const elem = document?.querySelector(`#custom-download-${i}`);
                elem.href = window.URL.createObjectURL(res.data);
              });
          return item?.url ? (
            <div className="uk-flex uk-flex-between">
              <img
                width={150}
                className="uk-margin-small-right"
                src={process.env.NEXT_PUBLIC_API + item.url}
              />
              <a
                target="_blank"
                className="uk-link"
                href={process.env.NEXT_PUBLIC_API + item.url}
                download
              >
                {item?.filename}
              </a>
              <FaRegTrashAlt
                size={15}
                color="red"
                style={{ cursor: "pointer" }}
              />
              <a download={`${item?.filename}`} id={`custom-download-${i}`}>
                <MdDownload />
              </a>
            </div>
          ) : (
            <div className="uk-flex uk-between uk-flex-middle">
              <img
                src={window.URL.createObjectURL(item.originFileObj)}
                width={150}
                className="uk-margin-small-right"
              />
              {item?.originFileObj?.name}{" "}
              <span className="uk-text-muted">(Envio pendente)</span>
              <FaRegTrashAlt
                onClick={() =>
                  setFileList(fileList.filter((file) => item.uid !== file.uid))
                }
                size={15}
                color="red"
                style={{ cursor: "pointer" }}
              />
              <a
                className=""
                href={window.URL.createObjectURL(item.originFileObj)}
                download={`${item?.filename}`}
              >
                <MdDownload size={30} />
              </a>
            </div>
          );
        })}
        <hr />
        <footer className="uk-flex uk-flex-right">
          <Button onClick={() => setPhotosVisible(false)}>Fechar</Button>
        </footer>
      </Modal>
      {budgetVisible && (
        <AddBudget
          attendanceId={data.id}
          visible={budgetVisible}
          close={setBudgetVisible}
          clientData={patient}
          setReloadExtern={setReload}
        />
      )}
    </form>
  );
});

export default FormChild;
