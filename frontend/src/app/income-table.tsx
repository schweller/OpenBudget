'use client'

import React, { useEffect } from 'react'
import { VStack, HStack } from "@chakra-ui/react"
import { addExpense, addIncome, fetchExpenses, updateExpense } from './actions'
import { emptyExpense, Expense } from './expense'
import { Income } from './income'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function DialogDemo() {
  const [expenseName, setName] = React.useState('')
  const [expenseAmount, setAmount] = React.useState(0)
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add new income</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Expense</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Expense name
            </Label>
            <Input id="name" className="col-span-3" onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Amount (EUR)
            </Label>
            <Input type="number" id="username" className="col-span-3" onChange={
              (e) => {
                var amount = parseFloat(e.target.value)
                setAmount(amount)
              } 
            }/>
          </div>
        </div>
        <DialogFooter>
            <Button type='submit' onClick={async () => {
            await addIncome(expenseName, expenseAmount)
            setOpen(false)
          }}>Create a new expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function IncomeDialog({ expense, open, setOpen }: { expense: Expense, open: boolean, setOpen: (open: boolean) => void }) {
  const [expenseName, setName] = React.useState('')
  const [expenseAmount, setAmount] = React.useState(0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit a single expense</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Expense name
            </Label>
            <Input id="name" className="col-span-3" onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Amount (EUR)
            </Label>
            <Input type="number" id="username" className="col-span-3" onChange={
              (e) => {
                var amount = parseFloat(e.target.value)
                setAmount(amount)
              } 
            }/>
          </div>
        </div>
        <DialogFooter>
            <Button type='submit' onClick={async () => {
            await updateExpense(expense, expenseName, expenseAmount)
            setOpen(false)
          }}>Create a new expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ExpenseRow({ expense, callback }: { expense: Expense, callback: (e: Expense) => void }) {

  return (
    <TableRow onClick={(e) => callback(expense)}>
      <TableCell>{expense.Description}</TableCell>
      <TableCell></TableCell>
      <TableCell>{expense.Amount}</TableCell>
      <TableCell>{`${new Date(expense.Date).getDate()}\/${new Date(expense.Date).getMonth() + 1}\/${new Date(expense.Date).getFullYear()}`}</TableCell>
    </TableRow>
  )
}

export default function Demo({ incomes }: { incomes: Income[] }) {
  const [currentExpenses, setExpenses] = React.useState(incomes)
  const [selectedExpense, setSelectedExpense] = React.useState<Expense>(emptyExpense)
  const [open, setOpen] = React.useState(false)

  const onExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense)
    setOpen(true)
  }

  return (
    <VStack>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Income Name</TableHead>
            <TableHead>Labels</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomes.map((item) => 
            <TableRow key={item.ID}>
              <TableCell>{item.Description}</TableCell>
              <TableCell></TableCell>
              <TableCell>{item.Amount}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>      
      <IncomeDialog expense={selectedExpense} open={open} setOpen={setOpen} />
      <HStack>
        <DialogDemo />
        <Button type='submit' onClick={async () => {
            const { data } = await fetchExpenses()
            setExpenses(data)
        }}>Reload Expenses</Button>      
      </HStack>
    </VStack>
  )
}
