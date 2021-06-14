const _ = require('underscore')

const mount = (categories) => {
  let result = []
  const grouped = _.groupBy(categories, cat => cat.dad || '000/root')
  result = result.concat(grouped['000/root'])
  delete grouped['000/root']

  for (const cat in grouped) {
    const name = cat.split('/')
    const inParent = result.find(item => item.levelId === name[0] && item.name === name[1])
    if (inParent !== undefined) {
      inParent.children = grouped[cat]
      continue
    }

    const obj = categories.filter(item => item.levelId === name[0] && item.name === name[1])
    if (obj.length === 1) {
      obj[0].children = grouped[cat]
      result.push(obj[0])
    }
  }

  return result.filter(item => item.dad === undefined)
}

const format = (array) => {
  return array.map(item => {
    delete item.dad
    item.hasChildren = item.children !== undefined && item.children.length > 0
    if (item.hasChildren) {
      format(item.children)
    }
    return item
  })
}

module.exports = {
  mount,
  format
}
