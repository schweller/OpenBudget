import {
  Box,
  Heading,
  Separator,
  VStack,
  Stack,
  Highlight,
  Text
} from "@chakra-ui/react"
import Demo from "./table"
import { fetchExpenses, fetchIncomes } from "./actions"

export default async function Page() {
  const { data } = await fetchExpenses();
  const response = await fetchIncomes();
  console.log(response.data)

  return (
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
          <Demo expenses={data} incomes={response.data} />
        </VStack>
      </Box>
    </Box>
  )
}