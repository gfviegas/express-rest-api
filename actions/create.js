module.exports = (Model) => {
  return (req, res) => {
    const data = req.body
    const modelInstance = new Model(data)

    modelInstance.save((err, _data) => {
      if (err) throw err

      res.status(201).json(modelInstance)
    })
  }
}
