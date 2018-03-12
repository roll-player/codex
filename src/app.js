const koa = require('koa')
const koaRouter = require('koa-router')
const koaBody = require('koa-bodyparser')
const { graphqlKoa } = require('apollo-server-koa')
const logger = require('koa-logger')
const cors = require('@koa/cors')
const jwt = require('koa-jwt')
const { koaJwtSecret } = require('jwks-rsa')

const graphSchema = require('./schema')
const app = new koa()
const router = new koaRouter()
const PORT = process.env.PORT || 8080

if (!process.env.ROLL_PLAYER_JWKS_URI) {
  console.warn('You did not set the ROLL_PLAYER_JWKS_URI environment variable. See README.md')
}

app.use(cors())
app.use(koaBody())
app.use(logger())

app.use(function(ctx, next){
    return next().catch((err) => {
      if (401 == err.status) {
        console.log("401", err)
        ctx.status = 401;
        ctx.body = 'Protected resource, use Authorization header to get access\n';
      } else {
        throw err;
      }
    });
});

app.use(async (ctx, next) => {
  ctx.state.instanceId = (Math.random() * 10000) | 0
  ctx.set({'X-Application-Instance': ctx.state.instanceId})
  await next()
})

// check the jwt existence and validity
app.use(jwt({ secret: koaJwtSecret({
        jwksUri: process.env.ROLL_PLAYER_JWKS_URI,
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 10 * 60 * 60 * 1000
}), algorithms: ['RS256'] }))

router.post('/graphql', graphqlKoa({ schema: graphSchema }))
router.get('/graphql', graphqlKoa({ schema: graphSchema }))

router.get('/user', async (ctx, next) => {
  console.log(ctx.state)
  ctx.body = JSON.stringify(ctx.state.user)
  ctx.type = 'application/json'
  ctx.status = 200;

  await next()
})

router.get('/graphiql', async (ctx, next) => {
  if (ctx.state.user.isAdmin) {

  }

  await graphiqlKoa({ endpointURL: '/graphql' })(ctx, next)
  await next()
})

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(PORT)