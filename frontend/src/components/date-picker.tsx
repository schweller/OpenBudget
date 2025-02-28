"use client"

import { Calendar } from "@/components/ui/calendar"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { useExpenses } from "@/app/expense"

export function DatePicker() {
  const { expenses, getExpenses } = useExpenses()

  const foo = async (e) => {
    console.log(e)
    const exp = await getExpenses()
    console.log(exp.data)
  }

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar 
          className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]" 
          onMonthChange={foo}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
