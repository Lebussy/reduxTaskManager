import express from 'express'
const indexRouter = express.Router()

indexRouter.get('/', (req, res) => {
  return res.status(200).json({success: 'app returned'})
})

export default indexRouter