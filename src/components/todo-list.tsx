import type { Todo } from "@/types/todo"
import TodoItem from "./todo-item"

interface TodoListProps {
  todos: Todo[]
  onDelete: (id: number) => void
  onEdit: (todo: Todo) => void
}

export default function TodoList({ todos, onDelete, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="mt-4 text-center text-muted-foreground p-4 bg-muted/30 rounded-lg">
        No todos found. Create one to get started!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  )
}

