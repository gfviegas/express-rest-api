module.exports = (model) => {
  return (req, res) => {
    const query = {}
    model.find(query, (err, data) => {
      if (err) throw err
      res.status(200).json(data)
    })
  }
}
