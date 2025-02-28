import {
  Box,
  Heading,
  Separator,
  VStack,
  Stack,
  Highlight,
  Text
} from "@chakra-ui/react"
import {
  SidebarProvider,
  SidebarInset
} from '@/components/ui/sidebar'
import ExpenseTable from "./expense-table"
import IncomeTable from "./income-table"
import { fetchExpenses, fetchIncomes } from "./actions"
import { SidebarLeft } from "@/components/sidebar-left";
import { ExpenseProvider } from "./expense"

export default async function Page() {
  const { data } = await fetchExpenses();
  const response = await fetchIncomes();

  return (
    <ExpenseProvider expenses={data}>
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>
          <Box p={4}>
            <Stack>
              <Heading size="4xl" letterSpacing="tight">
                <Highlight query="your data, your planning" styles={{ color: "teal.600" }}>
                  Expenzen your data, your planning
                </Highlight>
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                You're visualizing current month's budget and expenses 
              </Text>
            </Stack>
            <Separator />
            <Box fontSize="xl" pt="10vh">
              <VStack gap="8" alignItems={"flex-start"}>
                <ExpenseTable expenses={data} />
                <IncomeTable incomes={response.data} />
              </VStack>
            </Box>
          </Box>     
        </SidebarInset>
      </SidebarProvider>
    </ExpenseProvider>
  )
}