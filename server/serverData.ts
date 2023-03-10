import fs from "fs" // import

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

export interface TodoListData { // for Q3
	todoLists: TodoList[]
	idCount: number
}


export function nextId(): Id { // modify to export
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
	save()
	return newList.id
}

export function addItemToList(listId: Id, item: Omit<TodoItem, "id">): Id | null {
  const list = getList(listId)
  if (!list) {
    return null
  }
	const id = nextId()
	list.items?.push({ ...item, id })
	save()
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
			return { ...x, ...update } // update
		} else {
			return x // keep the same
		}
	})
	save()
  return itemsUpdated // return a number
}

// for Q6
export function deleteList(listId: Id): number {
	const list_target = getList(listId)
	if (!list_target) { // list_target
	  return 0
	} else {
	todoLists = todoLists.filter(TodoList => TodoList !== list_target) // delete target list from todoLists
	save()
	return 200 // successfully delete
	}
  }
  

// for Q7
export function deleteItemFromList(listId: Id, itemId: Id): number {
  const list_target = getList(listId) 
  if (!list_target) {
    return 0
  } else {
  list_target.items = list_target.items.filter(l => l.id !== itemId) // // delete item from list_target
	save()
	return 200 // success 	
  }
} 

export function load() {
	try { 
		let todoListData = JSON.parse(fs.readFileSync("todo-list-data.json").toString("utf-8"))
		todoLists = todoListData.todoLists
		idCount = todoListData.idCount
	} catch (error) {
		console.log("error")
	}
}

export function save() {
	let todoListData:TodoListData = {
		todoLists: todoLists,
		idCount: idCount
	}
	fs.writeFileSync("todo-list-data.json", JSON.stringify(todoListData, null, 2))	
  }	