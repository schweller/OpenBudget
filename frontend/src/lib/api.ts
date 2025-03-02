export interface Expense {
  id: string
  description: string
  labels: string[]
  amount: number
  date: string
}

export interface Income {
  id: string
  description: string
  source: string
  amount: number
  date: string
}

export interface Label {
  id: string
  name: string
  amount?: number
}

const API_ENDPOINT = "http://localhost:1323" // Replace with your actual API endpoint

export async function fetchExpenses(startDate: Date, endDate: Date): Promise<{ data: Expense[] }> {
  const response = await fetch(`${API_ENDPOINT}/expenses`)
  if (!response.ok) {
    throw new Error("Failed to fetch expenses")
  }
  return response.json()
}

export async function fetchIncome(startDate: Date, endDate: Date): Promise<{ data: Income[] }> {
  const response = await fetch(`${API_ENDPOINT}/incomes`)
  if (!response.ok) {
    throw new Error("Failed to fetch income")
  }
  return response.json()
}

export async function fetchLabels(startDate: Date, endDate: Date): Promise<{ data: Label[] }> {
  const response = await fetch(
    `${API_ENDPOINT}/labels?startDate=${startDate}&endDate=${endDate}`,
  )
  if (!response.ok) {
    throw new Error("Failed to fetch labels")
  }
  return response.json()
}

export async function addExpense(expense: Omit<Expense, "id">): Promise<Expense> {
  const response = await fetch(`${API_ENDPOINT}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  })
  if (!response.ok) {
    throw new Error("Failed to add expense")
  }
  return response.json()
}

export async function updateExpense(id: string, expense: Omit<Expense, "id">): Promise<Expense> {
  const response = await fetch(`${API_ENDPOINT}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  })
  if (!response.ok) {
    throw new Error("Failed to update expense")
  }
  return response.json()
}

export async function deleteExpense(id: string): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/expenses/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete expense")
  }
}

export async function addIncome(income: Omit<Income, "id" | "description">): Promise<Income> {
  const response = await fetch(`${API_ENDPOINT}/income`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(income),
  })
  if (!response.ok) {
    throw new Error("Failed to add income")
  }
  return response.json()
}

export async function updateIncome(id: string, income: Omit<Income, "id">): Promise<Income> {
  const response = await fetch(`${API_ENDPOINT}/income/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(income),
  })
  if (!response.ok) {
    throw new Error("Failed to update income")
  }
  return response.json()
}

export async function deleteIncome(id: string): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/income/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete income")
  }
}

export async function addLabel(label: Omit<Label, "id">): Promise<Label> {
  const response = await fetch(`${API_ENDPOINT}/labels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(label),
  })
  if (!response.ok) {
    throw new Error("Failed to add label")
  }
  return response.json()
}

export async function updateLabel(id: string, label: Omit<Label, "id">): Promise<Label> {
  const response = await fetch(`${API_ENDPOINT}/labels/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(label),
  })
  if (!response.ok) {
    throw new Error("Failed to update label")
  }
  return response.json()
}

export async function deleteLabel(id: string): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/labels/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete label")
  }
}

