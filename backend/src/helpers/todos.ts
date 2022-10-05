import { TodosAccess } from './todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const logger = createLogger('todos')

// Get all TODO items for a current user
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('getTodosForUser', { userId })
    return todosAccess.getTodosForUser(userId)
}

// Create a new TODO item
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info('createTodo', { newTodo, userId })
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        ...newTodo
    }

    return todosAccess.createTodoItem(newItem)
}

// Update a TODO item with the provided id using values in the "updatedTodo" object
export async function updateTodo(
    todoId: string,
    updatedTodo: UpdateTodoRequest,
    userId: string
): Promise<void> {
    logger.info('updateTodo', { todoId, updatedTodo, userId })
    return todosAccess.updateTodoItem(todoId, updatedTodo, userId)
}

// Delete a TODO item with the provided id
export async function deleteTodo(
    todoId: string,
    userId: string
): Promise<void> {
    logger.info('deleteTodo', { todoId, userId })
    return todosAccess.deleteTodoItem(todoId, userId)
}

