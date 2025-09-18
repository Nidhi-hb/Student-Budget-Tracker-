"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface ExpenseChartProps {
  expenses: Array<{
    id: string
    description: string
    amount: number
    category: string
    date: string
  }>
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Group expenses by category for visualization
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const maxAmount = Math.max(...Object.values(categoryTotals))

  return (
    <Card className="bg-gradient-to-br from-violet-500/50 to-purple-500/50 backdrop-blur-sm border-0 shadow-lg text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
          <BarChart3 className="w-5 h-5 text-white" />
          Spending Overview
        </CardTitle>
        <CardDescription className="text-white/80">Visual breakdown of your recent spending</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(categoryTotals).map(([category, amount]) => {
          const percentage = (amount / maxAmount) * 100

          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">{category}</span>
                <span className="text-sm font-semibold text-white">₹{amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-400/80 to-orange-400/80 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
