'use client'
import React, { useEffect } from 'react'
import { Button, Table, VStack, Input, HStack } from "@chakra-ui/react"
import { addExpense, fetchExpenses } from './actions'
import { Expense } from './expense'

export default function Demo({ expenses }: { expenses: Expense[] }) {
  const [expenseName, setName] = React.useState('')
  const [expenseAmount, setAmount] = React.useState(0)

  return (
    <VStack>
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Expense</Table.ColumnHeader>
            <Table.ColumnHeader>Labels</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Amount</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {expenses.map((item) => (
            <Table.Row key={item.ID}>
              <Table.Cell>{item.Description}</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell textAlign="end">{item.Amount}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <HStack>
        <Input placeholder="Enter a new expense" onChange={(e) => setName(e.target.value)}  />
        <Input placeholder="Enter the amount" type='number' onChange={
          (e) => {
            var amount = parseFloat(e.target.value)
            setAmount(amount)
          } 
        } />
      </HStack>
      <Button onClick={async () => {
        await addExpense(expenseName, expenseAmount)
      }}>Create a new expense</Button>
    </VStack>
  )
}
