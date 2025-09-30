import { Weight } from "./weight";
// import { Pathologie } from "./pathologie";
import { Avaliation } from "./avaliation";

import { Patient, TimeLine, TimeLineEvent, TimelineType } from "@/domain";

// temp
import {
	AddBudgetNew,
	AddSale,
	FormCreateTutor,
	useDictionary,
	useAssignTutor,
	useConfigurationsSystem,
} from "@/presentation";
import Exams from "@/OLD/components/Attendance/Forms-old/AddExam";
import Vaccines from "@/OLD/components/Attendance/Forms-old/Vaccines";
import Executions from "@/OLD/components/Attendance/Forms-old/Executions";
import ReadExecution from "@/OLD/components/Attendance/Forms-old/Executions/read-execution";
import DeathReport from "@/OLD/components/Attendance/Forms-old/Death";
import Observations from "@/OLD/components/Attendance/Forms-old/Notes";
import Documents from "@/OLD/components/Attendance/Forms-old/Documents";
import AddWeight from "@/OLD/components/Attendance/Forms-old/AddWeight";

import Pathologies from "@/OLD/components/Attendance/Forms-old/Patologies";
import MedicalRecipes from "@/OLD/components/Attendance/Forms-old/MedicalRecipe";
import DosesModal from "@/OLD/components/Attendance/Timeline/LaunchedVaccinesList/DosesModal";
import { HospitalizationForm } from "./hospitalization";
import { DischargeForm } from "./discharge";
import { Icon, useAuthAdmin } from "infinity-forge";
import { VideoPhoto } from "./video-photo";

type ActionPatient = {
	active: boolean;
	label: string;
	value: TimelineType | TimeLineEvent;
	Icon: any;
	Component: (props) => any;
	SingleComponent: (props) => any;
};

