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

// Q8-1
export async function getLists(): Promise<TodoListBasicInfo[]> {
	return fetch('/api/lists')
	.then((response) => {
		return response.json()
	}).then((data: TodoListBasicInfo[]) => {
		return data
	})
}

// Q8-2
export async function getList(): Promise<TodoList | null> {
	return fetch('/api/list/${encodeURIComponent(listId)}/items')
	.then((response) => {
		return response.json()
	}).then((data: TodoList | null) => {
		return data
	})
}

// Q8-3
export async function addList(name: string): Promise<Id> {
	return fetch(
		'/api/list', 
		{
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({name: name})
			})
			.then((response) => response.json())
			.then((data) => data.id)
}

export async function addItemToList(listId: Id, item: Omit<TodoItem, "id">): Promise<Id | null> {
	return fetch(
		'api/list/${encodeURIComponent(listId)}/items', 
		{
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				description: item.description,
				completed: item.completed,
				priority: item.priority
			})
		})
		.then((response) => response.json())
		.then((data) => data.id)
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