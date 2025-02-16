export type Expense = {
  ID: number
  Description: string
  Amount: number
}

export const fetchExpenses = async (limit = 10) => {
  const response = await fetch('http://localhost:1323/expenses')
  const data = await response.json()
  return data
}

export const addExpense = async (name: string, amount: number) => {
  const response = await fetch('http://localhost:1323/expenses', {
    method: 'POST',
    body: JSON.stringify({ name, amount })
  })

  const data = await response.json()
  return data
}
