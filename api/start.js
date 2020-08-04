const api = require('./').handler
const consola = require('consola')

let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const host = config.env.HOST || 'localhost'
const port = config.env.PORT_API || 3000

// Listen the server
api.listen(port, host)
consola.ready({
  message: `API listening on http://${host}:${port}`,
  badge: true
})


const fs = require('fs')
const https = require('https')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello HTTPS!')
})


https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/tracking4dd.tk/key.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tracking4dd.tk/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/tracking4dd.tk/chain.pem')
}, app).listen(3000, () => {
  console.log('Listening...')
})