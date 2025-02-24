export type Income = {
  ID: number
  Description: string
  Amount: number
  Date: string
}

export const emptyIncome: Income = {
  ID: 0,
  Description: '',
  Amount: 0,
  Date: ''
}
