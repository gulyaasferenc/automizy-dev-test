exports.handleError = (err, res, message) => {
  switch (err?.details) {
    case 'ALREADY_EXISTS':
      res.status(409).json({
        error: err.metadata.getMap()
      })
    case 'CUSTOM_ALREADY_EXISTS':
      res.status(409).json({
        error: message
      })
      break
    case 'Not found':
      res.status(204).json(err)
    default:
      res.status(500).json(err)
  }
}