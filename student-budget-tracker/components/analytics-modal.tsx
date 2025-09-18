"use client"

import type React from "react"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, DollarSign, Target, AlertTriangle, CheckCircle, PieChart } from "lucide-react"

interface AnalyticsModalProps {
  budgetData: {
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
    goals: Array<{
      id: string
      name: string
      target: number
      current: number
      deadline: string
    }>
  }
  trigger?: React.ReactNode
}

export function AnalyticsModal({ budgetData, trigger }: AnalyticsModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const analytics = useMemo(() => {
    const { categories, recentExpenses, goals, totalBudget, totalSpent } = budgetData

    // Category analysis
    const categoryAnalysis = Object.entries(categories).map(([name, data]) => ({
      name,
      budget: data.budget,
      spent: data.spent,
      remaining: data.budget - data.spent,
      percentage: data.budget > 0 ? (data.spent / data.budget) * 100 : 0,
      status: data.spent > data.budget ? "over" : data.spent > data.budget * 0.8 ? "warning" : "good",
    }))

    // Spending trends (last 30 days)
    const last30Days = recentExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return expenseDate >= thirtyDaysAgo
    })

    const dailySpending = last30Days.reduce(
      (acc, expense) => {
        const date = expense.date
        acc[date] = (acc[date] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const avgDailySpending = Object.values(dailySpending).reduce((sum, amount) => sum + amount, 0) / 30

    // Top spending categories
    const categorySpending = Object.entries(categories)
      .map(([name, data]) => ({ name, amount: data.spent }))
      .sort((a, b) => b.amount - a.amount)

    // Goal progress analysis
    const goalAnalysis = goals.map((goal) => ({
      ...goal,
      progress: (goal.current / goal.target) * 100,
      daysLeft: Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      monthlyTarget:
        goal.target /
        Math.max(1, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))),
    }))

    // Financial health score (0-100)
    let healthScore = 100
    const budgetUtilization = (totalSpent / totalBudget) * 100
    if (budgetUtilization > 90) healthScore -= 30
    else if (budgetUtilization > 80) healthScore -= 15
    else if (budgetUtilization > 70) healthScore -= 5

    const overBudgetCategories = categoryAnalysis.filter((cat) => cat.status === "over").length
    healthScore -= overBudgetCategories * 10

    const activeGoals = goals.filter((goal) => goal.current < goal.target).length
    if (activeGoals === 0) healthScore -= 10

    healthScore = Math.max(0, Math.min(100, healthScore))

    // Insights and recommendations
    const insights = []
    if (budgetUtilization > 85) {
      insights.push({
        type: "warning",
        title: "High Budget Utilization",
        message: `You've used ${budgetUtilization.toFixed(1)}% of your monthly budget. Consider reducing spending in high-cost categories.`,
      })
    }

    const topSpendingCategory = categorySpending[0]
    if (topSpendingCategory && topSpendingCategory.amount > totalBudget * 0.4) {
      insights.push({
        type: "info",
        title: "Category Concentration",
        message: `${topSpendingCategory.name} accounts for ${((topSpendingCategory.amount / totalSpent) * 100).toFixed(1)}% of your spending. Consider if this aligns with your priorities.`,
      })
    }

    if (avgDailySpending > totalBudget / 30) {
      insights.push({
        type: "warning",
        title: "Daily Spending Alert",
        message: `Your average daily spending ($${avgDailySpending.toFixed(2)}) exceeds your daily budget target ($${(totalBudget / 30).toFixed(2)}).`,
      })
    }

    const achievableGoals = goalAnalysis.filter((goal) => goal.daysLeft > 0 && goal.monthlyTarget <= totalBudget * 0.2)
    if (achievableGoals.length > 0) {
      insights.push({
        type: "success",
        title: "Achievable Goals",
        message: `You have ${achievableGoals.length} goal(s) that are well within reach with consistent saving.`,
      })
    }

    return {
      categoryAnalysis,
      dailySpending,
      avgDailySpending,
      categorySpending,
      goalAnalysis,
      healthScore,
      insights,
      budgetUtilization,
    }
  }, [budgetData])

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="bg-transparent">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            Financial Analytics & Insights
          </DialogTitle>
          <DialogDescription>Understand your spending patterns and improve your financial health</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Financial Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Financial Health Score
                </CardTitle>
                <CardDescription>Overall assessment of your financial habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`text-4xl font-bold ${getHealthScoreColor(analytics.healthScore)}`}>
                      {analytics.healthScore}
                    </div>
                    <div className="text-sm text-gray-600">{getHealthScoreLabel(analytics.healthScore)}</div>
                  </div>
                  <div className="w-32 h-32">
                    <div className="relative w-full h-full">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${analytics.healthScore * 2.51} 251`}
                          className={getHealthScoreColor(analytics.healthScore)}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">{analytics.budgetUtilization.toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">Budget Used</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">${analytics.avgDailySpending.toFixed(2)}</div>
                    <div className="text-xs text-gray-600">Avg Daily Spending</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{budgetData.goals.length}</div>
                    <div className="text-xs text-gray-600">Active Goals</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Top Category</p>
                      <p className="text-lg font-semibold">{analytics.categorySpending[0]?.name || "N/A"}</p>
                    </div>
                    <PieChart className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Remaining Budget</p>
                      <p className="text-lg font-semibold">${budgetData.totalBudget - budgetData.totalSpent}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Goals Progress</p>
                      <p className="text-lg font-semibold">
                        {analytics.goalAnalysis.filter((g) => g.progress >= 50).length}/{analytics.goalAnalysis.length}
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>How you're performing against your budget in each category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.categoryAnalysis.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.name}</span>
                        <Badge
                          variant={category.status === "good" ? "default" : "destructive"}
                          className={
                            category.status === "good"
                              ? "bg-green-100 text-green-800"
                              : category.status === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {category.status === "good"
                            ? "On Track"
                            : category.status === "warning"
                              ? "Warning"
                              : "Over Budget"}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600">
                        ${category.spent} / ${category.budget}
                      </span>
                    </div>
                    <Progress value={Math.min(category.percentage, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{category.percentage.toFixed(1)}% used</span>
                      <span className={category.remaining < 0 ? "text-red-600" : "text-green-600"}>
                        ${Math.abs(category.remaining)} {category.remaining < 0 ? "over" : "remaining"}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Goal Analysis</CardTitle>
                <CardDescription>Track your progress and get recommendations for achieving your goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.goalAnalysis.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No goals set yet. Create your first goal to see analytics!</p>
                  </div>
                ) : (
                  analytics.goalAnalysis.map((goal) => (
                    <Card key={goal.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{goal.name}</h4>
                              <p className="text-sm text-gray-600">
                                ${goal.current} / ${goal.target} ({goal.progress.toFixed(1)}% complete)
                              </p>
                            </div>
                            <Badge
                              variant={goal.daysLeft > 30 ? "default" : goal.daysLeft > 0 ? "secondary" : "destructive"}
                            >
                              {goal.daysLeft > 0 ? `${goal.daysLeft} days left` : "Overdue"}
                            </Badge>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Monthly target: </span>
                              <span className="font-medium">${goal.monthlyTarget.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Remaining: </span>
                              <span className="font-medium">${(goal.target - goal.current).toFixed(2)}</span>
                            </div>
                          </div>
                          {goal.monthlyTarget > budgetData.totalBudget * 0.3 && (
                            <div className="flex items-center gap-2 text-yellow-600 text-sm">
                              <AlertTriangle className="w-4 h-4" />
                              This goal may be challenging with your current budget
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Insights</CardTitle>
                <CardDescription>AI-powered recommendations to improve your financial health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.insights.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Great Job!</h3>
                    <p className="text-gray-600">Your spending habits look healthy. Keep up the good work!</p>
                  </div>
                ) : (
                  analytics.insights.map((insight, index) => (
                    <Card
                      key={index}
                      className={`border-l-4 ${
                        insight.type === "success"
                          ? "border-l-green-500 bg-green-50"
                          : insight.type === "warning"
                            ? "border-l-yellow-500 bg-yellow-50"
                            : "border-l-blue-500 bg-blue-50"
                      }`}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {insight.type === "success" ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : insight.type === "warning" ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                            <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
