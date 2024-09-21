const reqLogger = (req, res, next) => {
  console.log( `Method: ${req.method} Body: ${req.body}`)
  next()
}

export default reqLogger