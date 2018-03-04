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

app.use(cors())
app.use(koaBody())
app.use(logger())

console.log(process.env.AUTH0_SECRET)

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

app.use(jwt({ secret: koaJwtSecret({
        jwksUri: 'https://roll-player-dev.auth0.com/.well-known/jwks.json',
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 10 * 60 * 60 * 1000
}), algorithms: ['RS256'] }))

router.post('/graphql', graphqlKoa({ schema: graphSchema }))
router.get('/graphql', graphqlKoa({ schema: graphSchema }))

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(PORT)