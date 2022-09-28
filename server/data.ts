export type Id = string

export interface TodoList {
	id: Id
	name: string
	items: TodoItem[]
}

export interface TodoListBasicInfo {
	id: Id
	name: string
	count: number
}

export interface TodoItem {
	id: string
	description: string
	completed: boolean
	priority: 1 | 2 | 3	
}

let todoLists: TodoList[] = [
	{ name: "Homework", id: "x1", items: [] },
	{ name: "Shopping", id: "x2", items: [{ id: "x3", description: "eggs", completed: false, priority: 2 }] },
]

let idCount = 0

function nextId(): Id {
	return String(idCount++)
}

export function getLists(): TodoListBasicInfo[] {
	return todoLists.map(({ id, name, items }) => ({ id, name, count: items.length }))
}

export function getList(listId: Id): TodoList | null {
	return todoLists.filter(l => l.id === listId)[0] || null
}

export function addList(name: string): Id {
	const newList: TodoList = { id: nextId(), name, items: [] }
	todoLists.push(newList)
	return newList.id
}

export function addItemToList(listId: Id, item: Omit<TodoItem, "id">): Id | null {
  const list = getList(listId)
  if (!list) {
    return null
  }
	const id = nextId()
	list.items?.push({ ...item, id })
	return id
}

export function updateItemOnList(listId: Id, itemId: Id, update: Partial<TodoItem>): number {
	const list = getList(listId)
	if (!list) {
		return 0
	}

  let itemsUpdated = 0
	list.items = list.items.map(x => {
		if (x.id === itemId) {
      ++itemsUpdated
			return { ...x, ...update }
		} else {
			return x
		}
	})
  return itemsUpdated
}