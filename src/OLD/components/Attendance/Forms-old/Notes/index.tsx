import React, { useState, useCallback, useEffect } from "react";

import { timelineService } from "@/OLD/services/timeline.service";

import { ImageUploadS3, useLoadPatient, useUploadS3 } from "@/presentation";

import { Popconfirm } from "antd";
import FormChild from "./FormChild";
import { Container } from "./styles";
import {
  Modal,
  Button,
  useToast,
  useAuthAdmin,
  LoaderCircle,
} from "infinity-forge";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDownload } from "react-icons/md";

// utils
import moment from "moment";
import { useRouter } from "next/router";
import { FileIcon, isImage } from "../AddExam";
import { useQueryClient } from "@/presentation/use-query";

function Notes({ modal, setModal, updateData = false, flex = false }: any) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [fileList, setFileList] = useState([]);
  const [photosOpen, setPhotosOpen] = useState(false);

  const { user } = useAuthAdmin();

  const patient = useLoadPatient();
  const { createToast } = useToast();

  const refetch = useQueryClient((st) => st.refetch);
  const router = useRouter();

  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (isJpgOrPng) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return createToast({
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

    fileList.forEach((item: any) => {
      formData.append("medias[]", item.originFileObj);
    });

    timelineService
      .insertObservations(formData)
      .then(async (_res) => {
        await refetch(["LastUpdates", router.query.id]);

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

    const newArquives = fileList.filter((item: any) => !item?.url);

    newArquives.length > 0 &&
      newArquives.forEach((item: any) => {
        formData.append("medias[]", item.originFileObj);
      });

    timelineService
      .updateObservation(updateData?._id, formData)
      .then(async (_res) => {
        await refetch(["LastUpdates", router.query.id]);
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
          await refetch(["LastUpdates", router.query.id]);
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
        await refetch(["LastUpdates", router.query.id]);
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
            fileList.map((item: any) => {
              return (
                <p className="uk-margin-remove uk-margin-small-top uk-flex uk-flex-between uk-flex-middle">
                  {isImage(item.originFileObj) ? (
                    <img
                      src={window.URL.createObjectURL(item.originFileObj)}
                      width={150}
                      className="uk-margin-small-right"
                    />
                  ) : (
                    <div className="uk-margin-small-right">
                      <FileIcon url={item.originFileObj} size={50} />
                    </div>
                  )}
                  <p className="uk-marign-remove">{item?.name}</p>
                  <FaRegTrashAlt
                    onClick={() =>
                      setFileList(
                        fileList.filter((file: any) => item.uid !== file.uid)
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
            fileList.map((item: any, idx) => {
              return item?.url ? (
                <FileUploader key={item?.url} idx={idx} removeMedia={removeMedia} remo {...item} />
              ) : (
                <div className="uk-flex uk-flex-between uk-flex-middle">
                  {isImage(item.originFileObj) ? (
                    <img
                      src={window.URL.createObjectURL(item.originFileObj)}
                      width={150}
                      className="uk-margin-small-right"
                    />
                  ) : (
                    <div className="uk-margin-small-right">
                      <FileIcon url={item.originFileObj} size={50} />
                    </div>
                  )}
                  {item?.originFileObj?.name}{" "}
                  <span className="uk-text-muted">(Envio pendente)</span>
                  <FaRegTrashAlt
                    onClick={() =>
                      setFileList(
                        fileList.filter((file: any) => item.uid !== file.uid)
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

export function FileUploader(props) {
  const { s3, loading } = useUploadS3({ src: props?.url });

  const image = isImage(s3?.view);

  console.log("isImage", image, s3?.view)

  return (
    <div className="uk-flex uk-flex-between" style={{ marginTop: "10px" }}>
      {loading ? (
        <LoaderCircle size={20} color="#000" />
      ) : image ? (
        <ImageUploadS3 src={s3?.view} />
      ) : (
        <div className="uk-margin-small-right">
          <FileIcon url={s3?.view} size={50} />
        </div>
      )}

      <a href={s3?.view} target="_blank" style={{ width: "60%" }}>
        {props?.filename}
      </a>

      <Popconfirm
        title="Deseja realmete remover este anexo?"
        okText="Sim"
        onConfirm={() => props.removeMedia(props.idx)}
        cancelText="Não"
        placement="left"
      >
        <FaRegTrashAlt
          size={15}
          color="red"
          style={{ cursor: "pointer" }}
          onClick={() => props.removeMedia(props.idx)}
        />
      </Popconfirm>

      <a
        href={s3?.download}
        download
        target="_blank"
        style={{ display: "flex", alignItems: "center" }}
      >
        <MdDownload size={30} />
      </a>
    </div>
  );
}
