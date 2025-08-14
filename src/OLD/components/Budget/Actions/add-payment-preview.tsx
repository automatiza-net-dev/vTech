import { useState } from "react";
import { Modal, Tooltip, Button } from "infinity-forge";

import { MdMonetizationOn } from "react-icons/md";
import Negotiation from "@/OLD/components/Budget/Negotiation";

import { useDictionary, usePermission } from "@/presentation";

export default function AddPaymentPreview({
	budgetId,
	budgetTag,
	onUpdatePayment,
}: {
	onUpdatePayment?: () => void;
	budgetId: string;
	budgetTag: string;
}) {
	const hasPermission = usePermission("ORC02");
	const [visible, setVisible] = useState(false);

	const { getWord } = useDictionary();

	if (!budgetTag || !budgetId || !hasPermission) {
		return <></>;
	}

	return (
		<>
			<Button text="Pagamentos" onClick={() => setVisible(true)} />

			<Modal
				open={visible}
				styles={{ maxWidth: 1300 }}
				onClose={() => setVisible(false)}
			>
				<h2>{`Adicionar Item ao ${getWord("Orçamento")} - ${budgetTag}`}</h2>
				<Negotiation budgetId={budgetId} onUpdatePayment={onUpdatePayment} />
			</Modal>
		</>
	);
}
