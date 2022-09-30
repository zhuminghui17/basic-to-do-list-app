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
	.then((res) => {
		return res.json()
	}).then((data: TodoListBasicInfo[]) => {
		return data
	})
}

// Q8-2
export async function getList(): Promise<TodoList | null> {
	return fetch('/api/list/${encodeURIComponent(listId)}/items')
	.then((res) => {
		return res.json()
	}).then((data: TodoList | null) => {
		return data
	})
}

// Q8-3
export async function addList(name: string): Promise<Id> {
	const response = await fetch('/api/list', 
		{
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({name: name})
			})

			const data = await response.json()
			return data.id
}

export async function addItemToList(listId: Id, item: Omit<TodoItem, "id">): Promise<Id | null> {
		const response = await fetch(
		'api/list/${encodeURIComponent(listId)}/items', 
		{
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				...item
			})
		})
		
		const data = await response.json()
		return data.id
}


export async function updateItemOnList(listId: Id, itemId: Id, update: Partial<TodoItem>): Promise<number> {
		const response = await fetch(
		'api/list/${encodeURIComponent(listId)}/item/${encodeURIComponent(itemId)}', 
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

