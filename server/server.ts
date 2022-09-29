import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'

// data managed by server
type listName = string
type listId = string
type listSet = Set<listName>
const lists: Record<listId, listSet> = {}
let listCount = 0
function nextListId() {
  return String(listCount++)
}

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
app.get("/lists", (req, res) => {
  res.status(200).json(Object.keys(lists)) // return all the objects in lists as an array
})

app.get("/list/:listId/:items", (req, res) => { // get by a specific id 
  const list = lists[req.params.listId] 
  if (!list) { // if list not exist
    res.status(404).json({ status: "error" }) // return 404 and error
    return
  }
  res.status(200).json([...list]) // success get
})

app.post("/list", (req, res) => { // create a new list
  const listId = nextListId() // create a list id
  lists[listId] = new Set<string>()
  res.status(200).json({ listId })
})
 

app.post("/list/:listId/:items", (req, res) => {
  const list = lists[req.params.listId]
  const items = list[req.params.items]
  if (!list) {
    res.status(404).json({ status: "error" })
    return
  }
  if (!req.params.items) {
    res.status(400).json({ status: "error" })
    return
  }
  res.status(200).json([...items])
})





}
  const list = lists
{}
)




// start server
app.listen(port, () => {
  console.log(`To-do list server listening on port ${port}`)
})
