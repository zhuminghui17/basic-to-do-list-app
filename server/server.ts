import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Id, nextId, TodoItem, 
  getLists, getList, addList, addItemToList, updateItemOnList, deleteList, 
  deleteItemFromList, TodoList } from './serverData'

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
// Q4-1
app.get("/api/lists", (req, res) => {
  res.status(200).json(getLists()) 
})

// Q4-2
app.get("/api/list/:listId/items", (req, res) => { // get by a specific id 
  const list:TodoList = getList(req.params.listId)
  if (!list) { // if list not exist (is null)
    res.status(404).json({ status: "error, listId does not exist." }) // return 404 and error
    return
  }
  res.status(200).json(getList(req.params.listId).items) // success get the items
})

// Q4-3
app.post("/api/list", (req, res) => { // create a new todo list
  if (typeof req.body.name === "string") { // validate types
    let newId:string = addList(req.body.name);  // add name and return new id
    res.status(200).json({ status: "ok", id: newId }) // ok: return newId
  } else {
    res.status(400).json({ status: "error, the request was malformed." }) // types error: return 400
    return
  }
})
 
// Q4-4
app.post("/api/list/:listId/item", (req, res) => {
  // first validate types
  if (typeof req.body?.completed === "boolean" // follow instruction
      && typeof req.body?.description === "string"
      && req.body.priority in ['1','2','3']){
        let item:Omit<TodoItem, "id"> = {...req.body} // define item as type for addItemToList()
        let newId:string = addItemToList(req.params.listId, item)  // input Id and item
        if (newId === null) { // 
          res.status(404).json({status: "error, listId does not exist."})
        } else {
          res.status(200).json({ status: "ok" }) // ok: return 200
        }
      }
      else{
        res.status(400).json({ status: "error, the request was malformed." }) // type error: return 400
        return
}
})

// Q5 
app.put('/api/list/:listId/item/:itemId', (req, res) => {
    let listId:string = req.params.listId
    let itemId:string = req.params.itemId
    let update:Partial<TodoItem> = { ...req.body }
    let update_n:number = updateItemOnList(listId, itemId, update) // updateItemOnList return the number of items updated
    if (update_n === 0) {  // if list not exist, updateItemOnList return 0
      res.status(404).json({ status: "error, listId does not exist." }) // here return 404
      return
    }
    else {
      res.status(200).json({ status: 'ok' }) 
    }
})


// Q6 Implement the DELETE /api/list/<<list ID>> 
app.delete("/api/list/:listId/", (req, res) => {
    let listId:string = req.params.listId
    let delete_n:number = deleteList(listId) // will implement deleteList() in serverData
    if (delete_n === 0) { // equal !list 
      res.status(404).json({ status: "error" })
      return
    }
    else {
      res.status(200).json({ status: "ok" })
    }
  })

// Q7 Implement the DELETE /api/list/<<list ID>>/item/<<item ID>>
app.delete("/api/list/:listId/item/:item", (req, res) => {
    let listId:string = req.params.listId
    let itemId:string = req.params.itemId
    let delete_item_n:number = deleteItemFromList(listId, itemId) // will implement deleteItemFromList() in serverData
    if (delete_item_n === 0) {  // if list not exist, deleteItemFromList() return 0
      res.status(404).json({ status: "error" }) // here return 404
      return
    }
    else {
      res.status(200).json({ status: 'ok' }) 
    }
})    

// start server
app.listen(port, () => {
      console.log(`To-do list server listening on port ${port}`)
    })

