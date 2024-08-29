import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import logger from 'morgan'
import { desencrypt } from './src/controllers/encrypt'
import { getVentas } from './src/controllers/consultas'

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
    //hacer split por %
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
