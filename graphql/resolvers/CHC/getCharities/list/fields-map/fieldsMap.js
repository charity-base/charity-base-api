const FieldsMapper = require('./FieldsMapper')

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
  "income": new FieldsMapper(
    ["financial"],
    ([financial]) => {
      return {
        latest: {
          date: financial.latest && financial.latest.financialYear ? financial.latest.financialYear.end : null,
          total: financial.latest ? financial.latest.income : null,
        },
        annual: (financial.annual || []).map(x => ({
          income: x.income,
          expend: x.spending,
          financialYear: x.financialYear
        }))
      }
    }
  ),
  "finances": new FieldsMapper(
    ["financial"],
    ([financial]) => {
      return ({ all }) => {
        if (all) {
          return financial.annual || []
        }
        return financial.latest ? [financial.latest] : []
      }
    }
  ),
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

      if (cohId) {
        orgIds.push({
          id: `GB-COH-${cohId}`,
          scheme: 'GB-COH',
          rawId: cohId,
        })
      }

      return orgIds
    }
  ),
  "financialYearEnd": new FieldsMapper(["fyend"]),
  "registrations": new FieldsMapper(
    ["registrations", "lastRegistrationDate"],
    ([registrations, lastRegistrationDate]) => {
      return ({ all }) => all ? registrations : [{
        registrationDate: lastRegistrationDate,
        removalDate: null,
        removalCode: null,
        removalReason: null,
      }]
    }
  ),
}

module.exports = fieldsMap
