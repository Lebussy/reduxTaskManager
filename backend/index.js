import mongoHelper from './mongoHelper.js'
import logger from './utils/logger.js'
import app from './app.js'
import 'express-async-errors'

if (process.env.NODE_ENV === 'development'){
  await mongoHelper.resetDB()
  console.log('#############rest db from index####################')
  console.log()
}

const port = process.env.PORT || 3000
app.listen(port, () => {
  logger.info(`Server running on port ${port}`)
})