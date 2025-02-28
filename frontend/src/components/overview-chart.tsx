"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { useFinanceStore } from "@/lib/store"

interface OverviewChartProps {
  startDate?: Date
  endDate?: Date
}

export function OverviewChart({ startDate, endDate }: OverviewChartProps) {
  const { expenses, income } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Filter expenses and income based on date range
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (!startDate || expenseDate >= startDate) && (!endDate || expenseDate <= endDate)
  })

  const filteredIncome = income.filter((item) => {
    const incomeDate = new Date(item.date)
    return (!startDate || incomeDate >= startDate) && (!endDate || incomeDate <= endDate)
  })

  // Group expenses and income by date (month)
  const monthlyData: Record<string, { expenses: number; income: number }> = {}

  // Process expenses
  filteredExpenses.forEach((expense) => {
    const date = new Date(expense.date)
    const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { expenses: 0, income: 0 }
    }

    monthlyData[monthYear].expenses += expense.amount
  })

  // Process income
  filteredIncome.forEach((item) => {
    const date = new Date(item.date)
    const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { expenses: 0, income: 0 }
    }

    monthlyData[monthYear].income += item.amount
  })

  // Convert to array for chart
  const data = Object.entries(monthlyData)
    .map(([month, values]) => ({
      month,
      expenses: values.expenses,
      income: values.income,
    }))
    .sort((a, b) => {
      // Sort by date (assuming format is "MMM YYYY")
      const [aMonth, aYear] = a.month.split(" ")
      const [bMonth, bYear] = b.month.split(" ")

      const aDate = new Date(`${aMonth} 1, ${aYear}`)
      const bDate = new Date(`${bMonth} 1, ${bYear}`)

      return aDate.getTime() - bDate.getTime()
    })

  return (
    <ResponsiveContainer width="100%" height="100%">
      {data.length > 0 ? (
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend />
          <Bar dataKey="income" name="Income" fill="hsl(var(--chart-1))" />
          <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-2))" />
        </BarChart>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No data to display for the selected period</p>
        </div>
      )}
    </ResponsiveContainer>
  )
}

