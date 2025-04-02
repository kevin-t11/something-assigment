"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import type { Todo } from "@/types/todo"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  onDelete: (id: number) => void
  onEdit: (todo: Todo) => void
}

export default function TodoItem({ todo, onDelete, onEdit }: TodoItemProps) {
  const [isCompleted, setIsCompleted] = useState(todo.completed)

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted)
    onEdit({ ...todo, completed: !isCompleted })
  }

  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />
            <div>
              <p className={cn(
                "font-normal",
                isCompleted && "line-through"
              )}>
                {todo.title}
              </p>
              <div className="flex gap-4 mt-1 text-xs text-gray-500 ml-0">
                <p>User: {todo.userId || "Unknown"}</p>
                <p>ID: {todo.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 transition-colors hover:bg-primary/10 hover:text-primary"
            onClick={() => onEdit(todo)}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(todo.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

