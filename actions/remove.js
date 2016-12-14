module.exports = (Model) => {
  return (req, res) => {
    const query = {_id: req.params.id}
    // É multi: true CUIDADO!
    Model.remove(query, (err, data) => {
      if (err) throw err

      res.status(200).json(data)
    })
  }
}
