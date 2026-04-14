import { httpServer } from './app.js'
import logger from './utils/logger.js'
import sequelize, { umzugSeeding } from './config/database.js'
import './models/associations.js'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Database connected successfully.')

    // Sync models
    // await sequelize.sync({ alter: true })
    // await sequelize.sync({ force: true })
    logger.info('Database synced.')

    // Run seeders
    await umzugSeeding.up()
    logger.info('Seeders executed.')

    httpServer.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    logger.error('Unable to connect to the database: ' + error.message)
  }
}

startServer()
