const FieldsMapper = require('./FieldsMapper')

const fieldsMap = {
  "id": new FieldsMapper(["ids.GB-CHC"]),
  "name": new FieldsMapper(["name"]),
  "activities": new FieldsMapper(["activities"]),
  "income": new FieldsMapper(["income"]),
  "grants": new FieldsMapper(["grants"]),
  "areas": new FieldsMapper(["areasOfOperation"]),
  "causes": new FieldsMapper(["causes"]),
  "beneficiaries": new FieldsMapper(["beneficiaries"]),
  "operations": new FieldsMapper(["operations"]),
  "geo": new FieldsMapper(["contact.geo"]),
  "contact": new FieldsMapper(["contact"]),
  "website": new FieldsMapper(["website"]),
  "governingDoc": new FieldsMapper(["governingDoc"]),
  "alternativeNames": new FieldsMapper(["alternativeNames"]),
  "objectives": new FieldsMapper(["objectives"]),
  "numPeople": new FieldsMapper(["people"]),
  "areaOfBenefit": new FieldsMapper(["areaOfBenefit"]),
  "companiesHouseNumber": new FieldsMapper(["companiesHouseNumber"]),
}

module.exports = fieldsMap
