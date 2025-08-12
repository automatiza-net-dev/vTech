import CreateBankingTransaction from "@/OLD/components/Banking/Create";
import { LayoutDashboard } from "@/presentation";
import { PrivatePage } from "infinity-forge";
import { useRouter } from "next/router";

export default function CreateBankingTransactionPage() {
	const router = useRouter();
	return (
		<LayoutDashboard>
			<CreateBankingTransaction cleanUp={() => router.back()} />
		</LayoutDashboard>
	);
}