export function useActionsPatient(patient?: Patient): {
	list: ActionPatient[];
	activeActions: ActionPatient[];
} {
	const { getWord } = useDictionary();
	const assignutor = useAssignTutor();

	const { type } = useConfigurationsSystem();
	const { user } = useAuthAdmin();

	const listActions = [
		{
			active: true,
			label: type !== "Vet" ? "Avaliação" : "Atendimentos",
			value: type !== "Vet" ? "Avaliação" : "Consulta",
			Icon: (
				<svg
					stroke="currentColor"
					fill="currentColor"
					strokeWidth="0"
					viewBox="0 0 384 512"
					height="30"
					width="30"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M336 64h-80c0-35.3-28.7-64-64-64s-64 28.7-64 64H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 40c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm96 304c0 4.4-3.6 8-8 8h-56v56c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-56h-56c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h56v-56c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v56h56c4.4 0 8 3.6 8 8v48zm0-192c0 4.4-3.6 8-8 8H104c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h176c4.4 0 8 3.6 8 8v16z"></path>
				</svg>
			),
			Component: (props) => <Avaliation {...props} />,
			SingleComponent: (props) => {
				switch (props.timeline_info.event) {
					case "TROCA_TUTOR_PRINCIPAL":
						return (
							<div>
								<h3>Troca de tutor principal</h3>
								<span>
									<strong>Troca</strong> {props?.timeline_info?.old_tutor.name}{" "}
									<br /> <strong>Para</strong>:{" "}
									{props?.timeline_info?.new_tutor.name}
								</span>
							</div>
						);
					case "INTERNACAO":
						return <HospitalizationForm {...props?.timeline_info} />;
					case "ALTA":
						return <DischargeForm {...props?.timeline_info} />;
					default:
						return <Avaliation {...props} />;
				}
			},
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
			active: user.unit.unitConfig.treatment,
			// active: true,
			label: "Execução de Tratamentos",
			value: "Execução de Tratamentos",
			Icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="Layer_1"
					data-name="Layer 1"
					viewBox="0 0 512 512"
				>
					<path
						fillRule="evenodd"
						d="M118.266 76.1H58.87a6.07 6.07 0 0 0-6 6v385.31a6.07 6.07 0 0 0 6 6h302.135a6.02 6.02 0 0 0 4.226-1.778 5.9 5.9 0 0 0 1.778-4.226V408.19a133.2 133.2 0 0 1-60.61-20.43H154.521a7.2 7.2 0 1 1 0-14.4h133.14a134.6 134.6 0 0 1-23.171-27.92H154.521a7.2 7.2 0 1 1 0-14.4H256.7a132.8 132.8 0 0 1-9.376-27.949h-92.8a7.184 7.184 0 1 1 0-14.368h90.52a134.2 134.2 0 0 1 0-27.949h-90.523a7.185 7.185 0 1 1 0-14.369h92.806a133 133 0 0 1 9.377-27.948H154.521a7.2 7.2 0 1 1 0-14.4H264.5a134.5 134.5 0 0 1 23.168-27.92H154.521a7.2 7.2 0 1 1 0-14.4H306.4a133.15 133.15 0 0 1 60.609-20.43V82.1a5.95 5.95 0 0 0-1.778-4.226 6.02 6.02 0 0 0-4.226-1.778H301.61v17.835H118.266Zm36.255 43.337h183.81a7.2 7.2 0 1 1 0 14.4h-183.81a7.2 7.2 0 1 1 0-14.4m-23.432 303.441a7.214 7.214 0 0 1-7.2 7.2H81.574a7.2 7.2 0 0 1-7.2-7.2v-42.317a7.177 7.177 0 0 1 7.2-7.2h42.317a7.2 7.2 0 0 1 7.2 7.2Zm0-84.634a7.214 7.214 0 0 1-7.2 7.2H81.574a7.2 7.2 0 0 1-7.2-7.2v-42.317a7.176 7.176 0 0 1 7.2-7.2h42.317a7.2 7.2 0 0 1 7.2 7.2Zm0-84.663a7.2 7.2 0 0 1-7.2 7.2H81.574a7.177 7.177 0 0 1-7.2-7.2v-42.317a7.2 7.2 0 0 1 7.2-7.2h42.317a7.214 7.214 0 0 1 7.2 7.2Zm23.432 162.1h183.81a7.2 7.2 0 0 1 0 14.4h-183.81a7.2 7.2 0 1 1 0-14.4m-30.63-296.247a7.214 7.214 0 0 1 7.2 7.2v42.317a7.2 7.2 0 0 1-7.2 7.2H81.574a7.177 7.177 0 0 1-7.2-7.2V126.63a7.2 7.2 0 0 1 7.2-7.2Zm237.114-57.707H301.61V37.508H381a24.68 24.68 0 0 1 24.6 24.6v81.542a135 135 0 0 0-24.19-2.739V82.1a20.4 20.4 0 0 0-20.4-20.372ZM88.772 387.76h27.92v27.919h-27.92Zm0-84.663h27.92v27.949h-27.92ZM287.213 30.834a6.106 6.106 0 0 0-6.091-6.091h-46.776v-.349a24.408 24.408 0 0 0-48.816 0 1.4 1.4 0 0 0 .029.349h-46.776a6.113 6.113 0 0 0-6.12 6.091v48.7h154.55Zm-77.2.758h-.117a7.2 7.2 0 0 1 0-14.4h.117a7.2 7.2 0 0 1 0 14.4M88.772 218.463h27.92v27.948h-27.92Zm27.92-56.714h-27.92v-27.92h27.92Zm264.714 246.877a134.8 134.8 0 0 0 24.19-2.768V487.4A24.677 24.677 0 0 1 381 512H38.878a24.677 24.677 0 0 1-24.6-24.6V62.106a24.68 24.68 0 0 1 24.6-24.6h79.388v24.221H58.87A20.4 20.4 0 0 0 38.5 82.1v385.31a20.45 20.45 0 0 0 20.371 20.4h302.134a20.45 20.45 0 0 0 20.4-20.4ZM378.23 155.25a119.5 119.5 0 1 0 119.49 119.519A119.517 119.517 0 0 0 378.23 155.25m65.952 145.807h-39.665v39.664h-52.6v-39.664h-39.64v-52.605h39.636v-39.665h52.6v39.665h39.665Z"
					></path>
				</svg>
			),
			Component: Executions,
			SingleComponent: (
				props: TimeLine & {
					changeTags: (key: string) => void;
				},
			) => <ReadExecution {...props} />,
		},

		{
			active: true,
			label: "Fotos, Videos e Documentos",
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
			Component: VideoPhoto,
			SingleComponent: VideoPhoto,
		},
		{
			active: !patient?.death && type === "Vet",
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
			active: type === "Vet",
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
			active: type === "Vet",
			label: "Vermífugo",
			value: "Vermifugos",
			Icon: (
				<svg
					version="1.1"
					id="svg9"
					width="682.66669"
					height="682.66669"
					viewBox="0 0 682.66669 682.66669"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs id="defs13">
						<clipPath clipPathUnits="userSpaceOnUse" id="clipPath23">
							<path d="M 0,512 H 512 V 0 H 0 Z" id="path21" />
						</clipPath>
					</defs>
					<g id="g15" transform="matrix(1.3333333,0,0,-1.3333333,0,682.66667)">
						<g id="g17">
							<g id="g19" clip-path="url(#clipPath23)">
								<g id="g25" transform="translate(256,376.5)">
									<path
										d="m 0,0 v -90.37 c -11.28,-8.47 -21.34,-18.49 -29.84,-29.75 -19.09,-25.24 -30.41,-56.67 -30.41,-90.75 0,-38.2 14.22,-73.08 37.66,-99.63 -21.87,-30.43 -57.57,-50.25 -97.91,-50.25 -66.55,0 -120.5,53.95 -120.5,120.5 V 0 c 0,66.55 53.95,120.5 120.5,120.5 33.28,0 63.4,-13.49 85.21,-35.29 C -13.49,63.4 0,33.28 0,0 Z"
										id="path27"
									/>
								</g>
								<g id="g29" transform="translate(226.16,256.38)">
									<path d="M 0,0 H -211.16" id="path31" />
								</g>
								<g id="g33" transform="translate(497,165.63)">
									<path
										d="m 0,0 h -301.25 c 0,34.08 11.32,65.51 30.41,90.75 8.5,11.26 18.56,21.28 29.84,29.75 25.17,18.92 56.47,30.12 90.37,30.12 C -67.44,150.62 0,83.18 0,0 Z"
										id="path35"
									/>
								</g>
								<g id="g37" transform="translate(497,165.63)">
									<path
										d="m 0,0 c 0,-83.19 -67.44,-150.63 -150.63,-150.63 -44.98,0 -85.36,19.72 -112.96,51 -23.44,26.55 -37.66,61.43 -37.66,99.63 z"
										id="path39"
									/>
								</g>
							</g>
						</g>
					</g>
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
					strokeWidth="2"
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
			Component: AddSale,
			SingleComponent: AddSale,
		},
		{
			active: true,
			label: getWord("Orçamentos"),
			value: getWord("Orçamentos"),
			Icon: (
				<svg
					stroke="currentColor"
					fill="none"
					strokeWidth="2"
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
			Component: AddBudgetNew,
			SingleComponent: AddBudgetNew,
		},
		{
			active: type !== "Vet",
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
			active: type !== "Vet",
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
			active: type === "Vet",
			label: "Tutor",
			value: "Tutores",
			Icon: <Icon name="IconPerson" />,
			Component: (props) => (
				<>
					<FormCreateTutor
						{...props}
						onSuccess={async (data) => {
							patient?.id &&
								(await assignutor.mutateAsync({
									holder: data.id,
									patient: patient?.id,
								}));

							props.setModal(false);
						}}
					/>
				</>
			),
		},
	] as ActionPatient[];

	return {
		list: listActions,
		activeActions: listActions.filter((op) => op?.active),
	};
}
