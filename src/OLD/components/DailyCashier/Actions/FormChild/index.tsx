// @ts-nocheck
// Core
import React, { memo } from "react";

// Components
import { Input } from "antd";
const { TextArea } = Input;

// Utils
import Masks from "@/OLD/utils/masks";

const FormChild = memo<{
	data: Record<string, string>;
	setData: any;
	numberInput?: boolean;
	showObservations?: boolean;
	onSubmit?: () => void;
}>(function FormChild({ data, setData, numberInput, showObservations = true, onSubmit }) {
	const inputRef = React.useRef<any>(null);

	const handlePressEnter = () => {
		// Força atualização do estado com o valor atual do input antes de submeter
		if (inputRef.current && inputRef.current.input) {
			const currentValue = inputRef.current.input.value;
			setData({ ...data, cashierTotal: Masks.money(currentValue) });
		}
		// Chama onSubmit após um pequeno delay para garantir que o estado foi atualizado
		setTimeout(() => {
			onSubmit?.();
		}, 0);
	};

	return (
		<section>
			{numberInput && (
				<div>
					<label>Valor total</label>
					<Input
						ref={inputRef}
						autoFocus
						onChange={(e) =>
							setData({ ...data, cashierTotal: Masks.money(e.target.value) })
						}
						onPressEnter={handlePressEnter}
						value={data?.cashierTotal}
					/>
				</div>
			)}
			{showObservations && (
				<div className="uk-margin-top">
					<label>Observações</label>
					<TextArea
						onChange={(e) => setData({ ...data, observations: e.target.value })}
						value={data?.observations}
					/>
				</div>
			)}
		</section>
	);
});

export default FormChild;
