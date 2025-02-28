"use client"

import React from 'react'
import { fetchExpenses } from './actions'
export type Expense = {
  ID: number
  Description: string
  Amount: number
  Date: string
}

export const emptyExpense: Expense = {
  ID: 0,
  Description: '',
  Amount: 0,
  Date: ''
}

const ExpenseContext = React.createContext(null)

function ExpenseProvider(props: any) {
  const [expenses, setExpenses] = React.useState(props.expenses)
  
  return <ExpenseContext.Provider value={{expenses, setExpenses}} {...props} />
}

function useExpenses() {
  const context = React.useContext(ExpenseContext)

  const {expenses, setExpenses} = context as any

  const getExpenses = async () => {
    const data = await fetchExpenses()
    return data
  }

  return {
    expenses,
    getExpenses
    // setExpenses,
    // fetchExpenses
  }
}

export { ExpenseContext, ExpenseProvider, useExpenses }