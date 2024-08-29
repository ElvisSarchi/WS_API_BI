import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import logger from 'morgan'
import { desencrypt } from './src/controllers/encrypt'
import { getBalance, getResultados, getVentas } from './src/controllers/consultas'

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
    //const clave=`MsrFUMfJ99gGwWvOb2OdecK7wVy16iTiOGIhq8qK4PHK5GCtJwbZKrORTELdLnRkNl8AYEqxXIFHGdnH/ngGa/FsZ1TZ1Ofz8Uetswu8fvVY8E48H0H/t7DB/qTGKaaTU23q3J/F6T1dCPGVruBw/0ijbp3xyBiHf/m5HTmpxVeBoNEx8/U/gCxitNSHQMkzTVLod53lqackpqqK1ZIVShfeQ4tHD576ZbhRd17mZJ7de5XAfRuLK2CJyoYrTXI7gKeLsN+jWOlHMdBt8rPDrBQhIos9mxjiz88dzcvcobuI1gseb1FY9myJcjzv98E5JHJh1Lz5yQ518BFvFqVKZ+Oujo6nKcZk6g5Khony7JEV1BoIaUfv9g4P08Rd6ojvOnwabb3BZFrGmrZmt1wlEwNGdvErWVrRjAVAXZAnhsEg8p2VqaHKlr98ERmxpsLTLkIfzXBGjENSSteHp9PgMEwIFJ0O6X5JjM0B/cbq87B7nZJq10/n0w4NBbefFrP5u+08aA0o7vtoVm6xYkF3T/IACo3PyeoFyyI8utiu4SlWkDLW1QNdC0fYXXJ094gUZHCPFQ4qx2IThombdDqhJvB6tfHu2bmbmBRc1LcEYWDWBaMkFehrg5HT0WIwTIyyVARJJD0wJJChT6spNmVvfG5HoKLU/RE3HqaoJTsCUfYjY=`
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
