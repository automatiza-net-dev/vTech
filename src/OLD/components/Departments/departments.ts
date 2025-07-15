export type TDepartment = {
	id: number;
	economic_group_id: string | null;
	business_unit_id: string | null;
	description: string;
	image: string | null;
	active: boolean;
	created_at: string;
	create_user_name: string;
	update_user_name: string | null;
	products: {
		id: number;
		active: boolean;
		product: {
			id: string;
			description: string;
		};
	}[];
	items: {
		id: number;
		description: string;
		photo: string | null;
		requiresObservation: boolean;
		order: number;
		active: boolean;
	}[];
};
