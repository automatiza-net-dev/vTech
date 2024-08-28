// @ts-nocheck
// Core
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";

// Services
import { examService } from "@/OLD/services/exams.service";
import { patientExamsService } from "@/OLD/services/patientExam.service";
import { textReplaceService } from "@/OLD/services/textReplace.service";
import { timelineService } from "@/OLD/services/timeline.service";

// Hooks
import { useProfile } from "@/OLD/hooks/useProfile";
import { useLoadPatient } from "@/presentation";

// Utils
import moment from "moment";
import "moment/locale/pt-br";

// Components
import { Button, Popconfirm } from "antd";
import { Modal, useToast } from "infinity-forge";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDownload } from "react-icons/md";

import FormChild from "./FormChild";
import { useQueryClient } from "react-query";

export default function LaunchExam({
  modal,
  setModal,
  examPatientData = false,
  setSelectedPatientExam = false,
}: any) {
  const [photosOpen, setPhotosOpen] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [allExams, setAllExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState({});
  const [report, setReport] = useState("");
  const [request, setRequest] = useState("");
  const [fileList, setFileList] = useState([]);
  const [viewArquives, setViewArquives] = useState([]);
  const [examSearch, setExamSearch] = useState("");

  const patient = useLoadPatient();

  const router = useRouter();
  const eventId = router.query.innerpage;

  const { user, clinic } = useProfile();
  const { createToast } = useToast();

  const systemName = process.env.clientName;

  const replaceText = (str, setState) => {
    setLoading(true);
    textReplaceService
      .replaceText({
        base: str,
        businessUnitId: clinic?.id,
        userId: user?.id,
        tutorId:
          systemName !== "LiftOne" ? patient.data?.tutor?.id : patient.data?.id,
        dependentId: patient.data?.id,
      })
      .then((res) => setState(res.data.result))
      .catch((_err) => setState(""))
      .finally(() => setLoading(false));
  };

  const getAllExams = useCallback(() => {
    setLoading(true);
    examService
      .listExams({ active: true })
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
        setData({
          patientExamId,
          examId: res?.data?.exam?.id,
          realizedAt: moment(res?.data?.created_at),
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
      formData.append("realizedAt", moment(new Date()).format("YYYY-MM-DD"));

      fileList.forEach((item) => {
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

  const queryClient = useQueryClient();

  const submitExamLauching = useCallback(
    (visible = false) => {
      let error = false;
      setLoading(true);
      patientExamsService
        .launchExam({
          laboratory: selectedExam?.own_laboratory
            ? clinic.fantasy_name
            : data?.laboratory,
          report: request,
          examId: selectedExam?.id,
          patientId: patient.data?.id,
          scheduleId: eventId,
          solicitorId: user?.id,
          status: report,
        })
        .then((res) => {
          fileList.length > 0
            ? submitArquives(res?.data?.id)
            : createToast({
                message: "Exame solicitado com sucesso!",
                status: "success",
              });
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
          queryClient.invalidateQueries({
            queryKey: ["LastUpdates", router.query.id],
          });

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
    [selectedExam, clinic, data, request, report, user, fileList]
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
          queryClient.invalidateQueries({
            queryKey: ["LastUpdates", router.query.id],
          });

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

  const removeAttachment = useCallback(
    (attachmentId) => {
      setLoading(true);
      patientExamsService
        .removeAttachment(
          examPatientData?.timeline_info.patient_exam.id,
          attachmentId
        )
        .then((_res) => {
          setLoading(false);
          queryClient.invalidateQueries({
            queryKey: ["LastUpdates", router.query.id],
          });
          return createToast({ message: "Anexo removido!", status: "success" });
        })
        .catch((err) => {
          setLoading(false);
          return createToast({
            message: "Houve um problema ao remover o anexo",
            status: "error",
          });
        });
    },
    [examPatientData]
  );

  const removeData = () => {
    setLoading(true);
    timelineService
      .removeComplete(examPatientData?._id)
      .then((_res) => {
        setLoading(false);
        queryClient.invalidateQueries({
          queryKey: ["LastUpdates", router.query.id],
        });
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
        clinic={clinic}
        modal={modal}
        update={examPatientData}
        viewArquives={viewArquives}
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
            fileList.map((item, i) => {
              item?.attachment &&
                timelineService
                  .getArquivesDownload(
                    item?.attachment.replace("/uploads/", "")
                  )
                  .then((res) => {
                    const elem = document?.querySelector(
                      `#custom-download-${i}`
                    );
                    if (elem) {
                      elem.href = window.URL.createObjectURL(res.data);
                    }
                  });

              return item?.attachment ? (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={process.env.NEXT_PUBLIC_API + item.attachment}
                    width={150}
                    className="uk-margin-small-right"
                  />

                  <a
                    style={{ marginRight: "20px" }}
                    target="_blank"
                    className="uk-link"
                    href={process.env.NEXT_PUBLIC_API + item.attachment}
                  >
                    {item?.filename}
                  </a>

                  <FaRegTrashAlt
                    onClick={() => {
                      removeAttachment(item?.id);
                    }}
                    size={20}
                    color="red"
                    style={{ cursor: "pointer", marginRight: "20px" }}
                  />

                  <a download={`${item?.filename}`} id={`custom-download-${i}`}>
                    <MdDownload size={20} />
                  </a>
                  <hr />
                </div>
              ) : (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={window.URL.createObjectURL(item.originFileObj)}
                    width={150}
                    className="uk-margin-small-right"
                  />
                  <span>{item?.originFileObj?.name}</span>
                  <span className="uk-text-muted">(Envio pendente)</span>
                  <FaRegTrashAlt
                    onClick={() =>
                      setFileList(
                        fileList.filter((file) => item.uid !== file.uid)
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
        clinic={clinic}
        update={examPatientData}
        viewArquives={viewArquives}
        replaceText={replaceText}
        examSerch={examSearch}
        setExamSearch={setExamSearch}
        setPhotosOpen={setPhotosOpen}
      />
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
