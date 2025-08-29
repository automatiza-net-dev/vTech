import React, { memo, useEffect } from "react";

import { TbVaccine } from "react-icons/tb";

import {
	Icon,
	useToast,
	Button,
	useMutation,
	useQueryClient,
	Popconfirm,
} from "infinity-forge";

import { Checkbox, Input } from "antd";

import moment from "moment";
import { timelineService } from "@/OLD/services/timeline.service";
import { AxiosError } from "axios";

export default function FormChild({
	changeTab,
	vaccineData,
	calendars,
	actionState,
	selectedIndex,
	setSelectedIndex,
	actualData,
	setActualData,
	setActionState,
	submitUpdate,
	setCalendars,
	modal,
	vaccine,
}: any) {
	const { createToast } = useToast();
	const queryClient = useQueryClient();

	const deleteVaccineRecord = useMutation({
		queryKey: ["vaccine", vaccine],
		queryFn: async () => {
			await timelineService.deleteVaccine(vaccine._id);

			queryClient.invalidateQueries(["LastUpdates"]);
		},
		onError(error) {
			if (error instanceof AxiosError) {
				createToast({
					message: error.response?.data?.message ?? "Erro excluindo registro",
					status: "error",
				});
				return;
			}

			createToast({
				message: "Erro excluindo registro",
				status: "error",
			});
		},
	});

	useEffect(() => {
		calendars
			.sort((a, b) => a.dose - b.dose)
			.map(
				(item) =>
					item?.applicationDate && {
						...item,
						applicationDate: moment(item.applicationDate).format("DD/MM/YYYY"),
					},
			);
	}, [calendars]);

  console.log({calendars})

	return (
		<form>
			<div>
				<label>
					{vaccineData?.data?.vaccine?.type === "vaccine"
						? "Vacina"
						: "Vermifugo"}
				</label>
				<p>{`${vaccineData?.vaccine} - ${vaccineData?.protocolLabel}`}</p>
			</div>
			<div className="uk-margin-top uk-flex" style={{ gap: "5px" }}>
				<div
					className="uk-width-1-6"
					style={{ display: "flex", flexDirection: "column", gap: "5px" }}
				>
					<label> Dose </label>
					{calendars.length > 0 &&
						calendars.map((item) => (
							<div>
								<Input disabled={true} value={item?.dose} />
							</div>
						))}
				</div>
				<div
					className="uk-width-1-3"
					style={{ display: "flex", flexDirection: "column", gap: "5px" }}
				>
					<label> Data prevista </label>
					{calendars.length > 0 &&
						calendars.map((item, i) => (
							<div>
								<input
									type="date"
									className="uk-width-1-1 custom-input"
									disabled={
										!(actionState === "schedule" && selectedIndex === i)
									}
									value={
										actionState === "schedule" && selectedIndex === i
											? actualData?.schedulingDate
											: moment(item?.schedulingDate).format("YYYY-MM-DD")
									}
									onChange={(e) => {
										setActualData({
											...actualData,
											schedulingDate: e,
										});
									}}
								/>
							</div>
						))}
				</div>
				<div
					className="uk-width-1-2 input-box"
					style={{ display: "flex", flexDirection: "column", gap: "5px" }}
				>
					<label> Data de aplicação </label>
					{calendars.length > 0 &&
						calendars.map((item, i) => (
							<div>
								<input
									type="date"
									className="uk-width-1-1 custom-input"
									disabled={!(actionState === "vaccine" && selectedIndex === i)}
									value={
										actionState === "vaccine" && selectedIndex === i
											? actualData?.applicationDate
											: moment(item?.applicationDate).format("YYYY-MM-DD")
									}
									onChange={(e) => {
										setActualData({
											...actualData,
											applicationDate: e.target.value,
										});
									}}
								/>
							</div>
						))}
				</div>
				<div
					className="uk-width-1-4"
					style={{ display: "flex", flexDirection: "column", gap: "5px" }}
				>
					<label> Laboratório </label>
					{calendars.length > 0 &&
						calendars.map((item, i) => (
							<div>
								<Input
									disabled={!(actionState === "vaccine" && selectedIndex === i)}
									value={
										actionState === "vaccine" && selectedIndex === i
											? actualData?.laboratory
											: item?.laboratory
									}
									onChange={(e) => {
										setActualData({
											...actualData,
											laboratory: e.target.value,
										});
									}}
								/>
							</div>
						))}
				</div>
				<div
					className="uk-width-1-4"
					style={{ display: "flex", flexDirection: "column", gap: "5px" }}
				>
					<label> Lote </label>
					{calendars.length > 0 &&
						calendars.map((item, i) => (
							<div>
								<Input
									disabled={!(actionState === "vaccine" && selectedIndex === i)}
									value={
										actionState === "vaccine" && selectedIndex === i
											? actualData?.batch
											: item?.batch
									}
									onChange={(e) =>
										setActualData({
											...actualData,
											batch: e.target.value,
										})
									}
								/>
							</div>
						))}
				</div>
				{!modal && (
					<div
						className="uk-width-1-4"
						style={{ display: "flex", flexDirection: "column", gap: "5px" }}
					>
						<label> Apl. fora da Clínica </label>
						{calendars.length > 0 &&
							calendars.map((item, i) => (
								<div>
									<Input
										disabled={
											!(actionState === "vaccine" && selectedIndex === i)
										}
										value={
											actionState === "vaccine" && selectedIndex === i
												? actualData?.appliedOutside
													? "Sim"
													: ""
												: item?.batch
													? "Sim"
													: ""
										}
									/>
								</div>
							))}
					</div>
				)}

				{modal && (
					<div
						className="uk-width-1-3"
						style={{ display: "flex", flexDirection: "column", gap: "5px" }}
					>
						<label> Aplicado fora da Clínica? </label>
						{calendars.length > 0 &&
							calendars.map((item, i) => (
								<div
									className={`uk-flex uk-flex-around uk-width-1-1 ${
										i > 0 ? "uk-margin-small-top" : ""
									}`}
								>
									<span>
										<Checkbox
											disabled={
												!(actionState === "vaccine" && selectedIndex === i)
											}
                      defaultChecked={item.appliedOutside}
											onChange={(event) => {
												setSelectedIndex(i);
												setActionState("vaccine");

												if (!event.target.checked) {
													setActualData({
														...item,
														...actualData,
														appliedOutside: event.target.checked,
													});
													return;
												}

												setActualData({
													...item,
													...actualData,
													appliedOutside: event.target.checked,
													applicationDate:
														actualData.applicationDate ?? new Date(),
													laboratory:
														actualData.laboratory ?? "Fora da Clinica",
													batch: actualData.batch ?? "Fora da Clinica",
												});
											}}
										/>
									</span>
								</div>
							))}
					</div>
				)}

				{modal && (
					<div
						className="uk-width-1-4"
						style={{ display: "flex", flexDirection: "column", gap: "5px" }}
					>
						<label> Ações </label>
						{calendars.length > 0 &&
							calendars.map((item, i) => (
								<div
									className={`uk-flex uk-flex-around uk-width-1-1 ${
										i > 0 ? "uk-margin-small-top" : ""
									}`}
								>
									<span>
										<TbVaccine
											size={20}
											className={
												!item?.applicationDate
													? !actionState
														? "vaccine-icon"
														: "icon-inative"
													: "icon-inative"
											}
											onClick={() => {
												if (!item?.applicationDate) {
													setSelectedIndex(i);
													setActualData({ ...item });
													setActionState("vaccine");
												}
											}}
										/>
									</span>
									<span>
										<svg
											onClick={() => {
												if (!item?.applicationDate) {
													setSelectedIndex(i);
													setActualData({ ...item });
													setActionState("schedule");
												}
											}}
											viewBox="0 0 16 16"
											height="15"
											width="15"
											focusable="false"
											role="img"
											fill="#000"
											xmlns="http://www.w3.org/2000/svg"
											className={
												!item?.applicationDate
													? !actionState
														? "schedule-active"
														: "icon-inative"
													: "icon-inative"
											}
										>
											<title>Calendar icon</title>
											<path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"></path>
										</svg>
									</span>
									<span>
										<svg
											onClick={() => {
												const obj = [...calendars];
												obj.splice(i, 1, {
													...item,
													...actualData,
												});
												if (
													!actualData?.batch ||
													!actualData?.applicationDate ||
													!actualData?.laboratory
												) {
													return createToast({
														message:
															"verifique se os campos estão preenchidos corretamente",
														status: "error",
													});
												}

												if (actionState) {
													submitUpdate(actualData);
													setCalendars(obj);
													setSelectedIndex(false);
													setActionState(false);
													setActualData({});
												}
											}}
											viewBox="0 0 16 16"
											height="20"
											width="20"
											focusable="false"
											role="img"
											fill="currentColor"
											xmlns="http://www.w3.org/2000/svg"
											className={
												actionState && selectedIndex === i
													? "confirm-icon-active"
													: "icon-inative"
											}
										>
											<title>CheckCircle icon</title>
											<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
											<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"></path>
										</svg>
									</span>
									<span>
										<button
											type="button"
											className={
												actionState && selectedIndex === i
													? "cancel-icon-active"
													: "icon-inative"
											}
											onClick={() => {
												setSelectedIndex(false);
												setActionState(false);
												setActualData({});
											}}
											style={{
												background: "transparent",
												border: 0,
												padding: 0,
											}}
										>
											<Icon name="IconBlock" color="#f10" />
										</button>
									</span>
								</div>
							))}
					</div>
				)}
			</div>
			{!modal && changeTab && (
				<div
					className="uk-margin-top uk-flex uk-flex-right"
					style={{ gap: "10px" }}
				>
					<Popconfirm
						onConfirm={async () => {
							deleteVaccineRecord.mutate();
						}}
						idTooltip="a"
						title="Você deseja mesmo apagar esse item?"
						position="top-right"
					>
						<Button
							disabled={deleteVaccineRecord.isLoading}
							type="button"
							text="Excluir"
						/>
					</Popconfirm>

					<Button
						disabled={deleteVaccineRecord.isLoading}
						type="button"
						onClick={() => changeTab("vaccines")}
						text=" Ir para vacinas / Vermífugos"
					/>
				</div>
			)}
		</form>
	);
}
