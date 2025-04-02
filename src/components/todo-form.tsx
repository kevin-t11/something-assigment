"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Todo } from "@/types/todo"

interface TodoFormProps {
  onSubmit: (todo: Todo | Omit<Todo, "id">) => void
  initialData?: Todo | null
  onCancel?: () => void
}

export default function TodoForm({ onSubmit, initialData, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState("")
  const [completed, setCompleted] = useState(false)
  const isEditing = !!initialData

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setCompleted(initialData.completed)
    } else {
      setTitle("")
      setCompleted(false)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    if (isEditing && initialData) {
      onSubmit({
        ...initialData,
        title,
        completed,
      })
    } else {
      onSubmit({
        title,
        completed,
        userId: 1, // Default userId
      })
    }

    if (!isEditing) {
      setTitle("")
      setCompleted(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{isEditing ? "Edit Todo" : "Add New Todo"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3 pt-0">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter todo title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="completed"
              checked={completed}
              onCheckedChange={(checked) => setCompleted(checked === true)}
            />
            <Label htmlFor="completed" className="cursor-pointer text-sm my-2">
              Mark as completed
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between my-4 pb-3">
          {isEditing && onCancel && (
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm" className={isEditing ? "" : "w-full"}>
            {isEditing ? "Update Todo" : "Add Todo"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

