const DEFAULT_TOP = 90
const DEFAULT_LEFT = -180
const DEFAULT_BOTTOM = -90
const DEFAULT_RIGHT = 180

const geoBoundingBox = args => {
  const bbox = {}

  try {
    bbox.top = parseFloat(args.find(x => x.top).top.value)
  } catch (e) {
    bbox.top = DEFAULT_TOP
  }

  try {
    bbox.left = parseFloat(args.find(x => x.left).left.value)
  } catch (e) {
    bbox.left = DEFAULT_LEFT
  }

  try {
    bbox.bottom = parseFloat(args.find(x => x.bottom).bottom.value)
  } catch (e) {
    bbox.bottom = DEFAULT_BOTTOM
  }

  try {
    bbox.right = parseFloat(args.find(x => x.right).right.value)
  } catch (e) {
    bbox.right = DEFAULT_RIGHT
  }

  return bbox
}

module.exports = geoBoundingBox
