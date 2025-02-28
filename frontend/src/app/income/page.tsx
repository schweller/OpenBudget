"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IncomeChart } from "@/components/income-chart"
import { useFinanceStore } from "@/lib/store"

export default function IncomePage() {
  const { income, calculateTotalIncome, startDate, endDate, setDateRange, fetchData, isLoading, error } =
    useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [fetchData])

  if (!mounted) {
    return null
  }

  const showError = (message: string) => <div className="text-red-500 text-sm mt-2">{message}</div>

  const totalIncome = calculateTotalIncome()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">OpenBudget</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/expenses">
                <Button variant="ghost">Expenses</Button>
              </Link>
              <Link href="/income">
                <Button variant="ghost">Income</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Income</h1>
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
            <Link href="/income/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Income
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-green-500"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
              ) : error ? (
                showError("Failed to load income data")
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">For the selected period</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Income Sources</CardTitle>
              <CardDescription>A detailed list of all your income sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  [...Array(3)].map((_, i) => <div key={i} className="animate-pulse h-12 bg-gray-200 rounded"></div>)
                ) : error ? (
                  showError("Failed to load income sources")
                ) : income.length > 0 ? (
                  income.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{item.source}</p>
                        <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-green-500">${item.amount.toFixed(2)}</div>
                        <Link href={`/income/edit/${item.id}`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No income sources added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Income Overview</CardTitle>
              <CardDescription>Breakdown of your income sources</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">{showError("Failed to load income data")}</div>
              ) : (
                <IncomeChart startDate={startDate} endDate={endDate} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

