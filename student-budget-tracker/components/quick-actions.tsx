"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calculator, Target, TrendingUp, Download, Settings } from "lucide-react"
import { BudgetManagementModal } from "@/components/budget-management-modal"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { GoalManagementModal } from "@/components/goal-management-modal"
import { AnalyticsModal } from "@/components/analytics-modal"

interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
  description?: string
  category: "savings" | "purchase" | "emergency" | "education" | "travel" | "other"
}

interface QuickActionsProps {
  categories?: any
  totalBudget?: number
  onUpdateBudget?: (categories: any, totalBudget: number) => void
  onAddExpense?: (expense: {
    description: string
    amount: number
    category: string
    date: string
    notes?: string
  }) => void
  goals?: Goal[]
  onUpdateGoals?: (goals: Goal[]) => void
  budgetData?: any
}

export function QuickActions({
  categories,
  totalBudget,
  onUpdateBudget,
  onAddExpense,
  goals,
  onUpdateGoals,
  budgetData,
}: QuickActionsProps) {
  const handleExportData = () => {
    if (!budgetData) return

    const dataToExport = {
      exportDate: new Date().toISOString(),
      budgetData,
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `budget-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-gradient-to-br from-rose-500/50 to-pink-500/50 backdrop-blur-sm border-0 shadow-lg text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
        <CardDescription className="text-white/80">Common tasks to manage your budget</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {categories && onAddExpense ? (
          <AddExpenseModal
            categories={Object.keys(categories)}
            onAddExpense={onAddExpense}
            trigger={
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <PlusCircle className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">Add Expense</span>
              </Button>
            }
          />
        ) : (
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <PlusCircle className="w-5 h-5 text-white" />
            <span className="text-sm font-medium">Add Expense</span>
          </Button>
        )}

        {categories && totalBudget !== undefined && onUpdateBudget ? (
          <BudgetManagementModal
            categories={categories}
            totalBudget={totalBudget}
            onUpdateBudget={onUpdateBudget}
            trigger={
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Calculator className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">Set Budget</span>
              </Button>
            }
          />
        ) : (
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <Calculator className="w-5 h-5 text-white" />
            <span className="text-sm font-medium">Set Budget</span>
          </Button>
        )}

        {goals && onUpdateGoals ? (
          <GoalManagementModal
            goals={goals}
            onUpdateGoals={onUpdateGoals}
            trigger={
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Target className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">Create Goal</span>
              </Button>
            }
          />
        ) : (
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <Target className="w-5 h-5 text-white" />
            <span className="text-sm font-medium">Create Goal</span>
          </Button>
        )}

        {budgetData ? (
          <AnalyticsModal
            budgetData={budgetData}
            trigger={
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <TrendingUp className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">View Reports</span>
              </Button>
            }
          />
        ) : (
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <TrendingUp className="w-5 h-5 text-white" />
            <span className="text-sm font-medium">View Reports</span>
          </Button>
        )}

        <Button
          variant="outline"
          className="h-auto p-4 flex flex-col items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
          onClick={handleExportData}
        >
          <Download className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">Export Data</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto p-4 flex flex-col items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
        >
          <Settings className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">Settings</span>
        </Button>
      </CardContent>
    </Card>
  )
}
