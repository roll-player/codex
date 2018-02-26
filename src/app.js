const koa = require('koa')
const koaRouter = require('koa-router')
const koaBody = require('koa-bodyparser')
const { graphqlKoa } = require('apollo-server-koa')
const logger = require('koa-logger')
const cors = require('@koa/cors')
const jwt = require('koa-jwt')

const graphSchema = require('./schema')
const app = new koa()
const router = new koaRouter()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(koaBody())
app.use(logger())

app.use(jwt({ secret: process.env.AUTH0_SECRET }))

router.post('/graphql', graphqlKoa({ schema: graphSchema }))
router.get('/graphql', graphqlKoa({ schema: graphSchema }))

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(PORT)