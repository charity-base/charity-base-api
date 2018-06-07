const isDescendant = (childField, ancestorField) => {
  const childLineage = childField.split('.')
  const ancestorLineage = ancestorField.split('.')

  if (ancestorLineage.length > childLineage.length) {
    return false
  }

  return ancestorLineage.reduce((bool, x, i) => (
    bool && x === childLineage[i]
  ), true)

}

const isDescendantOfAny = (childField, ancestorFields) => (
  ancestorFields.reduce((bool, f) => bool || isDescendant(childField, f), false)
)

module.exports = {
  isDescendantOfAny,
}
