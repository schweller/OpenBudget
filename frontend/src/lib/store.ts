"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  fetchExpenses,
  fetchIncome,
  fetchLabels,
  type Expense,
  type Income,
  type Label,
  addExpense,
  addIncome,
  updateIncome,
  deleteIncome,
  deleteExpense,
  updateExpense,
  addLabel,
  updateLabel,
  deleteLabel,
} from "./api"

interface FinanceStore {
  expenses: Expense[]
  income: Income[]
  labels: Label[]
  startDate: Date
  endDate: Date
  isLoading: boolean
  error: string | null
  fetchData: () => Promise<void>
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>
  updateExpense: (id: string, expense: Omit<Expense, "id">) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  addIncome: (income: Omit<Income, "id" | "description">) => Promise<void>
  updateIncome: (id: string, income: Omit<Income, "id">) => Promise<void>
  deleteIncome: (id: string) => Promise<void>
  addLabel: (label: Omit<Label, "id">) => Promise<void>
  updateLabel: (id: string, label: Omit<Label, "id">) => Promise<void>
  deleteLabel: (id: string) => Promise<void>
  setDateRange: (startDate: Date, endDate: Date) => void
  calculateTotalExpenses: () => number
  calculateTotalIncome: () => number
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      income: [],
      labels: [],
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      isLoading: false,
      error: null,
      fetchData: async () => {
        set({ isLoading: true, error: null })
        try {
          const { startDate, endDate } = get()
          const [{ data: expenses }, { data: income }, { data: labels }] = await Promise.all([
            fetchExpenses(startDate, endDate),
            fetchIncome(startDate, endDate),
            fetchLabels(startDate, endDate),
          ])
          set({ expenses, income, labels, isLoading: false })
        } catch (error) {
          console.log(error)
          set({ error: (error as Error).message, isLoading: false })
        }
      },
      addExpense: async (expense) => {
        try {
          const newExpense = await addExpense(expense)
          set((state) => ({ expenses: [...state.expenses, newExpense] }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },
      updateExpense: async (id, expense) => {
        try {
          const updatedExpense = await updateExpense(id, expense)
          set((state) => ({
            expenses: state.expenses.map((e) => (e.id === id ? updatedExpense : e)),
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },
      deleteExpense: async (id) => {
        try {
          await deleteExpense(id)
          set((state) => ({
            expenses: state.expenses.filter((e) => e.id !== id),
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },
      addIncome: async (income) => {
        try {
          const newIncome = await addIncome(income)
          set((state) => ({ income: [...state.income, newIncome] }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },
      updateIncome: async (id, income) => {
        try {
          const updatedIncome = await updateIncome(id, income)
          set((state) => ({
            income: state.income.map((i) => (i.id === id ? updatedIncome : i)),
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },
      deleteIncome: async (id) => {
        try {
          await deleteIncome(id)
          set((state) => ({
            income: state.income.filter((i) => i.id !== id),
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },
      addLabel: async (label) => {
        try {
          const newLabel = await addLabel(label)
          set((state) => ({ labels: [...state.labels, newLabel] }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },
      updateLabel: async (id, label) => {
        try {
          const updatedLabel = await updateLabel(id, label)
          set((state) => ({
            labels: state.labels.map((l) => (l.id === id ? updatedLabel : l)),
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },
      deleteLabel: async (id) => {
        try {
          await deleteLabel(id)
          set((state) => ({
            labels: state.labels.filter((l) => l.id !== id),
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },
      setDateRange: (startDate: Date, endDate: Date) => {
        set({ startDate, endDate })
        get().fetchData()
      },
      calculateTotalExpenses: () => {
        const expenses = get().expenses
        return expenses.reduce((total, expense) => total + Number(expense.amount), 0)
      },
      calculateTotalIncome: () => {
        const income = get().income
        return income.reduce((total, income) => total + Number(income.amount), 0)
      },
    }),
    {
      name: "finance-store",
    },
  ),
)

