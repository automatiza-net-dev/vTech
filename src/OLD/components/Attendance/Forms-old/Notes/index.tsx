// @ts-nocheck
// Core
import React, { useState, useCallback, useEffect } from "react";

//Services
import { timelineService } from "@/OLD/services/timeline.service";

// Hooks
import { useProfile } from "@/OLD/hooks/useProfile";

// Components
import { Modal, notification, Button, Popconfirm } from "antd";
import { Container } from "./styles";
import FormChild from "./FormChild";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDownload } from "react-icons/md";

// utils
import moment from "moment";

function Notes({
  visible,
  setVisible,
  patient,
  reload,
  setReload,
  setSelectedUpdate = false,
  modal = true,
  updateData = false,
  flex = false
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [photosOpen, setPhotosOpen] = useState(false);

  const { user } = useProfile();

  const systemName = process.env.clientName;

  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (isJpgOrPng) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return notification.error({
          message: "Você só pode upar imagens até 2MB!"
        });
      }
    }

    return true;
  }, []);

  const urlImageRender = (arr) => {
    const newArr = arr?.map((item, i) => {
      return (arr[i] = {
        ...item,
        url: `${item?.url}`
      });
    });
    setFileList(newArr);
  };

  useEffect(() => {
    modal && setData({ date: moment() });
    updateData && urlImageRender(updateData?.timeline_info?.medias);
    updateData &&
      setData({
        date: moment(updateData?.createdAt),
        updatedAt: moment(updateData?.updatedAt),
        observations: updateData?.timeline_info?.observation,
        resume: updateData?.timeline_info?.resume
      });
  }, [updateData]);

  const submit = useCallback(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append("tag", patient?.id);
    formData.append("observation", data?.observations);
    formData.append("technicianId", user?.id);
    formData.append("resume", data?.resume);
    formData.append("createdAt", moment(data?.date).toISOString());

    fileList.forEach((item) => {
      formData.append("medias[]", item.originFileObj);
    });

    timelineService
      .insertObservations(formData)
      .then((_res) =>
        notification.success({
          message: "Observação registrada com sucesso!"
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao registrar a observação..."
        });
      })
      .finally(() => {
        setLoading(false);
        setVisible(false);
        setFileList([]);
        setData({});
        setReload(!reload);
      });
  }, [data, patient?.id, data, user?.id, fileList]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append("tag", patient?.id);
    formData.append("observation", data?.observations);
    formData.append("technicianId", user?.id);
    formData.append("createdAt", moment(data?.date).toISOString());
    formData.append("resume", data?.resume);

    const newArquives = fileList.filter((item) => !item?.url);

    newArquives.length > 0 &&
      newArquives.forEach((item) => {
        formData.append("medias[]", item.originFileObj);
      });

    timelineService
      .updateObservation(updateData?.id, formData)
      .then((_res) =>
        notification.success({
          message: "Observação atualizada com sucesso!"
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar a observação..."
        });
      })
      .finally(() => {
        // setSelectedUpdate(false);
        setLoading(false);
        setFileList([]);
        setData({});
        setReload(!reload);
      });
  }, [data, patient?.id, data, user?.id, fileList, updateData?.id]);

  const removeMedia = useCallback(
    (idx) => {
      setLoading(true);
      timelineService
        .removeObservationMedia(updateData?.id, idx)
        .then((_res) => {
          setLoading(false);
          setReload(!reload);
          return notification.success({
            messge: "Anexo removido com sucesso!"
          });
        })
        .catch((_err) => {
          setLoading(false);
          return notification.error({
            message: "Houve um erro ao remvoer o anexo selecionado"
          });
        });
    },
    [updateData]
  );

  const removeData = (id) => {
    setLoading(true);
    timelineService
      .removeComplete(id)
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        return notification.success({
          message: "Registro removido com sucesso!"
        });
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  return modal ? (
    <Modal
      visible={visible}
      title={`Lançamento de observações - ${
        systemName === "LiftOne" ? "Cliente" : "Paciente"
      }: ${patient.name}`}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <Container>
        <FormChild
          patient={patient}
          visible={visible}
          setVisible={setVisible}
          data={data}
          setData={setData}
          submit={submit}
          beforeUpload={beforeUpload}
          fileList={fileList}
          setFileList={setFileList}
          modal={modal}
          flex={flex}
          print={submit}
          setPhotosOpen={setPhotosOpen}
        />
      </Container>
      <Modal
        visible={photosOpen}
        title="Fotos anexadas"
        footer={null}
        onCancel={() => setPhotosOpen(false)}
      >
        <div>
          {fileList?.length > 0 &&
            fileList.map((item) => {
              return (
                <p className="uk-margin-remove uk-margin-small-top uk-flex uk-flex-between uk-flex-middle">
                  <img
                    src={window.URL.createObjectURL(item.originFileObj)}
                    width={150}
                    className="uk-margin-small-right"
                  />
                  <p className="uk-marign-remove">{item?.name}</p>
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
                </p>
              );
            })}
        </div>
      </Modal>
    </Modal>
  ) : (
    <>
      <FormChild
        patient={patient}
        visible={visible}
        setVisible={setVisible}
        data={data}
        setData={setData}
        beforeUpload={beforeUpload}
        fileList={fileList}
        submit={submitUpdate}
        setFileList={setFileList}
        modal={modal}
        flex={flex}
        print={submitUpdate}
        setPhotosOpen={setPhotosOpen}
        remove={() => removeData(updateData?._id)}
      />
      {!modal && (
        <Modal
          visible={photosOpen}
          title="Fotos anexadas"
          onCancel={() => setPhotosOpen(false)}
          footer={null}
        >
          {fileList?.length > 0 &&
            fileList.map((item, idx) => {
              item?.url &&
                timelineService
                  .getArquivesDownload(item?.url.replace("/uploads/", ""))
                  .then((res) => {
                    const elem = document?.querySelector(
                      `#custom-download-${idx}`
                    );
                    elem.href = window.URL.createObjectURL(res.data);
                  });

              return item?.url ? (
                <div className="uk-flex uk-flex-between">
                  <img
                    src={process.env.NEXT_PUBLIC_API + item?.url}
                    width={150}
                    className="uk-margin-small-right"
                  />
                  <a
                    target="_blank"
                    className="uk-link"
                    href={`${process.env.NEXT_PUBLIC_API}${item?.url}`}
                    download={item?.filename}
                  >
                    {item?.filename}
                  </a>
                  <Popconfirm
                    title="Deseja realmete remover este anexo?"
                    okText="Sim"
                    onConfirm={() => removeMedia(idx)}
                    cancelText="Não"
                    placement="left"
                  >
                    <FaRegTrashAlt
                      size={15}
                      color="red"
                      style={{ cursor: "pointer" }}
                    />
                    <a download={`${item?.filename}`} id={`custom-download-${idx}`}>
                      <MdDownload />
                    </a>
                  </Popconfirm>
                </div>
              ) : (
                <div className="uk-flex uk-flex-between uk-flex-middle">
                  <img
                    src={window.URL.createObjectURL(item.originFileObj)}
                    width={150}
                    className="uk-margin-small-right"
                  />
                  {item?.originFileObj?.name}{" "}
                  <span className="uk-text-muted">(Envio pendente)</span>
                  <FaRegTrashAlt
                    onClick={() =>
                      setFileList(
                        fileList.filter((file) => item.uid !== file.uid)
                      )
                    }
                    size={15}
                    color="red"
                    style={{ cursor: "pointer" }}
                  />
                  <a
                    className=""
                    href={window.URL.createObjectURL(item.originFileObj)}
                    download={`${item?.fileName}`}
                  >
                    <MdDownload size={30} />
                  </a>
                </div>
              );
            })}
          <hr />
          <footer className="uk-flex uk-flex-right">
            <Button onClick={() => setPhotosOpen(false)}>Fechar</Button>
          </footer>
        </Modal>
      )}
    </>
  );
};

export default Notes;
