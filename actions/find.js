module.exports = (model) => {
  return (req, res) => {
    const query = (req.query) || {}
    model
      .find(query)
      .sort({'created_at': '-1'})
      .exec((err, data) => {
        if (err) throw err
        res.status(200).json(data)
      })
  }
}
