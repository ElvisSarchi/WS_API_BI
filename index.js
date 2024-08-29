import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import logger from 'morgan'

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
const unsecuredRoutes = ['/login', '/auth/register']
app.use(
  expressjwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
  }).unless({
    path: unsecuredRoutes,
  }),
)
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...')
  }
})
app.get('/login', (req, res) => {
  //create token
  const token = jwt.sign(
    {
      id: 1,
      username: 'admin',
      random: Math.random(),
    },
    process.env.SECRET,
    {
      expiresIn: '1h',
    },
  )
  res.json({
    token,
  })
})
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user // Aquí almacenamos la información del usuario en req.user
    next()
  })
}
app.get('/protegida', authenticateToken, (req, res) => {
  //leer la info del token
  console.log(req.user)
  res.json({
    message: 'Ruta protegida',
  })
})
app.get('/otraRuta', authenticateToken, (req, res) => {
  console.log(req.user)
  res.json({
    message: 'Otra ruta',
  })
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
