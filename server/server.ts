import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'

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

// start server
app.listen(port, () => {
  console.log(`To-do list server listening on port ${port}`)
})
