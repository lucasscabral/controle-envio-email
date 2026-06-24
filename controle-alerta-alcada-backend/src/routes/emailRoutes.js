import { Router } from 'express'
import { getAllEmailLogsController } from '../controller/emailController.js'

const router = Router()

router.get('/email-logs', getAllEmailLogsController)

export default router