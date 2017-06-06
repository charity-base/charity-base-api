const isDescendant = (childField, ancestorField) => {
  const childLineage = childField.split('.');
  const ancestorLineage = ancestorField.split('.');

  if (ancestorLineage.length > childLineage.length) {
    return false;
  }

  for (let i = 0; i < ancestorLineage.length; i += 1) {
    if (ancestorLineage[i] !== childLineage[i]) {
      return false;
    }
  }

  return true;
}

const isDescendantOfAny = (childField, ancestorFields) => (
  ancestorFields.map(f => isDescendant(childField, f)).some(bool => bool)
);


module.exports = {
  isDescendantOfAny,
}
