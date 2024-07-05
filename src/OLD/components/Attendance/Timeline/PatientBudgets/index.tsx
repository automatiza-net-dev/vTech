// @ts-nocheck
// Core
import * as React from "react"

// Services

// Utils
import "moment/locale/pt-br"

// Icons

// Components
import { Button, Table } from "antd"
import { useFindCompleteBudgets } from "@/OLD/hooks/useBudgets"
import {
  budgetStatusFormatter,
  currencyFormatter,
  dateFormatter
} from "../../../Budget"
import BudgetActions from "../../../Budget/Actions/Container"
import CreateBudgetDrawer from "./Create"
import { useDictionary } from "@/presentation"

const Columns = () => {
  const { getWord } = useDictionary();

  return [
    {
      title: `Data ${getWord("Orçamento")}`,
      dataIndex: "budget_date",
      key: "budget_date"
    },
    {
      title: "Data Validade",
      dataIndex: "expiration_date",
      key: "expiration_date"
    },
    {
      title: "Data Conf/Canc.",
      dataIndex: "finished_at",
      key: "finished_at"
    },
    {
      title: "Funcionário",
      dataIndex: "user_name",
      key: "user_name"
    },
    {
      title: "Qtd. Items",
      dataIndex: "items_count",
      key: "items_count"
    },
    {
      title: "Total",
      dataIndex: "total_value",
      key: "total_value"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions"
    }
  ]
} 

const mapper = (data = []) => {
  return data.map((budget) => {
    return {
      id: budget.id,
      budget_date: dateFormatter(budget.budget_date),
      expiration_date: dateFormatter(budget.expiration_date),
      finished_at: budget.finished_at ? dateFormatter(budget.finished_at) : "-",
      user_name: budget.user.name,
      items_count: budget.items.length,
      total_value: currencyFormatter(budget.total_value),
      status: budgetStatusFormatter(budget.status),
      actions: (
        <>
          <BudgetActions budget={budget} />
        </>
      )
    }
  })
}

const PatientBudgets = React.memo(function PatientBudgets({ patient }) {
  const [openCreate, setOpenCreate] = React.useState(false)
  const { data, refetch } = useFindCompleteBudgets({ patient: patient.id })

  const colunms = Columns()

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <Button style={{ width: "200px" }} onClick={() => setOpenCreate(true)}>
          Criar novo
        </Button>

        <Table dataSource={mapper(data)} columns={colunms} />
      </div>

      <CreateBudgetDrawer
        patient={patient}
        visible={openCreate}
        close={() => {
          setOpenCreate(false)
          refetch()
        }}
      />
    </>
  )
})

export default PatientBudgets
