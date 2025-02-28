"use client"

import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { useFinanceStore } from "@/lib/store"

interface IncomeChartProps {
  startDate?: Date
  endDate?: Date
}

export function IncomeChart({ startDate, endDate }: IncomeChartProps) {
  const { income } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Filter income based on date range
  const filteredIncome = income.filter((item) => {
    const incomeDate = new Date(item.date)
    return (!startDate || incomeDate >= startDate) && (!endDate || incomeDate <= endDate)
  })

  // Group income by source and sum amounts
  const sourceData = filteredIncome.reduce(
    (acc, item) => {
      const source = item.source
      if (!acc[source]) {
        acc[source] = 0
      }
      acc[source] += item.amount
      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to array for chart
  const data = Object.entries(sourceData).map(([name, value]) => ({
    name,
    value,
  }))

  // Colors for different sources
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

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
          <p className="text-muted-foreground">No income data to display for the selected period</p>
        </div>
      )}
    </ResponsiveContainer>
  )
}

