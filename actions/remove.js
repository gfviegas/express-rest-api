module.exports = (Model) => {
  return async (req, res) => {
    const entity = await Model.findById(req.params.id)
    if (!entity) return res.status(404).json()

    entity.remove()
    res.status(204).json()
  }
}
