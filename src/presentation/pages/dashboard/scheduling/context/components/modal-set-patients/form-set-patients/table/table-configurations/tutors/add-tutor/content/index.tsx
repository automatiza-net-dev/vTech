import { useEffect, useState } from "react";
import {
	Select,
	FormHandler,
	useToast,
	LoaderCircle,
	useMutation,
} from "infinity-forge";
import { petsService } from "@/OLD/services/patient.service";

import {
	useAssignTutor,
	useSetMainTutor,
	useLoadAllPatientTutor,
	useLoadSchedulesPatientsKEY,
	useLoadAllPatientTutorKEY,
} from "@/presentation";
import { ButtonCreateTutor } from "../button-create-tutor";
import { useQueryClient } from "infinity-forge";

export function AddTutorContent({ id, setModal, origin }) {
	const [initialHolder, setInitialHolder] = useState(null);

	const { createToast } = useToast();
	const assignTutor = useAssignTutor();
	const setMainTutor = useSetMainTutor();

	const setMainTutorMutation = useMutation({
		queryKey: ["set-main-tutor"],
		queryFn: async (holder) => {
			if (!holder) {
				return;
			}

			await petsService.assignPatientToTutor({
				holder,
				patient: id,
			});
			await petsService.setMainTutor(id, holder);

			await refetch(queryKeyLoadSchedulePatients);

			await refetch(queryKeyLoadAllPatientTutor);

			createToast({
			message: "Responsável vinculado com sucesso!",
				status: "success",
			});

			setModal(false);
		},
	});

	useEffect(() => {
		setMainTutorMutation.mutate(initialHolder);
	}, [initialHolder]);

	const { data, mutate, isLoading } = useLoadAllPatientTutor({ modal: true });

	const { refetch } = useQueryClient();
	const queryKeyLoadAllPatientTutor = useLoadAllPatientTutorKEY();
	const queryKeyLoadSchedulePatients = useLoadSchedulesPatientsKEY();

	async function handleOnSuccess(param) {
		await assignTutor.mutateAsync({
			...param,
			patient: id,
		});

		await setMainTutor.mutateAsync({
			holder: param.holder,
			patient: id,
		});

		await refetch(queryKeyLoadSchedulePatients);

		await refetch(queryKeyLoadAllPatientTutor);

		createToast({
			message: "Responsável vinculado com sucesso!",
			status: "success",
		});

		setModal(false);
	}

	if (isLoading) {
		return <LoaderCircle size={30} />;
	}

	return (
		<FormHandler
			isStickyButtons
			onSucess={handleOnSuccess}
			button={{ text: "Vincular" }}
			customAction={
				{
					props: { refetch: mutate, setInitialHolder, origin },
					Component: ButtonCreateTutor,
				} as any
			}
			initialData={{ holder: initialHolder }}
		>
			<div className="select-box">
				<Select
					label="Selecione o responsável a ser vinculado"
					loading={isLoading}
					name="holder"
					onlyOneValue
					defaultValue={initialHolder ?? undefined}
					options={
						data?.map((item) => ({
							label:
								item?.name + " / " + item?.document + " / " + item?.cellphone,
							value: item.id || "",
						})) || []
					}
				/>
			</div>
		</FormHandler>
	);
}
