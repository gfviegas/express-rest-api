module.exports = (Model) => {
  return (req, res) => {
    const id = {_id: req.params.id}
    Model.findById(id, (err, data) => {
      if (err) throw err

      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json({})
      }
    })
  }
}
