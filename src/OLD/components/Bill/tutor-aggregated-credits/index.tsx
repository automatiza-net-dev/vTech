import { useQuery } from "infinity-forge";
import {
  currencyFormatter,
} from "@/OLD/components/Budget";
import { billService } from "../../../services/bills.service";

export default function TutorAggregatedCredits(props: { tutorID: string, selectedDebits: number }) {
  const totalDataQuery = useQuery({
    queryKey: ['tutor-aggregated-credits', props.tutorID],
    queryFn: async () => billService.getAgregateClientPayments(props.tutorID)
  })

  if (totalDataQuery.loading) {
    return <p>Carregando...</p>
  }

  const willBeNegative = totalDataQuery.data?.total - props.selectedDebits < 0

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: '0.5rem 1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      overflow: 'hidden',
      maxWidth: '400px',
      fontSize: '14px',
      marginTop: '20px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <div style={{
        padding: '0.5rem 0.75rem',
        borderBottom: '1px solid #e5e7eb',
        fontWeight: 500
      }}>
        <p style={{ margin: 0 }}>Total de créditos:</p>
      </div>
      <div style={{
        padding: '0.5rem 0.75rem',
        borderBottom: '1px solid #e5e7eb',
        textAlign: 'right'
      }}>
        <p style={{ margin: 0 }}>{currencyFormatter(totalDataQuery.data?.total)}</p>
      </div>

      <div style={{
        padding: '0.5rem 0.75rem',
        borderBottom: '1px solid #e5e7eb',
        fontWeight: 500
      }}>
        <p style={{ margin: 0 }}>Valor em aberto:</p>
      </div>
      <div style={{
        padding: '0.5rem 0.75rem',
        borderBottom: '1px solid #e5e7eb',
        textAlign: 'right'
      }}>
        <p style={{ margin: 0 }}>{currencyFormatter(props.selectedDebits)}</p>
      </div>

      <div style={{
        padding: '0.5rem 0.75rem',
        fontWeight: 500
      }}>
        <p style={{ margin: 0 }}>Saldo do cliente:</p>
      </div>
      <div style={{
        padding: '0.5rem 0.75rem',
        textAlign: 'right',
        backgroundColor: willBeNegative ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
        color: willBeNegative ? '#dc2626' : '#16a34a',
        fontWeight: 600
      }}>
        <p style={{ margin: 0 }}>{currencyFormatter(totalDataQuery.data?.total - props.selectedDebits)}</p>
      </div>
    </div>
  )
}
