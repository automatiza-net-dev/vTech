import { Weight } from "./weight";
// import { Pathologie } from "./pathologie";
import { Avaliation } from "./avaliation";

import { TimeLineEvent, TimelineType } from "@/domain";

// temp
import { useLoadPatient } from "@/presentation";
import AddBill from "@/OLD/components/Bill/Create";
import AddBudget from "@/OLD/components/Budget/Create";
import Exams from "@/OLD/components/Attendance/Forms-old/AddExam";
import Vaccines from "@/OLD/components/Attendance/Forms-old/Vaccines";
import DeathReport from "@/OLD/components/Attendance/Forms-old/Death";
import Observations from "@/OLD/components/Attendance/Forms-old/Notes";
import Documents from "@/OLD/components/Attendance/Forms-old/Documents";
import AddWeight from "@/OLD/components/Attendance/Forms-old/AddWeight";
import SendPhotos from "@/OLD/components/Attendance/Forms-old/SendPhotos";
import Attendance from "@/OLD/components/Attendance/Forms-old/Attendance";
import Pathologies from "@/OLD/components/Attendance/Forms-old/Patologies";
import MedicalRecipes from "@/OLD/components/Attendance/Forms-old/MedicalRecipe";
import DosesModal from "@/OLD/components/Attendance/Timeline/LaunchedVaccinesList/DosesModal";
import { Icon } from "infinity-forge";
import { CreateTutor } from "@/OLD/components/Tutor/Create";

type ActionPatient = {
  active: boolean;
  label: string;
  value: TimelineType | TimeLineEvent;
  Icon: JSX.Element;
  Component: (props) => JSX.Element;
  SingleComponent: (props) => JSX.Element;
};

