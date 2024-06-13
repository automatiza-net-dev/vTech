// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useLoadPatient } from "@/presentation";

// Services
import { timelineService } from "@/OLD/services/timeline.service";

// Components
import { notification, Button } from "antd";
import { Modal } from "infinity-forge";
import { Container } from "./styles";
import FormChild from "./FormChild";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";

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
  const { user } = useProfile();

  const patient = useLoadPatient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (isJpgOrPng) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return notification.error({
          message: "Você só pode upar imagens até 2MB!",
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
    formData.append("technicianId", user?.id);

    fileList.forEach((file) => {
      formData.append("photos[]", file.originFileObj);
    });

    timelineService
      .insertArquive(formData)
      .then((_res) => {
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });

        notification.success({
          message: "Arquivo salvo com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao salvar o arquivo...",
        });
      })
      .finally(() => {
        setData({});
        setLoading(false);
        setModal && setModal(false);
        setFileList([]);
        setSelectedUpdate && setSelectedUpdate(false);
      });
  }, [patient?.data?.id, data?.note, user?.id, fileList]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    timelineService
      .updatePhotos(updateData?._id, {
        title: data?.title,
        observation: data?.note,
      })
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });
        setLoading(false);
        notification.success({
          message: "Informações atualizadas com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        notification.error({
          message: "Houve um erro ao atualizar as informações",
        });
      })
      .finally(() => {
        setData({});
        setLoading(false);
        setModal && setModal(false);
        setFileList([]);
        setSelectedUpdate && setSelectedUpdate(false);
      });
  }, [data, updateData?._id]);

  const removePhoto = (idx) => {
    setLoading(true);
    timelineService
      .removeSinglePhoto(updateData?._id, idx, "photos/attachments")
      .then((_res) => {
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });

        notification.success({ message: "Foto removida com sucesso!" });
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

        return notification.success({
          message: "Registro removido com sucesso!",
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
      <Modal onClose={() => setPhotosVisible(false)} open={photosVisible} styles={{ width: '500px' }}>
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
      <Modal onClose={() => setPhotosVisible(false)} open={photosVisible} styles={{ width: '500px' }}>
        <div>
          {fileList?.map((item, idx) => {
            item?.url &&
              timelineService
                .getArquivesDownload(item?.url.replace("/uploads/", ""))
                .then((res) => {
                  const elem = document?.querySelector(
                    `#custom-download-${idx}`
                  );
                  elem.href = window.URL.createObjectURL(res.data);
                })
                .catch((err) => console.log(err, "<"));

            return (
              <p className="uk-margin-remove uk-flex uk-flex-between uk-flex-middle uk-margin-small-top">
                <img
                  src={process.env.NEXT_PUBLIC_API + item?.url}
                  width={150}
                  className="uk-margin-small-right"
                />
                <a
                  className="uk-link"
                  target="_blank"
                  href={process.env.NEXT_PUBLIC_API + item?.url}
                >
                  {item?.filename}
                </a>
                <FaRegTrashAlt
                  onClick={() => removePhoto(idx)}
                  size={15}
                  className="uk-margin-bottom"
                  color="red"
                  style={{ cursor: "pointer" }}
                />
                <a download={`${item?.filename}`} id={`custom-download-${idx}`}>
                  <MdDownload />
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
