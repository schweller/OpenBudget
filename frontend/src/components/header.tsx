import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
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
            <Link href="/labels">
              <Button variant="ghost">Labels</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

