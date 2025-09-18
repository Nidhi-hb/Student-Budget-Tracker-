"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Plus, Minus, Save } from "lucide-react"

interface BudgetManagementModalProps {
  categories: {
    [key: string]: {
      budget: number
      spent: number
      color: string
    }
  }
  totalBudget: number
  onUpdateBudget: (categories: any, totalBudget: number) => void
  trigger?: React.ReactNode
}

const defaultCategories = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Books & Supplies",
  "Personal Care",
  "Housing",
  "Healthcare",
  "Other",
]

export function BudgetManagementModal({
  categories,
  totalBudget,
  onUpdateBudget,
  trigger,
}: BudgetManagementModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [budgetData, setBudgetData] = useState(() => {
    const data: any = {}
    defaultCategories.forEach((category) => {
      data[category] = {
        budget: categories[category]?.budget || 0,
        spent: categories[category]?.spent || 0,
        color: categories[category]?.color || "bg-gray-500",
      }
    })
    return data
  })
  const [monthlyIncome, setMonthlyIncome] = useState(totalBudget.toString())

  const handleCategoryBudgetChange = (category: string, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    setBudgetData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        budget: numValue,
      },
    }))
  }

  const calculateTotalBudget = () => {
    return Object.values(budgetData).reduce((sum: number, cat: any) => sum + cat.budget, 0)
  }

  const handleSave = () => {
    const newTotalBudget = Number.parseFloat(monthlyIncome) || 0
    onUpdateBudget(budgetData, newTotalBudget)
    setIsOpen(false)
  }

  const suggestBudgetAllocation = () => {
    const income = Number.parseFloat(monthlyIncome) || 0
    const suggestions = {
      "Food & Dining": Math.round(income * 0.25),
      Transportation: Math.round(income * 0.15),
      Entertainment: Math.round(income * 0.1),
      "Books & Supplies": Math.round(income * 0.2),
      "Personal Care": Math.round(income * 0.08),
      Housing: Math.round(income * 0.15),
      Healthcare: Math.round(income * 0.05),
      Other: Math.round(income * 0.02),
    }

    setBudgetData((prev) => {
      const newData = { ...prev }
      Object.entries(suggestions).forEach(([category, amount]) => {
        if (newData[category]) {
          newData[category] = {
            ...newData[category],
            budget: amount,
          }
        }
      })
      return newData
    })
  }

  const totalAllocated = calculateTotalBudget()
  const remaining = Number.parseFloat(monthlyIncome) - totalAllocated

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="bg-transparent">
            <Calculator className="w-4 h-4 mr-2" />
            Manage Budget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Budget Management
          </DialogTitle>
          <DialogDescription>
            Set your monthly income and allocate budgets across different spending categories
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Monthly Income */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Income</CardTitle>
              <CardDescription>Enter your total monthly income or allowance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="monthly-income">Monthly Income ($)</Label>
                  <Input
                    id="monthly-income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    placeholder="Enter your monthly income"
                    className="mt-1"
                  />
                </div>
                <Button onClick={suggestBudgetAllocation} variant="outline" className="mt-6 bg-transparent">
                  Auto-Allocate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Budget Allocation Summary */}
          <Card
            className={
              remaining < 0
                ? "border-red-200 bg-red-50"
                : remaining > 0
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-green-200 bg-green-50"
            }
          >
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-xl font-bold text-gray-900">${Number.parseFloat(monthlyIncome) || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Allocated</p>
                  <p className="text-xl font-bold text-gray-900">${totalAllocated}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p
                    className={`text-xl font-bold ${remaining < 0 ? "text-red-600" : remaining > 0 ? "text-yellow-600" : "text-green-600"}`}
                  >
                    ${remaining}
                  </p>
                </div>
              </div>
              {remaining < 0 && (
                <p className="text-sm text-red-600 text-center mt-2">
                  You've allocated more than your income. Consider reducing some categories.
                </p>
              )}
              {remaining > 0 && (
                <p className="text-sm text-yellow-600 text-center mt-2">
                  You have unallocated funds. Consider adding to savings or other categories.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Category Budget Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Budget Allocation</CardTitle>
              <CardDescription>Set budget limits for each spending category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(budgetData).map(([category, data]) => (
                  <div key={category} className="space-y-2">
                    <Label htmlFor={`budget-${category}`} className="flex items-center justify-between">
                      <span>{category}</span>
                      <span className="text-sm text-gray-500">Currently spent: ${data.spent}</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`budget-${category}`}
                        type="number"
                        value={data.budget}
                        onChange={(e) => handleCategoryBudgetChange(category, e.target.value)}
                        placeholder="0"
                        min="0"
                        step="10"
                      />
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCategoryBudgetChange(category, (data.budget - 10).toString())}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCategoryBudgetChange(category, (data.budget + 10).toString())}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    {data.spent > data.budget && data.budget > 0 && (
                      <p className="text-xs text-red-600">Over budget by ${(data.spent - data.budget).toFixed(2)}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Budget
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
