import {
	api,
	Input,
	InputPassword,
	InputRadio,
	InputSwitch,
	Select,
	TextEditor,
} from "infinity-forge";

import { Bill } from "@/domain";

import moment from "moment";
import * as S from "./styles";
import { useFormikContext } from "formik";
import { useSystem } from "@/presentation";
import { useQuery } from "infinity-forge";

export function ApproveCancelGlobal({
	bill,
	cancelled,
}: {
	bill: Bill;
	cancelled: Bill["cancelled"];
}) {
	const { values, setFieldValue } = useFormikContext<{ cancelled?: string }>();

	const { unit } = useSystem();

	const { data, isFetching } = useQuery({
		queryKey: ["search-deposits", unit?.id],
		queryFn: async () => {
			const response = await api({
				url: "deposits/search-deposits",
				method: "get",
				body: { unitId: unit?.id, status: "Ativo", type: "Venda" },
			});
			return response as any[];
		},
		enabled: cancelled === "A" && !!unit?.id,
	});

	return (
		<>
			<S.Cancel>
				<div>
					<h3>Motivo Cancelamento</h3>
					<div
						dangerouslySetInnerHTML={{
							__html: bill.cancelReason ?? "",
						}}
					/>
				</div>

				<div>
					<h3>Usuário e Data Solicitação Cancelamento</h3>
					<h4>{bill.cancelUser?.name}</h4>
					<h4>{moment(bill?.cancelDate).format("DD/MM/YYYY HH:mm")}</h4>
				</div>
			</S.Cancel>

			<S.Cancel>
				<div>
					<TextEditor
						disableToolbar
						name={`notes`}
						label={
							cancelled === "P"
								? "Observação avaliação técnica"
								: cancelled === "A"
									? "Observações do cancelamento"
									: cancelled === "F"
										? "Observação avaliação financeira"
										: "Motivo do cancelamento"
						}
					/>
				</div>

				<div>
					{(cancelled === "P" || cancelled === "A") && (
						<InputRadio
							name={`cancelled`}
							label={
								cancelled === "P"
									? "Avaliação técnica"
									: cancelled === "A"
										? "Aprovar cancelamento?"
										: ""
							}
							options={[
								{
									label: "Aprovado",
									value: "true",
								},
								{
									label: "Não aprovado",
									value: "false",
								},
							]}
						/>
					)}

					{cancelled === "A" &&
						values?.cancelled === "true" &&
						unit?.configs?.businessUnits?.controls_deposit === true && (
							<Select
								label="Depósito estoque - devolução cancelamento"
								name="depositId"
								loading={isFetching}
								onlyOneValue
								options={
									data?.map((item) => ({
										label:
											item?.description +
											" " +
											(item.principal ? "Principal" : ""),
										value: item?.id,
									})) || []
								}
							/>
						)}

					<div className="row">
						<Input name="userEmail" label="Email" />

						<InputPassword label="Senha" name="userPwd" />
					</div>

					{cancelled === "F" && (
						<InputSwitch
							name="noPayments"
							label="Não cancelar nenhum pagamento"
							design="checkbox"
							onChangeInput={(value) => {
								if (value === true) {
									const newBillPayments = Object.keys(
										(values as any)?.billPayments || {},
									).reduce((reducer, item) => {
										return { ...reducer, [item]: {} };
									}, {});

									setFieldValue("billPayments", newBillPayments);
								}
							}}
						/>
					)}
				</div>
			</S.Cancel>
		</>
	);
}
