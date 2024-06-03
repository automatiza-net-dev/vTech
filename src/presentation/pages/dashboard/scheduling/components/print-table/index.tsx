import { LoadAllSchedulesUser } from "@/domain"
import { PrintSchedule } from "@/OLD/components/TempPrintCalendar"

export function PrintTable({ data, date }:{data: LoadAllSchedulesUser.Model, date: string}) {
    return <PrintSchedule data={data} date={date} />
}