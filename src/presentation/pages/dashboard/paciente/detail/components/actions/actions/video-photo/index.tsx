import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import {
	Error,
	FormHandler,
	Input,
	useToast,
	Textarea,
	InputFile,
	useAuthAdmin,
	api,
	FileSystemType,
} from "infinity-forge";

import { DropdownComponentProps } from "../dropdown-item";

import * as S from "./styles";
import { useQueryClient } from "infinity-forge";

export function VideoPhoto({ setModal, ...rest }: DropdownComponentProps) {
	const [loading, setLoading] = useState(false);
	const [photos, setPhotos] = useState<FileSystemType[] | null>(null);

	const { createToast } = useToast();

	const router = useRouter();
	const userId = useAuthAdmin().user.id;

	const patientId = router.query.id as string;

	const { refetch } = useQueryClient();

	useEffect(() => {
		(async () => {
			try {
				if (!rest.timeline_info) {
					return;
				}

				setLoading(true);

				let photos = rest.timeline_info?.photos || [];
				let newPhotos: any[] = [];

				for (const photo of photos) {
					const response = await api({
						url: "s3/generate-link",
						method: "post",
						body: { key: photo.url },
					});

					newPhotos.push({ ...photo, url: response.view });
				}

				setPhotos(newPhotos);
			} catch {
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<Error name="VideoPhoto">
			<S.VideoPhoto>
				{!loading && (
					<FormHandler
						button={{ text: "Salvar" }}
						initialData={{ ...(rest?.timeline_info || {}), photos }}
						onSucess={async (data) => {
							const payload = {
								title: data.title,
								observation: data.observation,
								photos: (data?.photos as FileSystemType[])
									?.map((item) => item.file)
									.filter(Boolean),
								tag: patientId,
								technicianId: userId,
							};

							if (rest._id) {
								// needs to update
								await api({
									url: `n-timeline/photos/${rest._id}`,
									method: "put",
									body: payload,
									headers: {
										"Content-Type": "multipart/form-data; boundary=something",
									},
								});

								if (payload.photos?.length > 0) {
									console.log(payload.photos);
									await api({
										url: `n-timeline/photos/attachments/${rest._id}`,
										method: "post",
										body: { files: payload.photos },
										headers: {
											"Content-Type": "multipart/form-data; boundary=something",
										},
									});
								}

								const photosToDelete = data.photos
									? photos?.reduce((acc, ph, idx) => {
											if (!data.photos.find((dp) => dp.url === ph.url)) {
												acc.push(idx);
											}
											return acc;
										}, [] as number[])
									: photos?.map((_, idx) => idx);
								if (photosToDelete && photosToDelete?.length > 0) {
									const tasks =
										photosToDelete?.map((phD) =>
											api({
												url: `n-timeline/photos/attachments/${rest._id}/${phD}`,
												method: "delete",
												headers: {},
											}),
										) ?? [];
									await Promise.all(tasks);
								}

								createToast({
									message: "Video/Foto atualizado com sucesso!",
									status: "success",
								});
							} else {
								await api({
									url: "n-timeline/photos",
									method: "post",
									body: payload,
									headers: {
										"Content-Type": "multipart/form-data; boundary=something",
									},
								});

								createToast({
									message: "Video/Foto criada com sucesso!",
									status: "success",
								});
							}

							await refetch(["LastUpdates"], { mode: "include" });

							setModal && setModal(false);
						}}
						cleanFieldsOnSubmit={false}
						isStickyButtons
						disableEnterKeySubmitForm
					>
						<Input name="title" label="Titulo" />

						<Textarea name="observation" label="Observações" />

						<InputFile name="photos" isAccumalativeFile multiple isLocalFile />
					</FormHandler>
				)}
			</S.VideoPhoto>
		</Error>
	);
}
