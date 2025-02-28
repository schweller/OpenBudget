"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinanceStore } from "@/lib/store"

interface ExpenseTableProps {
  limit?: number
  startDate?: Date
  endDate?: Date
}

export function ExpenseTable({ limit, startDate, endDate }: ExpenseTableProps) {
  const { expenses } = useFinanceStore()
  const [mounted, setMounted] = useState(false)
  const [sortField, setSortField] = useState<"date" | "amount" | "category">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSort = (field: "date" | "amount" | "category") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (!startDate || expenseDate >= startDate) && (!endDate || expenseDate <= endDate)
  })

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortField === "amount") {
      return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
    } else {
      return sortDirection === "asc" ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category)
    }
  })

  const displayExpenses = limit ? sortedExpenses.slice(0, limit) : sortedExpenses

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
              Category {sortField === "category" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
              Amount {sortField === "amount" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
              Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayExpenses.length > 0 ? (
            displayExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell className="text-red-500">${expense.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/expenses/edit/${expense.id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No expenses found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

