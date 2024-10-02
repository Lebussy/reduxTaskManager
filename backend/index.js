import mongoHelper from './mongoHelper.js'
import config from './utils/config.js'
import logger from './utils/logger.js'
import app from './app.js'
import 'express-async-errors'

await mongoHelper.resetDB()

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})