const FieldsMapper = require('./FieldsMapper')

// TODO: do this validation in charity-base-data instead
const validateCohId = (cohId) => {
  if (!cohId || !cohId.length) return null
  if (cohId.length >= 8) return cohId
  return `${'0'.repeat(8 - cohId.length)}${cohId}`
}

const fieldsMap = {
  "id": new FieldsMapper(["ids.GB-CHC"]),
  "name": new FieldsMapper(["name"]),
  "names": new FieldsMapper(
    ["name", "alternativeNames"],
    ([primaryName, allNames]) => {
      return ({ all }) => all ? allNames.map(x => ({
        value: x,
        primary: x === primaryName,
      })) : [{
        value: primaryName,
        primary: true,
      }]
    }
  ),
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
  "objectives": new FieldsMapper(["objectives"]),
  "numPeople": new FieldsMapper(["people"]),
  "areaOfBenefit": new FieldsMapper(["areaOfBenefit"]),
  "orgIds": new FieldsMapper(
    ["ids.GB-CHC", "companiesHouseNumber"],
    ([chcId, cohId]) => {

      const orgIds = [{
        id: `GB-CHC-${chcId}`,
        scheme: 'GB-CHC',
        rawId: chcId,
      }]

      const validCohId = validateCohId(cohId)
      if (validCohId) {
        orgIds.push({
          id: `GB-COH-${validCohId}`,
          scheme: 'GB-COH',
          rawId: validCohId,
        })
      }

      return orgIds
    }
  )
}

module.exports = fieldsMap
