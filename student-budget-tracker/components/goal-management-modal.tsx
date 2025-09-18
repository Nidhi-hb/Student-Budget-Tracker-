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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, PlusCircle, Calendar, DollarSign, Trash2, Edit } from "lucide-react"

interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
  description?: string
  category: "savings" | "purchase" | "emergency" | "education" | "travel" | "other"
}

interface GoalManagementModalProps {
  goals: Goal[]
  onUpdateGoals: (goals: Goal[]) => void
  trigger?: React.ReactNode
}

const goalCategories = [
  { value: "savings", label: "General Savings", color: "bg-green-500" },
  { value: "emergency", label: "Emergency Fund", color: "bg-red-500" },
  { value: "education", label: "Education", color: "bg-blue-500" },
  { value: "travel", label: "Travel", color: "bg-purple-500" },
  { value: "purchase", label: "Major Purchase", color: "bg-orange-500" },
  { value: "other", label: "Other", color: "bg-gray-500" },
]

const goalTemplates = [
  {
    name: "Emergency Fund",
    target: 500,
    category: "emergency",
    description: "Build a safety net for unexpected expenses",
  },
  { name: "Spring Break Trip", target: 800, category: "travel", description: "Save for spring break vacation" },
  { name: "New Laptop", target: 1200, category: "purchase", description: "Save for a new laptop for studies" },
  { name: "Textbooks", target: 300, category: "education", description: "Budget for next semester's textbooks" },
  { name: "Summer Course", target: 600, category: "education", description: "Save for summer course tuition" },
]

export function GoalManagementModal({ goals, onUpdateGoals, trigger }: GoalManagementModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"view" | "add">("view")
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    current: "",
    deadline: "",
    description: "",
    category: "savings" as Goal["category"],
  })

  const resetForm = () => {
    setFormData({
      name: "",
      target: "",
      current: "",
      deadline: "",
      description: "",
      category: "savings",
    })
    setEditingGoal(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.target || !formData.deadline) {
      return
    }

    const goalData = {
      id: editingGoal?.id || Date.now().toString(),
      name: formData.name,
      target: Number.parseFloat(formData.target),
      current: Number.parseFloat(formData.current) || 0,
      deadline: formData.deadline,
      description: formData.description || undefined,
      category: formData.category,
    }

    if (editingGoal) {
      // Update existing goal
      const updatedGoals = goals.map((goal) => (goal.id === editingGoal.id ? goalData : goal))
      onUpdateGoals(updatedGoals)
    } else {
      // Add new goal
      onUpdateGoals([...goals, goalData])
    }

    resetForm()
    setActiveTab("view")
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      target: goal.target.toString(),
      current: goal.current.toString(),
      deadline: goal.deadline,
      description: goal.description || "",
      category: goal.category,
    })
    setActiveTab("add")
  }

  const handleDelete = (goalId: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId)
    onUpdateGoals(updatedGoals)
  }

  const handleAddToGoal = (goalId: string, amount: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal,
    )
    onUpdateGoals(updatedGoals)
  }

  const handleTemplateSelect = (template: (typeof goalTemplates)[0]) => {
    setFormData({
      name: template.name,
      target: template.target.toString(),
      current: "0",
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 months from now
      description: template.description,
      category: template.category as Goal["category"],
    })
  }

  const getCategoryInfo = (category: Goal["category"]) => {
    return goalCategories.find((cat) => cat.value === category) || goalCategories[0]
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="bg-transparent">
            <Target className="w-4 h-4 mr-2" />
            Manage Goals
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Financial Goals
          </DialogTitle>
          <DialogDescription>Set and track your financial goals to build better money habits</DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "view" ? "default" : "ghost"}
            onClick={() => {
              setActiveTab("view")
              resetForm()
            }}
            className="rounded-b-none"
          >
            My Goals ({goals.length})
          </Button>
          <Button
            variant={activeTab === "add" ? "default" : "ghost"}
            onClick={() => setActiveTab("add")}
            className="rounded-b-none"
          >
            {editingGoal ? "Edit Goal" : "Add Goal"}
          </Button>
        </div>

        {activeTab === "view" ? (
          <div className="space-y-4">
            {goals.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start building better financial habits by setting your first goal!
                  </p>
                  <Button onClick={() => setActiveTab("add")} className="bg-purple-600 hover:bg-purple-700">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {goals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100
                  const categoryInfo = getCategoryInfo(goal.category)
                  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                  return (
                    <Card key={goal.id} className="relative">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${categoryInfo.color}`} />
                              {goal.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {goal.description && <span>{goal.description} • </span>}
                              <Badge variant="outline" className="text-xs">
                                {categoryInfo.label}
                              </Badge>
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(goal)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(goal.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gray-900">
                            ${goal.current} / ${goal.target}
                          </span>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(goal.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <Progress value={progress} className="h-3" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{progress.toFixed(1)}% complete</span>
                          <span className="text-sm font-medium text-gray-900">
                            ${(goal.target - goal.current).toFixed(2)} remaining
                          </span>
                        </div>

                        {/* Quick Add Money */}
                        <div className="flex gap-2 pt-2">
                          <span className="text-sm text-gray-600 self-center">Quick add:</span>
                          {[10, 25, 50, 100].map((amount) => (
                            <Button
                              key={amount}
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddToGoal(goal.id, amount)}
                              disabled={goal.current >= goal.target}
                              className="text-xs"
                            >
                              +${amount}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Templates */}
            {!editingGoal && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Start Templates</CardTitle>
                  <CardDescription className="text-xs">Choose a template to get started quickly</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {goalTemplates.map((template) => (
                      <Button
                        key={template.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleTemplateSelect(template)}
                        className="text-left h-auto p-3 flex flex-col items-start gap-1"
                      >
                        <span className="font-medium text-sm">{template.name}</span>
                        <span className="text-xs text-gray-500">${template.target} goal</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Goal Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name *</Label>
                <Input
                  id="goal-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-category">Category</Label>
                <select
                  id="goal-category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as Goal["category"] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {goalCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-target" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Target Amount *
                </Label>
                <Input
                  id="goal-target"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.target}
                  onChange={(e) => setFormData((prev) => ({ ...prev, target: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-current">Current Amount</Label>
                <Input
                  id="goal-current"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.current}
                  onChange={(e) => setFormData((prev) => ({ ...prev, current: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="goal-deadline" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Target Date *
                </Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-description">Description (Optional)</Label>
              <Textarea
                id="goal-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Why is this goal important to you?"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
                  setActiveTab("view")
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!formData.name || !formData.target || !formData.deadline}
              >
                <Target className="w-4 h-4 mr-2" />
                {editingGoal ? "Update Goal" : "Create Goal"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
