"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import axios from "axios"
import TodoList from "./todo-list"
import TodoForm from "./todo-form"
import TodoPagination from "./todo-pagination"
import type { Todo } from "@/types/todo"

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(4)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const limit = 3

  useEffect(() => {
    fetchTodos(currentPage)
  }, [currentPage])

  const fetchTodos = async (page: number) => {
    setLoading(true)
    try {
      // Force page to be a number
      const pageNum = parseInt(String(page), 10) || 1

      // First get all todos to count them
      const allResponse = await axios.get('http://localhost:3000/todos')
      const allTodos = allResponse.data
      const totalCount = allTodos.length

      // Calculate start and end indices for manual pagination
      const startIndex = (pageNum - 1) * limit

      // Fetch the actual page data using manual pagination
      const response = await axios.get(`http://localhost:3000/todos?_start=${startIndex}&_limit=${limit}`)
      const data = response.data

      setTodos(data)
      setTotalPages(Math.ceil(totalCount / limit) || 1)
    } catch (error) {
      console.error("Error fetching todos:", error)

      // Emergency fallback if JSON server fails
      if (todos.length === 0) {
        const fallbackData = [
          { id: 1, title: "Fallback Todo", completed: false, userId: 1 }
        ]
        setTodos(fallbackData)
        setTotalPages(1)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddTodo = async (todo: Omit<Todo, "id">) => {
    setLoading(true)
    try {
      // Get highest ID to ensure new todo has higher ID
      const allResponse = await axios.get('http://localhost:3000/todos')
      const allTodos = allResponse.data

      // Find the highest ID and add 1, or use current timestamp to ensure uniqueness
      const highestId = allTodos.length > 0
        ? Math.max(...allTodos.map((t: Todo) => t.id)) + 1
        : Date.now();

      // Add to JSON server with explicit ID
      await axios.post('http://localhost:3000/todos', {
        ...todo,
        id: highestId
      })

      // Always reset to page 1 and force refresh, regardless of current page
      setCurrentPage(1)

      // Immediately fetch page 1 to show the newest todos
      // The useEffect won't trigger immediately for the same page number
      await fetchTodos(1)
    } catch (error) {
      console.error("Error adding todo:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    setLoading(true)
    try {
      // Update on JSON server
      await axios.put(`http://localhost:3000/todos/${updatedTodo.id}`, updatedTodo)

      // Update local state
      setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
      setEditingTodo(null)
    } catch (error) {
      console.error("Error updating todo:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    if (!id) {
      console.error("Delete failed: No ID provided");
      return;
    }

    console.log(`Attempting to delete todo with ID: ${id}`);
    setLoading(true);

    try {
      // First update the UI optimistically for immediate feedback
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

      // Then delete from the server
      await axios.delete(`http://localhost:3000/todos/${id}`);
      console.log(`Successfully deleted todo with ID: ${id} from server`);

      // Get fresh data from server
      // First get all todos to count them for pagination
      const allResponse = await axios.get('http://localhost:3000/todos');
      const allTodos = allResponse.data;
      const totalCount = allTodos.length;

      // Update total pages
      const newTotalPages = Math.ceil(totalCount / limit) || 1;
      setTotalPages(newTotalPages);

      // If current page is now beyond total pages, go to last page
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      // If delete failed, refresh to restore the todo in the UI
      fetchTodos(currentPage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
  }

  const handleSubmit = (todo: Todo | Omit<Todo, "id">) => {
    if ('id' in todo) {
      handleUpdateTodo(todo)
    } else {
      handleAddTodo(todo)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>

      <TodoForm
        onSubmit={handleSubmit}
        initialData={editingTodo}
        onCancel={() => setEditingTodo(null)}
      />

      {loading ? (
        <div className="flex justify-center my-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <TodoList todos={todos} onDelete={handleDeleteTodo} onEdit={handleEditTodo} />

          <div className="mt-4">
            <TodoPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </>
      )}
    </div>
  )
}

