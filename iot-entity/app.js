const express = require("express")
const logger = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const {StatusCodes, getReasonPhrase} = require("http-status-codes")
const RabbitMQConsumer = require("./server/rabbitmq/rabbitConsumer")
const EurekaClient = require("./server/registry/eurekaClient")

// Set up .env file
require("dotenv").config()

// Set up the express app
const app = express()

// Log requests to the console.
app.use(logger("dev"))

// CORS configuration
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:8080"],
}

app.use(cors(corsOptions))

const db = require("./server/models")

db.sequelize.sync({logging: false}).then(async () => {
    await db.WidgetsBundle.initial()
    await db.WidgetType.initial()
})

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Require routes to the app
require("./server/routes")(app)

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get("*", (req, res) =>
    res.status(StatusCodes.OK).send({
        message: "Welcome to the beginning.",
    })
)

RabbitMQConsumer.startService()
EurekaClient.registerService()

module.exports = app
