"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFinanceStore } from "@/lib/store"
import { Header } from "@/components/header"

const formSchema = z.object({
  source: z.string().min(2, {
    message: "Source must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  date: z.date({
    message: "Please select a date.",
  }),
})

export default function EditIncomePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { income, updateIncome, deleteIncome } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const incomeItem = income.find((i) => i.id === params.id)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: incomeItem
      ? {
          amount: incomeItem.amount,
          date: new Date(incomeItem.date),
        }
      : {
          amount: 0,
          date: new Date(),
        },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (incomeItem) {
      updateIncome(incomeItem.id, {
        ...incomeItem,
        amount: values.amount,
        date: values.date.toISOString(),
      })
    }
    router.push("/income")
  }

  function onDelete() {
    if (incomeItem) {
      deleteIncome(incomeItem.id)
    }
    router.push("/income")
  }

  if (!mounted) {
    return null
  }

  if (!incomeItem) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Income not found</h1>
        <Link href="/income">
          <Button className="mt-4">Back to Income</Button>
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
              <CardTitle>Edit Income</CardTitle>
              <CardDescription>Update the details of your income source</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <FormControl>
                          <Input placeholder="Salary, Freelance, etc." {...field} />
                        </FormControl>
                        <FormDescription>The source of your income</FormDescription>
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
                        <FormDescription>The amount received</FormDescription>
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
                          <Input type="date" {...field} value={field.value.toISOString().split("T")[0]} />
                        </FormControl>
                        <FormDescription>The date the income was received</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button type="button" variant="destructive" onClick={onDelete}>
                      Delete
                    </Button>
                    <div className="flex space-x-2">
                      <Link href="/income">
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

