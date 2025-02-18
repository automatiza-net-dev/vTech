// @ts-nocheck
// Core
import React, { useState, useCallback, useEffect } from "react";

//Services
import { timelineService } from "@/OLD/services/timeline.service";

// Hooks
import { useProfile } from "@/OLD/hooks/useProfile";
import { useLoadPatient } from "@/presentation";

// Components
import { Popconfirm } from "antd";
import FormChild from "./FormChild";
import { Container } from "./styles";
import { Modal, Button, useToast, Icon, useAuthAdmin } from "infinity-forge";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDownload } from "react-icons/md";

// utils
import moment from "moment";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";

function Notes({ modal, setModal, updateData = false, flex = false }: any) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [photosOpen, setPhotosOpen] = useState(false);

  const {user} = useAuthAdmin()

  const patient = useLoadPatient();
  const { createToast } = useToast();

  const queryClient = useQueryClient();
  const router = useRouter();

  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (isJpgOrPng) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return useToast({
          status: "error",
          message: "Você só pode upar imagens até 2MB!",
        });
      }
    }

    return true;
  }, []);

  const urlImageRender = (arr) => {
    const newArr = arr?.map((item, i) => {
      return (arr[i] = {
        ...item,
        url: `${item?.url}`,
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
        resume: updateData?.timeline_info?.resume,
      });
  }, [updateData]);

  const submit = useCallback(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append("tag", patient.data?.id);
    formData.append("observation", data?.observations);
    formData.append("technicianId", user?.id);
    formData.append("resume", data?.resume);
    formData.append("createdAt", moment(data?.date).toISOString());

    fileList.forEach((item) => {
      formData.append("medias[]", item.originFileObj);
    });

    timelineService
      .insertObservations(formData)
      .then(async (_res) => {
        await queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });
        setLoading(false);
        setModal(false);
        setFileList([]);
        setData({});
        return createToast({
          message: "Observação registrada com sucesso!",
          status: "success",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro ao registrar a observação...",
          status: "error",
        });
      });
  }, [data, patient?.data?.id, data, user?.id, fileList]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append("tag", patient.data?.id);
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
      .updateObservation(updateData?._id, formData)
      .then(async (_res) => {
        await queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });
        return createToast({
          status: "success",
          message: "Observação atualizada com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Houve um erro ao atualizar a observação...",
          status: "error",
        });
      })
      .finally(() => {
        // setSelectedUpdate(false);
        setLoading(false);
        setFileList([]);
        setData({});
      });
  }, [data, patient?.data?.id, data, user?.id, fileList, updateData?.id]);

  const removeMedia = useCallback(
    (idx) => {
      setLoading(true);
      timelineService
        .removeObservationMedia(updateData?._id, idx)
        .then(async (_res) => {
          setLoading(false);
          await queryClient.invalidateQueries({
            queryKey: ["LastUpdates", router.query.id],
          });
          return createToast({
            message: "Anexo removido com sucesso!",
            status: "success",
          });
        })
        .catch((_err) => {
          setLoading(false);
          return createToast({
            message: "Houve um erro ao remvoer o anexo selecionado",
            status: "error",
          });
        });
    },
    [updateData]
  );

  const removeData = (id) => {
    setLoading(true);
    timelineService
      .removeComplete(id)
      .then(async (_res) => {
        setLoading(false);
        await queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });
        return createToast({
          message: "Registro removido com sucesso!",
          status: "success",
        });
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  return modal ? (
    <>
      <Container>
        <FormChild
          loading={loading}
          patient={patient}
          visible={modal}
          setVisible={setModal}
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
      <Modal open={photosOpen} onClose={() => setPhotosOpen(false)}>
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
    </>
  ) : (
    <>
      <FormChild
        loading={loading}
        patient={patient}
        visible={modal}
        setVisible={setModal}
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
          open={photosOpen}
          onClose={() => setPhotosOpen(false)}
          styles={{ minWidth: "500px", padding: "20px" }}
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
                    if (elem) {
                      elem.href = window.URL.createObjectURL(res.data);
                    }
                  });

              const extension = item?.url?.split(".")?.[1];

              return item?.url ? (
                <div
                  className="uk-flex uk-flex-between"
                  style={{ marginTop: "10px" }}
                >
                  {extension !== "pdf" ? (
                    <img
                      src={process.env.NEXT_PUBLIC_API + item?.url}
                      width={150}
                      className="uk-margin-small-right"
                    />
                  ) : (
                    <div style={{ width: "70px" }}>
                      <Icon color="#000" name="IconClip" />
                    </div>
                  )}
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
                      onClick={() => removeMedia(idx)}
                    />
                    <a
                      download={`${item?.filename}`}
                      id={`custom-download-${idx}`}
                    >
                      <MdDownload size={30} />
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
            <Button onClick={() => setPhotosOpen(false)} text="Fechar" />
          </footer>
        </Modal>
      )}
    </>
  );
}

export default Notes;
