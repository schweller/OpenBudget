import React from 'react'
import { Table } from "@chakra-ui/react"
import { useQueryClient, useQuery } from "@tanstack/react-query"

const fetchExpenses = async (limit = 10) => {
  const response = await fetch('http://localhost:12323/expenses')
  const data = await response.json()
  return data
}

const usePosts = (limit: number) => {
  return useQuery({
    queryKey: ['posts', limit],
    queryFn: () => fetchExpenses(limit),
  })
}

export default async function Demo() {
  // const { data, isPending, isFetching } = usePosts(10)

  // if (isPending) return 'Loading...'

  const data = await fetchExpenses()

  console.log(data)

  // console.log(JSON.parse(JSON.stringify(data)))

  return (
    <Table.Root size="sm">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Expense</Table.ColumnHeader>
          <Table.ColumnHeader>Labels</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Amount</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.name}</Table.Cell>
            <Table.Cell>{item.category}</Table.Cell>
            <Table.Cell textAlign="end">{item.price}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}

const items = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
  { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
  { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
  { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
  { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
]