require('dotenv/config')
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const logger = require('morgan')
const { desencrypt } = require('./src/controllers/encrypt')
const { getBalance, getResultados, getVentas, getTRNRESUMEN } = require('./src/controllers/consultas')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(compression())
app.use(logger('dev'))
app.use(express.json({
  limit: '1gb'
}))
app.use(express.urlencoded({
  limit: '1gb',
  extended: true,
  parameterLimit: 100000
}))

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...')
  } else {
    next(err)
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

const handleRequest = async (req, res, operation) => {
  try {
    const clave = req.headers.clave
    const decrypted = await desencrypt(clave)
    const [identificacion, user, password] = decrypted.split('%')
    const resultado = await operation(user, password)
    res.status(200).json(resultado)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    res.status(500).json({ message: 'Internal server error' })
  }
}

app.get('/ventas', validateToken, (req, res) => handleRequest(req, res, getVentas))
app.get('/resultados', validateToken, (req, res) => handleRequest(req, res, getResultados))
app.get('/balance', validateToken, (req, res) => handleRequest(req, res, getBalance))
app.get('/cxc_trnres', validateToken, (req, res) => handleRequest(req, res, getTRNRESUMEN))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
