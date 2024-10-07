require('dotenv/config')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')
const logger = require('morgan')
const { desencrypt } = require('./src/controllers/encrypt')
const { getBalance, getResultados, getVentas } = require('./src/controllers/consultas')

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(bodyParser.json())
app.use(compression())
app.use(logger('dev'))
app.use(
  express.json({
    limit: '50mb',
  }),
)
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
)

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...')
  }
})
function validateToken(req, res, next) {
  const bearerHeader = req.headers['clave']
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}
app.get('/ventas', validateToken, async (req, res) => {
  try {
    const clave = req.headers.clave
    const decrypted = await desencrypt(clave)
    const split = decrypted.split('%')
    const [identificacion, user, password] = split

    console.log('decrypted', decrypted)
    const resultado = await getVentas(user, password)
    res.status(200).json(resultado)
  } catch (error) {
    console.error('Error en /: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
app.get(`/resultados`, validateToken, async (req, res) => {
  try {
    const clave = req.headers.clave
    const decrypted = await desencrypt(clave)
    const split = decrypted.split('%')
    const [identificacion, user, password] = split
    const resultado = await getResultados(user, password)
    res.status(200).json(resultado)
  } catch (error) {
    console.error('Error en /: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
app.get(`/balance`, validateToken, async (req, res) => {
  try {
    const clave = req.headers.clave
    const decrypted = await desencrypt(clave)
    const split = decrypted.split('%')
    const [identificacion, user, password] = split
    const resultado = await getBalance(user, password)
    res.status(200).json(resultado)
  } catch (error) {
    console.error('Error en /: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
