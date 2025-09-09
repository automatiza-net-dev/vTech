import { VaccineProtocol } from "@/domain";

export function DefaultVaccine(props: VaccineProtocol) {
	if (props.vaccine.economic_group_id) {
		return null;
	}

	return (
		<div className="">
			<span style={{ fontWeight: "bold" }}>Padrão</span>
		</div>
	);
}
