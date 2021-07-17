const env = require('../../config/public.js');
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./dev/swagger/openapi.yml')
const swaggerUrl = env.swagger.localUrl__useForFirebaseEmulator
  ? env.swagger.localUrl : env.swagger.cloudUrl
const port = env.swagger.port

swaggerDoc.servers = [ {
  'url': swaggerUrl
} ]

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
