module.exports = (Model) => {
  return async (req, res) => {
    const mod = req.body
    let entity = await Model.findById(req.params.id).exec()
    if (!entity) return res.status(404).json()
    entity = Object.assign(entity, mod)

    await entity.save()
    return res.status(200).json(entity)
  }
}
