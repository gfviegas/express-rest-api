module.exports = (Model) => {
  return (req, res) => {
    Model
      .countDocuments(req.body)
      .exec((err, value) => {
        if (err) throw err
        res.status(200).json({ exists: !!(value >= 1) })
      })
  }
}
