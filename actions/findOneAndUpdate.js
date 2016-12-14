module.exports = (Model) => {
  return (req, res) => {
    const query = {_id: req.params.id}
    const mod = req.body
    Model.findOneAndUpdate(query, {$set: mod}, {new: true}, (err, data) => {
      if (err) throw err

      res.status(200).json(data)
    })
  }
}
