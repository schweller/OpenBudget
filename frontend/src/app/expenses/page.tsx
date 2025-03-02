"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ExpenseChart } from "@/components/expense-chart"
import { ExpenseTable } from "@/components/expense-table"
import { useFinanceStore } from "@/lib/store"
import { Header } from "@/components/header"

export default function ExpensesPage() {
  const { calculateTotalExpenses, startDate, endDate, setDateRange, fetchData, isLoading, error } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [fetchData])

  if (!mounted) {
    return null
  }

  const showError = (message: string) => <div className="text-red-500 text-sm mt-2">{message}</div>

  const totalExpenses = calculateTotalExpenses()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(startDate, "LLL dd, y")} - {format(endDate, "LLL dd, y")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={startDate}
                  selected={{ from: startDate, to: endDate }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange(range.from, range.to)
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Link href="/expenses/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-red-500"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
              ) : error ? (
                showError("Failed to load expense data")
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">For the selected period</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>A detailed list of all your expenses</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : error ? (
                showError("Failed to load expense data")
              ) : (
                <ExpenseTable startDate={startDate} endDate={endDate} />
              )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Breakdown of your expenses by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  {showError("Failed to load expense category data")}
                </div>
              ) : (
                <ExpenseChart startDate={startDate} endDate={endDate} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

