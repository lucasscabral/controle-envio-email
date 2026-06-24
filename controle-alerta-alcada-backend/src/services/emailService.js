
// import { prisma } from '../config/prisma.js'
import { prisma } from '../config/prisma.js'
import { hashPassword } from '../utils/hash.js'

export default async function getAllEmailLogs() {

  const log_emails = await prisma.oc_email_log.findMany()
  
  return log_emails
}
