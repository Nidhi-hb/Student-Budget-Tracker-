"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, TrendingUp, TrendingDown, Target, Wallet, Calendar } from "lucide-react"
import { BudgetOverview } from "@/components/budget-overview"
import { ExpenseChart } from "@/components/expense-chart"
import { QuickActions } from "@/components/quick-actions"
import { BudgetManagementModal } from "@/components/budget-management-modal"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { GoalManagementModal } from "@/components/goal-management-modal"

interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
  description?: string
  category: "savings" | "purchase" | "emergency" | "education" | "travel" | "other"
}

interface BudgetData {
  totalBudget: number
  totalSpent: number
  categories: {
    [key: string]: {
      budget: number
      spent: number
      color: string
    }
  }
  recentExpenses: Array<{
    id: string
    description: string
    amount: number
    category: string
    date: string
    notes?: string
  }>
  goals: Goal[]
}

export default function Dashboard() {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    totalBudget: 99600, // ₹99,600 (was $1200)
    totalSpent: 56440, // ₹56,440 (was $680)
    categories: {
      "Food & Dining": { budget: 33200, spent: 23240, color: "bg-blue-500" }, // ₹33,200 & ₹23,240
      Transportation: { budget: 16600, spent: 12450, color: "bg-green-500" }, // ₹16,600 & ₹12,450
      Entertainment: { budget: 12450, spent: 9960, color: "bg-purple-500" }, // ₹12,450 & ₹9,960
      "Books & Supplies": { budget: 20750, spent: 6640, color: "bg-orange-500" }, // ₹20,750 & ₹6,640
      "Personal Care": { budget: 8300, spent: 4150, color: "bg-pink-500" }, // ₹8,300 & ₹4,150
      Other: { budget: 8300, spent: 0, color: "bg-gray-500" }, // ₹8,300
    },
    recentExpenses: [
      { id: "1", description: "Lunch at cafeteria", amount: 1037.5, category: "Food & Dining", date: "2024-01-15" }, // ₹1,037.5
      { id: "2", description: "Bus pass", amount: 3735, category: "Transportation", date: "2024-01-14" }, // ₹3,735
      { id: "3", description: "Movie ticket", amount: 1245, category: "Entertainment", date: "2024-01-13" }, // ₹1,245
      { id: "4", description: "Textbook", amount: 5395, category: "Books & Supplies", date: "2024-01-12" }, // ₹5,395
    ],
    goals: [
      {
        id: "1",
        name: "Emergency Fund",
        target: 41500, // ₹41,500 (was $500)
        current: 12450, // ₹12,450 (was $150)
        deadline: "2024-06-01",
        category: "emergency",
        description: "Build a safety net for unexpected expenses",
      },
      {
        id: "2",
        name: "Spring Break Trip",
        target: 66400, // ₹66,400 (was $800)
        current: 16600, // ₹16,600 (was $200)
        deadline: "2024-03-15",
        category: "travel",
        description: "Save for spring break vacation",
      },
    ],
  })

  useEffect(() => {
    const savedData = localStorage.getItem("studentBudgetData")
    if (savedData) {
      setBudgetData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("studentBudgetData", JSON.stringify(budgetData))
  }, [budgetData])

  const handleUpdateBudget = (categories: any, totalBudget: number) => {
    setBudgetData((prev) => ({
      ...prev,
      totalBudget,
      categories,
    }))
  }

  const handleAddExpense = (expense: {
    description: string
    amount: number
    category: string
    date: string
    notes?: string
  }) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
    }

    setBudgetData((prev) => {
      const updatedCategories = { ...prev.categories }

      // Update category spending
      if (updatedCategories[expense.category]) {
        updatedCategories[expense.category] = {
          ...updatedCategories[expense.category],
          spent: updatedCategories[expense.category].spent + expense.amount,
        }
      }

      return {
        ...prev,
        totalSpent: prev.totalSpent + expense.amount,
        categories: updatedCategories,
        recentExpenses: [newExpense, ...prev.recentExpenses].slice(0, 10), // Keep only last 10 expenses
      }
    })
  }

  const handleUpdateGoals = (goals: Goal[]) => {
    setBudgetData((prev) => ({
      ...prev,
      goals,
    }))
  }

  const remainingBudget = budgetData.totalBudget - budgetData.totalSpent
  const budgetProgress = (budgetData.totalSpent / budgetData.totalBudget) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400/50 via-pink-300/50 to-orange-400/50 dark:from-purple-900/50 dark:via-blue-900/50 dark:to-indigo-900/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Budget Tracker</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Take control of your finances and achieve your goals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AddExpenseModal categories={Object.keys(budgetData.categories)} onAddExpense={handleAddExpense} />
            <BudgetManagementModal
              categories={budgetData.categories}
              totalBudget={budgetData.totalBudget}
              onUpdateBudget={handleUpdateBudget}
            />
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-blue-500/50 to-cyan-500/50 text-white border-white/30"
            >
              <Calendar className="w-4 h-4 mr-1" />
              January 2024
            </Badge>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/50 to-cyan-500/50 backdrop-blur-sm border-0 shadow-lg text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Budget</CardTitle>
              <Wallet className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{budgetData.totalBudget.toLocaleString("en-IN")}</div>
              <p className="text-xs text-white/80 mt-1">Monthly allocation</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/50 to-pink-500/50 backdrop-blur-sm border-0 shadow-lg text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{budgetData.totalSpent.toLocaleString("en-IN")}</div>
              <p className="text-xs text-white/80 mt-1">{budgetProgress.toFixed(1)}% of budget used</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/50 to-emerald-500/50 backdrop-blur-sm border-0 shadow-lg text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Remaining</CardTitle>
              <TrendingDown className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{remainingBudget.toLocaleString("en-IN")}</div>
              <p className="text-xs text-white/80 mt-1">Available to spend</p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card className="bg-gradient-to-r from-indigo-500/50 to-purple-500/50 backdrop-blur-sm border-0 shadow-lg text-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Monthly Budget Progress</CardTitle>
            <CardDescription className="text-white/80">Track your spending against your monthly budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/90">Progress</span>
                <span className="font-medium text-white">{budgetProgress.toFixed(1)}%</span>
              </div>
              <Progress
                value={budgetProgress}
                className="h-3"
                style={{
                  background:
                    budgetProgress > 80
                      ? "linear-gradient(to right, #ef4444, #dc2626)"
                      : budgetProgress > 60
                        ? "linear-gradient(to right, #f59e0b, #d97706)"
                        : "linear-gradient(to right, #10b981, #059669)",
                }}
              />
              <div className="flex justify-between text-xs text-white/70">
                <span>₹0</span>
                <span>₹{budgetData.totalBudget.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Overview by Category */}
          <BudgetOverview categories={budgetData.categories} />

          {/* Expense Chart */}
          <ExpenseChart expenses={budgetData.recentExpenses} />
        </div>

        {/* Goals and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Goals */}
          <Card className="bg-gradient-to-br from-teal-500/50 to-cyan-500/50 backdrop-blur-sm border-0 shadow-lg text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Target className="w-5 h-5 text-white" />
                  Financial Goals
                </CardTitle>
                <GoalManagementModal
                  goals={budgetData.goals}
                  onUpdateGoals={handleUpdateGoals}
                  trigger={
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      Manage
                    </Button>
                  }
                />
              </div>
              <CardDescription className="text-white/80">Track progress toward your savings goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetData.goals.length === 0 ? (
                <div className="text-center py-4">
                  <Target className="w-8 h-8 text-white/60 mx-auto mb-2" />
                  <p className="text-sm text-white/80 mb-3">No goals set yet</p>
                  <GoalManagementModal
                    goals={budgetData.goals}
                    onUpdateGoals={handleUpdateGoals}
                    trigger={
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create First Goal
                      </Button>
                    }
                  />
                </div>
              ) : (
                <>
                  {budgetData.goals.slice(0, 2).map((goal) => {
                    const progress = (goal.current / goal.target) * 100
                    return (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">{goal.name}</span>
                          <span className="text-sm text-white/80">
                            ₹{goal.current.toLocaleString("en-IN")} / ₹{goal.target.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-white/70">
                          <span>{progress.toFixed(1)}% complete</span>
                          <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )
                  })}
                  {budgetData.goals.length > 2 && (
                    <p className="text-xs text-white/70 text-center pt-2">+{budgetData.goals.length - 2} more goals</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <QuickActions
            categories={budgetData.categories}
            totalBudget={budgetData.totalBudget}
            onUpdateBudget={handleUpdateBudget}
            onAddExpense={handleAddExpense}
            goals={budgetData.goals}
            onUpdateGoals={handleUpdateGoals}
            budgetData={budgetData}
          />
        </div>

        {/* Recent Expenses */}
        <Card className="bg-gradient-to-r from-orange-500/50 to-red-500/50 backdrop-blur-sm border-0 shadow-lg text-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Recent Expenses</CardTitle>
            <CardDescription className="text-white/80">Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetData.recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-white/20 backdrop-blur-sm rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{expense.description}</p>
                    <p className="text-sm text-white/80">{expense.category}</p>
                    {expense.notes && <p className="text-xs text-white/70 mt-1">{expense.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">₹{expense.amount.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-white/70">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              View All Expenses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
