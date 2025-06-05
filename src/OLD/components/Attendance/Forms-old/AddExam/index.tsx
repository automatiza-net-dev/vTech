import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { RemoteChangeStatus } from "@/data";
import { container, patientTypes } from "@/container";

import { examService } from "@/OLD/services/exams.service";
import { patientExamsService } from "@/OLD/services/patientExam.service";
import { textReplaceService } from "@/OLD/services/textReplace.service";
import { timelineService } from "@/OLD/services/timeline.service";

import { useMe } from "@/presentation/hooks";
import { useQueryClient } from "infinity-forge";
import {
  useLoadPatient,
  useLoadAllScheduleStatuses,
  useConfigurationsSystem,
} from "@/presentation";

// Utils
import moment from "moment";
import "moment/locale/pt-br";

// Components
import { Button } from "antd";
import { Modal, useToast } from "infinity-forge";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDownload } from "react-icons/md";

import FormChild from "./FormChild";
import { FileUploader } from "../Notes";

export default function LaunchExam({
  modal,
  setModal,
  examPatientData = false,
  setSelectedPatientExam = false,
  reloadSchedule,
}: any) {
  const [photosOpen, setPhotosOpen] = useState(false);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [allExams, setAllExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState<any>({});
  const [report, setReport] = useState("");
  const [request, setRequest] = useState("");
  const [fileList, setFileList] = useState([]);
  const [examSearch, setExamSearch] = useState("");

  const patient = useLoadPatient();
  const queryClient = useQueryClient();
  const router = useRouter();
  const eventId = router.query.innerpage;

  const userInfo = useMe();
  const { createToast } = useToast();
  const scheduleStatuses = useLoadAllScheduleStatuses();

  const { type } = useConfigurationsSystem();

  const replaceText = (str, setState) => {
    setLoading(true);
    textReplaceService
      .replaceText({
        base: str,
        businessUnitId: userInfo?.data?.unit?.id,
        userId: userInfo?.data?.id,
        tutorId: type === "Vet" ? patient.data?.tutor?.id : patient.data?.id,
        dependentId: patient.data?.id,
      })
      .then((res) => setState(res.data.result))
      .catch((_err) => setState(""))
      .finally(() => setLoading(false));
  };

  const getAllExams = useCallback(() => {
    setLoading(true);
    examService
      .listExams({ active: true } as any)
      .then((res) => {
        setLoading(false);
        setAllExams(res.data);
      })
      .catch((err) => {
        setLoading(false);
        createToast({
          message: "Houve um erro ao recuperar os exames disponíveis...",
          status: "error",
        });
      });
  }, []);

  const getUpdateData = (patientExamId) => {
    if (!patientExamId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    patientExamsService
      .showPatientExam(patientExamId)
      .then((res) => {
        res.data?.attachments?.length > 0 && setFileList(res.data?.attachments);
        console.log("res", res)
        setData({
          patientExamId,
          examId: res?.data?.exam?.id,
          requestedAt: moment(
            res?.data?.requestedAt?.slice(0, 10),
            "YYYY-MM-DD"
          ),
          createdAt: moment(res?.data?.created_at?.slice(0, 10), "YYYY-MM-DD"),
          laboratory: res?.data?.laboratory,
          releasedAt: moment(res?.data?.relesed_at),
          resultDate: moment(
            res?.data?.result_date ? res?.data?.result_date : moment(new Date())
          ),
        });
        setSelectedExam(res?.data?.exam);
        setRequest(res?.data?.report);
        setReport(res?.data?.status);
      })
      .catch((err) => {
        setLoading(false);
        createToast({
          message:
            "Houve um problema ao recuperar as informações do exame do paciente",
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    (async () => {
      await getAllExams();
      !modal && getUpdateData(examPatientData?.timeline_info?.patient_exam?.id);
    })();
  }, [modal, examSearch]);

  const submitArquives = useCallback(
    (id) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("patientId", patient.data?.id);
      formData.append("requestedAt", moment(new Date()).format("YYYY-MM-DD"));

      fileList.forEach((item: any) => {
        formData.append("attachments[]", item.originFileObj);
      });

      patientExamsService.createAttachment(id, formData).then((_res) => {
        examPatientData
          ? createToast({
              message: "Exame atualizado com sucesso!",
              status: "success",
            })
          : createToast({
              message: "Exame solicitado com sucesso!",
              status: "success",
            });
      });
    },
    [fileList]
  );



  const submitExamLauching = useCallback(
    (visible = false) => {
      let error = false;
      setLoading(true);
      patientExamsService
        .launchExam({
          laboratory: selectedExam?.own_laboratory
            ? userInfo?.data?.unit?.fantasy_name
            : data?.laboratory,
          report: request,
          examId: selectedExam?.id,
          patientId: patient.data?.id,
          scheduleId: eventId,
          solicitorId: userInfo?.data?.id,
          status: report,
          requestedAt: moment(data?.requestedAt).format("YYYY-MM-DD"),
        })
        .then(async (res) => {
          fileList.length > 0
            ? submitArquives(res?.data?.id)
            : createToast({
                message: "Exame solicitado com sucesso!",
                status: "success",
              });

          if (
            router?.query?.scheduleId &&
            patient?.data?.scheduleId &&
            !patient?.data?.scheduleStartedAt
          ) {
            const statusId =
              scheduleStatuses.data?.find((status) => status.type === "ATEND")
                ?.id || "";

            await container
              .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
              .change({
                scheduleId: router.query.scheduleId as string,
                statusId,
              });

            reloadSchedule && reloadSchedule();
          }
        })
        .catch((err) => {
          error = true;
          setLoading(false);
          const errors = err?.response?.data?.errors.map((item) => item?.field);
          if (errors.includes("report")) {
            return createToast({
              message: `O campo de solicitação é necessário`,
              status: "error",
            });
          }
        })
        .finally(() => {
          queryClient?.refetch(["LastUpdates"], { mode: "include" });

          if (!error) {
            modal && setModal && setModal(false);
            if (!visible) {
              setSelectedExam({});
              setFileList([]);
              setData({});
              setModal && setModal(false);
              setRequest("");
              setReport("");
              setExamSearch("");
            }
          }
        });
    },
    [selectedExam, data, request, report, userInfo, fileList]
  );

  const submitUpdatePatientExam = useCallback(
    (visible = false) => {
      setLoading(false);
      patientExamsService
        .updatePatientExam(examPatientData?.timeline_info?.patient_exam?.id, {
          laboratory: data?.laboratory,
          report: request,
          examId: selectedExam?.id,
          patientId: patient.data?.id,
          scheduleId: eventId,
          status: report,
          releasedAt: moment(data?.releasedAt).toISOString(),
          resultDate: moment(data?.resultDate).toISOString(),
        })
        .then((_res) => {
          fileList.length > 0
            ? submitArquives(examPatientData?.timeline_info?.patient_exam?.id)
            : createToast({
                message: "Exame atualizado com sucesso!",
                status: "success",
              });
        })
        .catch((err) => {
          setLoading(false);
          return createToast({
            message: `${err.response.data.errors[0].message}`,
            status: "error",
          });
        })
        .finally(() => {
          queryClient?.refetch(["LastUpdates"], { mode: "include" });

          if (!visible) {
            setSelectedExam({});
            setFileList([]);
            setData({});
            setRequest("");
            setReport("");
            setSelectedPatientExam && setSelectedPatientExam(false);
          }
        });
    },
    [selectedExam, request, report, patient, eventId, data, fileList]
  );

  const removeData = () => {
    setLoading(true);
    timelineService
      .removeComplete(examPatientData?._id)
      .then((_res) => {
        setLoading(false);
        queryClient?.refetch(["LastUpdates"], { mode: "include" });
        return createToast({
          message: "Registro removido com sucesso!",
          status: "error",
        });
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  return !modal ? (
    <>
      <FormChild
        loading={loading}
        patient={patient}
        examPatientData={examPatientData}
        data={data}
        allExams={allExams}
        setData={setData}
        selectedExam={selectedExam}
        request={request}
        setRequest={setRequest}
        report={report}
        setReport={setReport}
        fileList={fileList}
        setSelectedExam={setSelectedExam}
        setFileList={setFileList}
        submitExamLauching={submitExamLauching}
        submitUpdatePatientExam={submitUpdatePatientExam}
        clinic={userInfo?.data?.unit}
        modal={modal}
        update={examPatientData}
        viewArquives={[]}
        replaceText={replaceText}
        examSearch={examSearch}
        setExamSearch={setExamSearch}
        setPhotosOpen={setPhotosOpen}
        submitArquives={submitArquives}
        remove={removeData}
      />

      <Modal
        open={photosOpen}
        onClose={() => setPhotosOpen(false)}
        styles={{ minWidth: "800px", padding: "10px" }}
      >
        <div>
          {fileList?.length > 0 &&
            fileList.map((item: any, i) => {
              return item?.attachment ? (
                <FileUploader {...item} url={item?.attachment} key={i} />
              ) : (
                <div style={{ marginTop: "10px" }}>
                  {isImage(window.URL.createObjectURL(item.originFileObj)) ? (
                    <img
                      src={window.URL.createObjectURL(item.originFileObj)}
                      width={150}
                      className="uk-margin-small-right"
                    />
                  ) : (
                    <div className="uk-margin-small-right">
                      <FileIcon
                        url={window.URL.createObjectURL(item.originFileObj)}
                        size={50}
                      />
                    </div>
                  )}
                  <span>{item?.originFileObj?.name}</span>
                  <span className="uk-text-muted">(Envio pendente)</span>
                  <FaRegTrashAlt
                    onClick={() =>
                      setFileList(
                        fileList.filter((file: any) => item.uid !== file.uid)
                      )
                    }
                    size={20}
                    color="red"
                    style={{ cursor: "pointer", marginRight: "20px" }}
                  />
                  <a
                    className=""
                    href={window.URL.createObjectURL(item.originFileObj)}
                    download={`${item?.filename}`}
                  >
                    <MdDownload size={25} />
                  </a>
                  <hr />
                </div>
              );
            })}
        </div>
        <hr />
        <footer>
          <Button onClick={() => setPhotosOpen(false)}>Fechar</Button>
        </footer>
      </Modal>
    </>
  ) : (
    <>
      <FormChild
        loading={loading}
        patient={patient}
        examPatientData={examPatientData}
        data={data}
        allExams={allExams}
        setData={setData}
        selectedExam={selectedExam}
        request={request}
        setRequest={setRequest}
        report={report}
        setReport={setReport}
        fileList={fileList}
        setVisible={setModal}
        setSelectedExam={setSelectedExam}
        setFileList={setFileList}
        submitExamLauching={submitExamLauching}
        submitUpdatePatientExam={submitUpdatePatientExam}
        modal={modal}
        clinic={userInfo?.data?.unit}
        update={examPatientData}
        viewArquives={[]}
        replaceText={replaceText}
        examSerch={examSearch}
        setExamSearch={setExamSearch}
        setPhotosOpen={setPhotosOpen}
      />
      <Modal open={photosOpen} onClose={() => setPhotosOpen(false)}>
        <div>
          {fileList?.length > 0 &&
            fileList.map((item: any) => {
              return (
                <p className="uk-margin-remove uk-margin-small-top uk-flex uk-flex-between uk-flex-middle">
                  {isImage(window.URL.createObjectURL(item?.originFileObj)) ? (
                    <img
                      src={window.URL.createObjectURL(item.originFileObj)}
                      width={150}
                      className="uk-margin-small-right"
                    />
                  ) : (
                    <div className="uk-margin-small-right">
                      <FileIcon
                        url={window.URL.createObjectURL(item.originFileObj)}
                        size={50}
                      />
                    </div>
                  )}

                  <p className="uk-marign-remove">{item?.name}</p>

                  <FaRegTrashAlt
                    onClick={() =>
                      setFileList(
                        fileList.filter((file: any) => item.uid !== file.uid)
                      )
                    }
                    size={30}
                    className=""
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
  );
}

export interface FileIconProps {
  url: string;
  size?: number;
}

export const isImage = (fileName: string) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

  const fileNameAcess =
    typeof fileName === "string"
      ? fileName
      : typeof fileName === "object"
      ? (fileName as any)?.type
      : "";

  return imageExtensions.some((ext) =>
    fileNameAcess?.toLowerCase()?.includes(ext)
  );
};

export const FileIcon: React.FC<FileIconProps> = ({ url, size = 24 }) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  return (
    <svg {...commonProps}>
      <path
        d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
        fill="#95A5A6"
      />
      <text x="6" y="18" fontSize="9" fill="white" fontFamily="Arial">
        FILE
      </text>
    </svg>
  );
};
