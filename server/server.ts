import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Id, nextId, TodoItem, getLists, getList, addList, addItemToList, TodoList } from './serverData'

// data managed by server
type listName = string
type listId = string
type listSet = Set<listName>
const lists: Record<listId, listSet> = {}


// set up Express
const app = express()
const port = 8087
app.use(bodyParser.json())

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// app routes
// Q3-1
app.get("/api/lists", (req, res) => {
  res.status(200).json(getLists()) 
})

// Q3-2
app.get("/api/list/:listId/items", (req, res) => { // get by a specific id 
  const list:TodoList = getList(req.params.listId)
  if (!list) { // if list not exist
    res.status(404).json({ status: "error" }) // return 404 and error
    return
  }
  res.status(200).json(getList(req.params.listId)) // success get
})

// Q3-3
app.post("/api/list", (req, res) => { // create a new todo list
  if (typeof req.body.name === "string") { // validate types
    let newId:string = addList(req.body.name);  // add name and return new id
    res.status(200).json({ status: "ok", id: newId }) // ok: return newId
  } else {
    res.status(400).json({ status: "error" }) // types error: return 400
  }
})
 
// Q3-4
app.post("/list/:listId/item", (req, res) => {
  // first validate types
  if (typeof req.body?.completed === "boolean" // follow instruction
      && typeof req.body?.description === "string"
      && req.body.priority in ['1','2','3']){
        let item:Omit<TodoItem, "id"> = {...req.body} // define item as type for addItemToList()
        let newId:string = addItemToList(req.params.listId, item)  // input Id and item
        res.status(200).json({ status: "ok" }) // ok: return 200
      }
      else{
        res.status(400).json({ status: "error" }) // type error: return 400
}
})


app.put("/list/:listId/items/:item", (req, res) => {
  const list = lists[req.params.listId]
  if (!list) {
    res.status(404).json({ status: "error" })
    return
  }
  if (!req.params.item) {
    res.status(400).json({ status: "error" })
    return
  }
  list.add(req.params.item)
  res.status(200).json({ status: "ok", count: list.size })
})

// Q6 Implement the DELETE /api/list/<<list ID>> 
app.delete("/list/:listId/", (req, res) => {
  const list = lists[req.params.listId]
  if (!list) {
    res.status(404).json({ status: "error" })
    return
  }
  //list.xxx() will call a new function 
  res.status(200).json({ status: "ok", count: list.size })
})

// Q7 Implement the DELETE /api/list/<<list ID>>/item/<<item ID>>
app.delete("/list/:listId/item/:item", (req, res) => {
  const list = lists[req.params.listId]
  if (!list) {
    res.status(404).json({ status: "error" })
    return
  }
  if (!req.params.item) {
    res.status(400).json({ status: "error" })
    return
  }
  // list.xx() call a new function
  res.status(200).json({ status: "ok", count: list.size })
})


// start server
app.listen(port, () => {
  console.log(`To-do list server listening on port ${port}`)
})
