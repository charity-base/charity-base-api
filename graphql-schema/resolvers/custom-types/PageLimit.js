const { GraphQLInputInt } = require("graphql-input-number")

const PageLimit = GraphQLInputInt({
  name: "PageLimit",
  description:
    "The `PageLimit` integer type defines the number of results returned per request.  `Min`: 1, `Max`: 30.  If you want much more than this you should consider an aggregation or download query instead of list.",
  min: 1,
  max: 30,
})

module.exports = PageLimit
