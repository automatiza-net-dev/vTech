// @ts-nocheck
// Core
import { ImageUploadS3, useLoadPatient, useMe } from "@/presentation";
import React, { memo, useState, useCallback, useEffect } from "react";

// Services
import { RemoteAttachments } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import { timelineService } from "@/OLD/services/timeline.service";

// Components
import { Button } from "antd";
import { Modal, useToast } from "infinity-forge";
import { Container } from "./styles";
import FormChild from "./FormChild";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { FileUploader } from "../Notes";

export default function SendPhotos({
  modal,
  setModal,
  setSelectedUpdate = false,
  updateData = false,
}: any) {
  const [data, setData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photosVisible, setPhotosVisible] = useState(false);
  
  const user = useMe();
  const { createToast } = useToast();

  const patient = useLoadPatient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (isJpgOrPng) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        createToast({
          message: "Você só pode upar imagens até 2MB!",
          status: "error",
        });
      }
    }

    return true;
  }, []);

  useEffect(() => {
    if (updateData) {
      setData({
        note: updateData?.timeline_info?.observation,
        title: updateData?.timeline_info?.title,
      });
      setFileList(updateData?.timeline_info?.photos);
    }
  }, [updateData]);

  const submit = useCallback(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data?.title);
    formData.append("tag", patient?.data?.id);
    formData.append("observation", data?.note);
    formData.append("technicianId", user?.data?.id);

    fileList.forEach((file) => {
      formData.append("photos[]", file.originFileObj);
    });

    timelineService
      .insertArquive(formData)
      .then((_res) => {
        !modal && submitAddAttachment();
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });

        setData({});
        setLoading(false);
        setModal && setModal(false);
        setFileList([]);
        setSelectedUpdate && setSelectedUpdate(false);
        return createToast({
          message: "Arquivo salvo com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.validationErrors?.photos) {
          return createToast({
            message: "Por favor selecione as fotos/videos a serem salvos",
            status: "error",
          });
        }
        createToast({
          message: "Houve um erro ao salvar o arquivo...",
          status: "error",
        });
      });
  }, [patient?.data?.id, data?.note, user?.data?.id, fileList]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    timelineService
      .updatePhotos(updateData?._id, {
        title: data?.title,
        observation: data?.note,
        // files: fileList.filter((item) => item?.status === "pending"),
      })
      .then((res) => {
        submitAddAttachment();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        createToast({
          message: "Houve um erro ao atualizar as informações",
          status: "error",
        });
      })
      .finally(() => {
        setData({});
        setLoading(false);
        setModal && setModal(false);
        setFileList([]);
        setSelectedUpdate && setSelectedUpdate(false);
      });
  }, [data, updateData?._id, fileList]);

  const submitAddAttachment = async () => {
    try {
      await container
        .get<RemoteAttachments>(TypesAutomatiza.RemoteAttachments)
        .addAttachment({
          attachmentId: updateData?._id,
          files: fileList.map((file) => file.status === "pending" && file.file),
        });

      createToast({
        message: "Informações atualizadas com sucesso!",
        status: "succes",
      });

      queryClient.invalidateQueries({
        queryKey: ["LastUpdates", router.query.id],
      });
    } catch (err) {
      createToast({
        message: "Verifique o arquivo selecionado",
        status: "error",
      });
    }
  };

  const removePhoto = (idx) => {
    setLoading(true);
    timelineService
      .removeSinglePhoto(updateData?._id, idx, "photos/attachments")
      .then((_res) => {
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });

        createToast({
          message: "Foto removida com sucesso!",
          status: "success",
        });
      })
      .finally(() => setLoading(false));
  };

  const removeData = (id) => {
    setLoading(true);
    timelineService
      .removeComplete(id)
      .then((_res) => {
        setLoading(false);
        queryClient.invalidateQueries({
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
        <h4>Fotos e vídeos</h4>
        <FormChild
          data={data}
          setData={setData}
          beforeUpload={beforeUpload}
          loading={loading}
          submit={submit}
          setVisible={setModal}
          visible={modal}
          modal={modal}
          fileList={fileList}
          setFileList={setFileList}
          setPhotosVisible={setPhotosVisible}
        />
      </Container>
      <Modal
        onClose={() => setPhotosVisible(false)}
        open={photosVisible}
        styles={{ width: "500px" }}
      >
        <div>
          {fileList?.map((item, idx) => {
            return (
              <p className="uk-margin-remove uk-flex uk-flex-between uk-flex-middle">
                <img
                  src={window.URL.createObjectURL(item.originFileObj)}
                  width={150}
                  className="uk-margin-small-right"
                />
                <p className="uk-margin-remove">{item?.name}</p>
                <FaRegTrashAlt
                  onClick={() => removePhoto(idx)}
                  size={15}
                  className="uk-margin-bottom"
                  color="red"
                  style={{ cursor: "pointer" }}
                />
                <a
                  className=""
                  href={window.URL.createObjectURL(item.originFileObj)}
                  download={item?.name}
                >
                  <MdDownload size={30} />
                </a>
              </p>
            );
          })}
          <hr />
          <div className="uk-flex uk-flex-right">
            <Button onClick={() => setPhotosVisible(false)}>Fechar</Button>
          </div>
        </div>
      </Modal>
    </>
  ) : (
    <Container>
      <h4>Fotos e vídeos</h4>
      <FormChild
        data={data}
        setData={setData}
        beforeUpload={beforeUpload}
        loading={loading}
        submit={submitUpdate}
        setVisible={setModal}
        modal={modal}
        fileList={fileList}
        setFileList={setFileList}
        setPhotosVisible={setPhotosVisible}
        remove={() => removeData(updateData?._id)}
      />
      <Modal
        onClose={() => setPhotosVisible(false)}
        open={photosVisible}
        styles={{ width: "500px" }}
      >
        <div>
          {fileList?.map((item, idx) => {


            return item.status !== "pending" ? (
                   <FileUploader {...item} key={idx} />
            ) : (
              <p className="uk-margin-remove uk-flex uk-flex-between uk-flex-middle uk-margin-small-top">
                <img
                  src={item?.url}
                  width={150}
                  className="uk-margin-small-right"
                />
                <a className="uk-link" target="_blank" href={item?.url}>
                  {item?.filename}
                </a>
                <span>Envio pendente</span>
                <FaRegTrashAlt
                  onClick={() => {
                    const newArr = fileList.filter((_file, i) => i !== idx);
                    setFileList(newArr);
                  }}
                  size={20}
                  color="red"
                  style={{ cursor: "pointer" }}
                />
                <a download={`${item?.filename}`} href={item.url}>
                  <MdDownload size={20} />
                </a>
              </p>
            );
          })}
          <hr />
          <div className="uk-flex uk-flex-right">
            <Button onClick={() => setPhotosVisible(false)}>Fechar</Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