export function useActionsPatient(): {
  list: ActionPatient[];
  activeActions: ActionPatient[];
} {
  const patient = useLoadPatient();

  const listActions = [
    {
      active: true,
      label: process.env.clientName === "LiftOne" ? "Avaliação" : "Atendimentos",
      value: process.env.clientName === "LiftOne" ? "Avaliação" : "Consulta",
      Icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 384 512"
          height="30"
          width="30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 40c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm96 304c0 4.4-3.6 8-8 8h-56v56c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-56h-56c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h56v-56c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v56h56c4.4 0 8 3.6 8 8v48zm0-192c0 4.4-3.6 8-8 8H104c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h176c4.4 0 8 3.6 8 8v16z"></path>
        </svg>
      ),
      Component: Avaliation,
      SingleComponent: Avaliation,
    },
    {
      active: true,
      label: "Documentos",
      value: "Documento",
      Icon: (
        <svg
          viewBox="0 0 48 48"
          height="15"
          width="15"
          aria-hidden="true"
          focusable="false"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 4v11.25A3.75 3.75 0 0 0 27.75 19H40v21a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h13Zm2.5.46v10.79c0 .69.56 1.25 1.25 1.25h11.71L26.5 4.46Z"></path>
        </svg>
      ),
      Component: Documents,
      SingleComponent: (props) => (
        <Documents modal={false} updateData={props} />
      ),
    },
    {
      active: true,
      label: "Exames",
      value: "Exames",
      Icon: (
        <svg
          viewBox="0 0 32 32"
          height="15"
          width="15"
          aria-hidden="true"
          focusable="false"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 4a1 1 0 0 0-1 1v4H8a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4V13a4 4 0 0 0-4-4h-3V5a1 1 0 0 0-1-1h-8Zm7 5h-6V6h6v3Zm-2 6v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 1 1 2 0Z"></path>
        </svg>
      ),
      Component: Exams,
      SingleComponent: (props) => (
        <Exams examPatientData={props} modal={false} />
      ),
    },
    {
      active: true,
      label: "Fotos e Videos",
      value: "Fotos",
      Icon: (
        <svg
          viewBox="0 0 24 24"
          height="15"
          width="15"
          aria-hidden="true"
          focusable="false"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 8H2v12a2 2 0 0 0 2 2h12v-2H4z"></path>
          <path d="M20 2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-9 12V6l7 4z"></path>
        </svg>
      ),
      Component: SendPhotos,
      SingleComponent: (props) => (
        <SendPhotos modal={false} updateData={props} />
      ),
    },
    {
      active: !patient.data?.death,
      label: "Óbito",
      value: "OBITO",
      Icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 384 512"
          height="15"
          width="15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M352 128h-96V32c0-17.67-14.33-32-32-32h-64c-17.67 0-32 14.33-32 32v96H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h96v224c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V256h96c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32z"></path>
        </svg>
      ),
      Component: DeathReport,
      SingleComponent: DeathReport,
    },
    {
      active: true,
      label: "Observações",
      value: "Observação",
      Icon: (
        <svg
          viewBox="0 0 24 24"
          height="15"
          width="15"
          aria-hidden="true"
          focusable="false"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.75 2c1.2 0 2.17.93 2.24 2.1l.01.16v15.5c0 1.19-.93 2.16-2.1 2.24H6.25c-1.2 0-2.17-.92-2.24-2.09L4 19.76V4.26c0-1.2.93-2.17 2.1-2.25h11.65Zm-10 5a.75.75 0 1 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5ZM7 11.75c0 .41.34.75.75.75h8.5a.75.75 0 0 0 0-1.5h-8.5a.75.75 0 0 0-.75.75ZM7.75 15a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z"></path>
        </svg>
      ),
      Component: Observations,
      SingleComponent: (props) => (
        <Observations modal={false} updateData={props} />
      ),
    },
    {
      active: true,
      label: "Patologias",
      value: "Patologia",
      Icon: (
        <svg
          viewBox="0 0 24 24"
          height="15"
          width="15"
          aria-hidden="true"
          focusable="false"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15.794 11.09c.332-.263.648-.542.947-.84l.136-.142c.283-.293.552-.598.801-.919l.062-.075c.255-.335.486-.688.702-1.049l.128-.22c.205-.364.395-.737.559-1.123.02-.047.035-.095.055-.142.147-.361.274-.731.383-1.109.021-.07.044-.14.063-.211.107-.402.189-.813.251-1.229.013-.087.021-.175.032-.263.051-.432.087-.869.087-1.311V2h-2v.457c0 .184-.031.361-.042.543H6.022C6.012 2.819 6 2.64 6 2.457V2H4v.457c0 4.876 3.269 9.218 7.952 10.569l.028.009c2.881.823 5.056 3.146 5.769 5.965H6.251l.799-2h7.607a7.416 7.416 0 0 0-2.063-2h-4c.445-.424.956-.774 1.491-1.09a9.922 9.922 0 0 1-2.08-1.014C5.55 14.812 4 17.779 4 21.015V23h2v-1.985L6.001 21h11.998l.001.015V23h2v-1.985c0-3.83-2.159-7.303-5.443-9.07a11.1 11.1 0 0 0 1.072-.729c.055-.042.11-.082.165-.126zm-1.19-1.604a8.945 8.945 0 0 1-2.325 1.348c-.092.036-.185.068-.278.102A8.95 8.95 0 0 1 8.836 9h6.292c-.171.161-.332.333-.517.48l-.007.006zM17.619 5c-.005.016-.007.033-.012.049l-.044.151a9.089 9.089 0 0 1-.513 1.252c-.096.19-.213.365-.321.548h-9.48a9.066 9.066 0 0 1-.871-2h11.241z"></path>
        </svg>
      ),
      Component: Pathologies,
      SingleComponent: (props) => (
        <Pathologies updateData={props} modal={false} />
      ),
    },
    {
      active: true,
      label: "Peso",
      value: "Peso",
      Icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 640 512"
          height="15"
          width="15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M528 448H352V153.25c20.42-8.94 36.1-26.22 43.38-47.47l132-44.26c8.38-2.81 12.89-11.88 10.08-20.26l-10.17-30.34C524.48 2.54 515.41-1.97 507.03.84L389.11 40.37C375.3 16.36 349.69 0 320 0c-44.18 0-80 35.82-80 80 0 3.43.59 6.71 1.01 10.03l-128.39 43.05c-8.38 2.81-12.89 11.88-10.08 20.26l10.17 30.34c2.81 8.38 11.88 12.89 20.26 10.08l142.05-47.63c4.07 2.77 8.43 5.12 12.99 7.12V496c0 8.84 7.16 16 16 16h224c8.84 0 16-7.16 16-16v-32c-.01-8.84-7.17-16-16.01-16zm111.98-144c0-16.18 1.34-8.73-85.05-181.51-17.65-35.29-68.19-35.36-85.87 0-87.12 174.26-85.04 165.84-85.04 181.51H384c0 44.18 57.31 80 128 80s128-35.82 128-80h-.02zM440 288l72-144 72 144H440zm-269.07-37.51c-17.65-35.29-68.19-35.36-85.87 0C-2.06 424.75.02 416.33.02 432H0c0 44.18 57.31 80 128 80s128-35.82 128-80h-.02c0-16.18 1.34-8.73-85.05-181.51zM56 416l72-144 72 144H56z"></path>
        </svg>
      ),
      Component: Weight,
      SingleComponent: Weight,
    },
    {
      active: true,
      label: "Receitas",
      value: "Formato Receita Médica",
      Icon: (
        <svg
          viewBox="0 0 384 512"
          height="15"
          width="15"
          aria-hidden="true"
          focusable="false"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zm-96 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v48h48c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16h-48v48c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-48h-48c-8.8 0-16-7.2-16-16v-32c0-8.8 7.2-16 16-16h48v-48z"
          ></path>
        </svg>
      ),
      Component: MedicalRecipes,
      SingleComponent: (props) => (
        <MedicalRecipes modal={false} updateData={props} />
      ),
    },
    {
      active: process.env.clientName === "Sanclá",
      label: "Vacinas",
      value: "Vacinas",
      Icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M441 7l32 32 32 32c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-15-15L417.9 128l55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-72-72L295 73c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l55 55L422.1 56 407 41c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0zM210.3 155.7l61.1-61.1c.3 .3 .6 .7 1 1l16 16 56 56 56 56 16 16c.3 .3 .6 .6 1 1l-191 191c-10.5 10.5-24.7 16.4-39.6 16.4H97.9L41 505c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l57-57V325.3c0-14.9 5.9-29.1 16.4-39.6l43.3-43.3 57 57c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-57-57 41.4-41.4 57 57c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-57-57z" />
        </svg>
      ),
      Component: Vaccines,
      SingleComponent: (props) => (
        <DosesModal changeTab={props.changeTab} vaccine={props} modal={false} />
      ),
    },
    {
      active: true,
      label: "Vendas",
      value: "Vendas",
      Icon: (
        <svg
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          height="15"
          width="15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
          <path d="M21 21l-6 -6"></path>
          <path d="M12 7h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
          <path d="M10 13v1m0 -8v1"></path>
        </svg>
      ),
      Component: AddBill,
      SingleComponent: AddBill,
    },
    {
      active: true,
      label: "Orçamentos",
      value: "Orçamentos",
      Icon: (
        <svg
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          height="15"
          width="15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
          <path d="M21 21l-6 -6"></path>
          <path d="M12 7h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
          <path d="M10 13v1m0 -8v1"></path>
        </svg>
      ),
      Component: AddBudget,
      SingleComponent: AddBudget,
    },
    {
      active: process.env.clientName === "LiftOne",
      label: "Glicemia",
      value: "Glicemia",
      Icon: (
        <svg
          viewBox="0 0 24 24"
          height="15"
          width="15"
          aria-hidden="true"
          focusable="false"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.726 13.02 14 16H9v-1h4.065a.5.5 0 0 0 .416-.777l-.888-1.332A1.995 1.995 0 0 0 10.93 12H3a1 1 0 0 0-1 1v6a2 2 0 0 0 2 2h9.639a3 3 0 0 0 2.258-1.024L22 13l-1.452-.484a2.998 2.998 0 0 0-2.822.504zM15.403 12a3 3 0 0 0 3-3c0-2.708-3-6-3-6s-3 3.271-3 6a3 3 0 0 0 3 3z"></path>
        </svg>
      ),
      Component: (props) => (
        <AddWeight
          visible={props.modal}
          setVisible={props.setModal}
          type={"Glicemia"}
        />
      ),
      SingleComponent: (props) => (
        <AddWeight updateData={props} modal={false} type={"Glicemia"} />
      ),
    },
    {
      active: process.env.clientName === "LiftOne",
      label: "Pressão arterial",
      value: "Aferição de Pressão",
      Icon: (
        <svg
          viewBox="0 0 24 24"
          height="15"
          width="15"
          aria-hidden="true"
          focusable="false"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.726 13.02 14 16H9v-1h4.065a.5.5 0 0 0 .416-.777l-.888-1.332A1.995 1.995 0 0 0 10.93 12H3a1 1 0 0 0-1 1v6a2 2 0 0 0 2 2h9.639a3 3 0 0 0 2.258-1.024L22 13l-1.452-.484a2.998 2.998 0 0 0-2.822.504zM15.403 12a3 3 0 0 0 3-3c0-2.708-3-6-3-6s-3 3.271-3 6a3 3 0 0 0 3 3z"></path>
        </svg>
      ),
      Component: (props) => (
        <AddWeight
          visible={props.modal}
          setVisible={props.setModal}
          type={"Pressão arterial"}
        />
      ),
      SingleComponent: (props) => (
        <AddWeight updateData={props} modal={false} type={"Pressão arterial"} />
      ),
    },
    {
      active: process.env.client === "sancla",
      label: "Tutor",
      value: "Tutores",
      Icon: <Icon name="IconPerson" />,
      Component: (props) => (
        <CreateTutor {...props} setVisible={props.setModal} />
      ),
    },
  ] as ActionPatient[];

  return {
    list: listActions,
    activeActions: listActions.filter((op) => op?.active),
  };
}
