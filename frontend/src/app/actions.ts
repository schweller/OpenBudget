'use server'

import { Expense } from './expense'
import { Income } from './income'

export const addExpense = async (name: string, amount: number) => {
  const payload = {
    name: name,
    amount: amount
  }
  const response = await fetch('http://localhost:1323/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },    
    body: JSON.stringify(payload)
  })
  const data = await response.json()
  return data
}

export const updateExpense = async (expense: Expense, name: string, amount: number) => {
  const payload = {
    name: name,
    amount: amount,
  }
  const response = await fetch(`http://localhost:1323/expenses/${expense.ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json()
  return data
}

export const fetchExpenses = async (limit = 10): Promise<{data: Expense[]}> => {
  const response = await fetch('http://localhost:1323/expenses')
  const data = await response.json()
  return data
}

export const fetchIncomes = async (limit = 10): Promise<{data: Income[]}> => {
  const response = await fetch('http://localhost:1323/incomes/by_month/2025/02')
  const data = await response.json()
  return data
}