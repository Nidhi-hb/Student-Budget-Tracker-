"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart } from "lucide-react"

interface BudgetOverviewProps {
  categories: {
    [key: string]: {
      budget: number
      spent: number
      color: string
    }
  }
}

export function BudgetOverview({ categories }: BudgetOverviewProps) {
  return (
    <Card className="bg-gradient-to-br from-emerald-500/50 to-teal-500/50 backdrop-blur-sm border-0 shadow-lg text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
          <PieChart className="w-5 h-5 text-white" />
          Budget by Category
        </CardTitle>
        <CardDescription className="text-white/80">See how you're spending across different categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(categories).map(([category, data]) => {
          const progress = (data.spent / data.budget) * 100
          const remaining = data.budget - data.spent

          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">{category}</span>
                <span className="text-sm text-white/80">
                  ₹{data.spent.toLocaleString("en-IN")} / ₹{data.budget.toLocaleString("en-IN")}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-white/70">
                <span>{progress.toFixed(1)}% used</span>
                <span className={remaining < 0 ? "text-red-200" : "text-green-200"}>
                  ₹{remaining.toLocaleString("en-IN")} remaining
                </span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
