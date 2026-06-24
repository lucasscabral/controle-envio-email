import express from 'express'
import 'dotenv/config'
// import userRoutes from './routes/user.routes.js'
import emailRoutes from './routes/email.routes.js'

const app = express()

app.use(express.json())
app.use('/api', emailRoutes)

app.use('/api', userRoutes)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
