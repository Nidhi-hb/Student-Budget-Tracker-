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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Receipt, Calendar, DollarSign, Tag } from "lucide-react"

interface AddExpenseModalProps {
  categories: string[]
  onAddExpense: (expense: {
    description: string
    amount: number
    category: string
    date: string
    notes?: string
  }) => void
  trigger?: React.ReactNode
}

export function AddExpenseModal({ categories, onAddExpense, trigger }: AddExpenseModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description || !formData.amount || !formData.category) {
      return
    }

    onAddExpense({
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes || undefined,
    })

    // Reset form
    setFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    })

    setIsOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Quick expense buttons for common student expenses
  const quickExpenses = [
    { name: "Coffee", amount: 5, category: "Food & Dining" },
    { name: "Lunch", amount: 12, category: "Food & Dining" },
    { name: "Bus Fare", amount: 3, category: "Transportation" },
    { name: "Movie Ticket", amount: 15, category: "Entertainment" },
    { name: "Textbook", amount: 50, category: "Books & Supplies" },
    { name: "Snacks", amount: 8, category: "Food & Dining" },
  ]

  const handleQuickExpense = (expense: (typeof quickExpenses)[0]) => {
    setFormData((prev) => ({
      ...prev,
      description: expense.name,
      amount: expense.amount.toString(),
      category: expense.category,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            Add New Expense
          </DialogTitle>
          <DialogDescription>Record a new expense and track your spending</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Expense Buttons */}
          <Card className="bg-gray-50">
            <CardContent className="pt-4">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Quick Add Common Expenses</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {quickExpenses.map((expense) => (
                  <Button
                    key={expense.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickExpense(expense)}
                    className="text-xs p-2 h-auto flex flex-col items-center gap-1"
                  >
                    <span className="font-medium">{expense.name}</span>
                    <span className="text-gray-500">${expense.amount}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expense Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Description *
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="What did you spend on?"
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Amount *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional details about this expense..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.description || !formData.amount || !formData.category}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
