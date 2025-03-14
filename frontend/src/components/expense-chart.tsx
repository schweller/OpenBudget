"use client"

import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { useFinanceStore } from "@/lib/store"

interface ExpenseChartProps {
  startDate?: Date
  endDate?: Date
}

export function ExpenseChart({ startDate, endDate }: ExpenseChartProps) {
  const { expenses, labels } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Filter expenses based on date range
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (!startDate || expenseDate >= startDate) && (!endDate || expenseDate <= endDate)
  })

  const labelMap = labels.reduce((acc, label) => {
    acc[label.id] = label.name
    return acc
  }, {} as Record<string, string>)

  // Group expenses by label and sum amounts
  const labelData = expenses.reduce(
    (acc, expense) => {
      expense.labels.forEach((label) => {
        const labelName = labelMap[label]
        if (!acc[labelName]) {
          acc[labelName] = 0
        }
        console.log(typeof expense.amount)
        // fix this type issue later, make it consistent
        acc[labelName] += parseInt(expense.amount)
      })
      return acc
    },
    {} as Record<string, number>,
  )

  console.log(labelData)

  // Convert to array for chart
  const data = Object.entries(labelData).map(([name, value]) => ({
    name,
    value,
  }))

  // Colors for different categories
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      {data.length > 0 ? (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]} />
          <Legend />
        </PieChart>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No expense data to display for the selected period</p>
        </div>
      )}
    </ResponsiveContainer>
  )
}

