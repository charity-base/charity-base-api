const getSearchFilters = (search) => {
  if (!search || !search.trim()) {
    return [
      {
        match_all: {},
      },
    ];
  }
  return [
    {
      simple_query_string: {
        query: `${search.trim()}`, //`${search.trim().split(" ").join("~1 + ")}~1`, // what about "quoted searches"?
        fields: [
          "names.name^3",
          "activities",
          "contact.email",
          "trustees.name",
          "areas.name",
          "causes.name",
          "beneficiaries.name",
          "operations.name",
          "funding.grants.description",
          "funding.funders.name",
          "website",
        ],
      },
    },
  ];
};

module.exports = getSearchFilters;
