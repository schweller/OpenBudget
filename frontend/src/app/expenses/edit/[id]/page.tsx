"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect, Option } from "@/components/ui/multi-select"
import { useFinanceStore } from "@/lib/store"
import { Header } from "@/components/header"
import { Expense } from "@/lib/api"

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  labels: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .min(1, {
      message: "Please select at least one label.",
    }),
  date: z.coerce.date({
    required_error: "Please select a date.",
    invalid_type_error: "That's not a valid date!",
  }),
})

export default function EditExpensePage() {
  const router = useRouter()
  const params = useParams()
  const { expenses, updateExpense, deleteExpense, labels, transformLabels } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const expense = expenses.find((e) => e.id === params.id)

  const transformExpenseLabels = (expense: Expense) => {
    var mappedLabels = [] as Option[]
    if (expense.labels.length > 0) {
      expense.labels.map((id) => mappedLabels.push(labels.find((b) => b.id === id)!))
    }
    return mappedLabels
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // fix this type issue later, make it consistent
    defaultValues: expense
      ? {
          description: expense.description,
          amount: expense.amount,
          labels: transformLabels(expense.labels),
          date: new Date(expense.date),
        }
      : {
          description: "",
          amount: 0, // Change from undefined to 0
          labels: [],
          date: new Date(),
        },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (expense) {
      updateExpense(expense.id, {
        ...expense,
        description: values.description,
        amount: values.amount,
        labels: values.labels,
        date: values.date.toISOString(),
      })
    }
    router.push("/expenses")
  }

  function onDelete() {
    if (expense) {
      deleteExpense(expense.id)
    }
    router.push("/expenses")
  }

  if (!mounted) {
    return null
  }

  if (!expense) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Expense not found</h1>
        <Link href="/expenses">
          <Button className="mt-4">Back to Expenses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Edit Expense</CardTitle>
              <CardDescription>Update the details of your expense</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Groceries, Rent, etc." {...field} />
                        </FormControl>
                        <FormDescription>A brief description of the expense</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value === "" ? 0 : Number.parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>The amount spent</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="labels"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Labels</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={labels}
                            selected={field.value}
                            onChange={(selected) => field.onChange(selected)}
                            placeholder="Select labels"
                          />
                        </FormControl>
                        <FormDescription>Select one or more labels for the expense</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : ""}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>The date of the expense</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button type="button" variant="destructive" onClick={onDelete}>
                      Delete
                    </Button>
                    <div className="flex space-x-2">
                      <Link href="/expenses">
                        <Button variant="outline" type="button">
                          Cancel
                        </Button>
                      </Link>
                      <Button type="submit">Update</Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

