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

export async function getLists(): Promise<TodoListBasicInfo[]> {
	return fetch(`/api/lists`).then((res) => res.json())
}

export async function getList(listId: Id): Promise<TodoList | null> {
	return fetch(`/api/list/${encodeURIComponent(listId)}/items`).then((res) => res.json())
}

export async function addList(name: string): Promise<Id> {
	const response = await fetch(`/api/list`, 
		{	method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({name: name})
			})
			const data = await response.json()
			return data.id
}

export async function addItemToList(listId: Id, item: Omit<TodoItem, "id">): Promise<Id | null> {
	const response = await fetch(`/api/list/${encodeURIComponent(listId)}/item`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify((
			{description: item.description,
				priority: item.priority,
				completed: item.completed}
		)),
	})
	const data = await response.json()
	return data.id
}

export async function updateItemOnList(listId: Id, itemId: Id, update: Partial<TodoItem>): Promise<number> {
		const response = await fetch(
		`/api/list/${encodeURIComponent(listId)}/item/${encodeURIComponent(itemId)}`, 
		{
			method: 'PUT',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({...update})
		})
		const data = await response.json()
		return data.count
}

export async function deleteList(listId:Id): Promise<number> {
		const response = await fetch(`/api/list/${encodeURIComponent(listId)}`,{method: "DELETE"})
		const data = await response.json()
		return data.count
}

export async function deleteItemFromList(listId: Id, itemId: Id): Promise<number>{
	const response = await fetch(`/api/list/${encodeURIComponent(listId)}/item/${encodeURIComponent(itemId)}`,{method:"DELETE"})
	const data = await response.json()
	return data.count
}