const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')

const createSchema = () => {
  const charitySchema = new mongoose.Schema({
    '_id': { type: mongoose.Schema.Types.ObjectId, es_type: 'keyword' },
    'regulator': { type : String, enum : ['GB-CHC', 'GB-SC', 'GB-NIC'], es_type: "keyword" },
    'ids': {
      'charityId': { type: String, es_type: "keyword" },
      'GB-CHC': { type: Number, es_type: "integer" },
    },
    'name': { type: String, es_type: "text" },
    'isRegistered': { type: Boolean, es_type: "boolean" },
    'governingDoc': { type: String, es_type: "text" },
    'areaOfBenefit': { type: String, es_type: "text" },
    'contact': {
      'email': { type: String, es_type: "keyword" },
      'person': { type: String, es_type: "text" },
      'phone': { type: String, es_type: "keyword" },
      'postcode': { type: String, es_type: "keyword" },
      'address': { type: [String], es_type: "text" },
      'geo': {
        'postcode' : { type: String, es_type: "keyword" },
        'quality' : Number,
        'eastings' : Number,
        'northings' : Number,
        'country' : { type: String, es_type: "text" },
        'nhs_ha' : { type: String, es_type: "text" },
        'longitude' : Number,
        'latitude' : Number,
        'european_electoral_region' : { type: String, es_type: "text" },
        'primary_care_trust' : { type: String, es_type: "text" },
        'region' : { type: String, es_type: "text" },
        'lsoa' : { type: String, es_type: "text" },
        'msoa' : { type: String, es_type: "text" },
        'incode' : { type: String, es_type: "text" },
        'outcode' : { type: String, es_type: "text" },
        'parliamentary_constituency' : { type: String, es_type: "text" },
        'admin_district' : { type: String, es_type: "text" },
        'parish' : { type: String, es_type: "text" },
        'admin_county' : { type: String, es_type: "text" },
        'admin_ward' : { type: String, es_type: "text" },
        'ccg' : { type: String, es_type: "text" },
        'nuts' : { type: String, es_type: "text" },
        'codes' : {
          'admin_district' : { type: String, es_type: "text" },
          'admin_county' : { type: String, es_type: "text" },
          'admin_ward' : { type: String, es_type: "text" },
          'parish' : { type: String, es_type: "text" },
          'parliamentary_constituency' : { type: String, es_type: "text" },
          'ccg' : { type: String, es_type: "text" },
          'nuts' : { type: String, es_type: "text" }
        },
      }
    },
    geo_coords: {
      type: String,
      es_type: 'geo_point',
    },
    'isWelsh': { type: Boolean, es_type: "boolean" },
    'trustees': {
      'incorporated': { type: Boolean, es_type: "boolean" },
      'names': { type: [String], es_type: "text" },
    },
    'website': { type: String, es_type: "keyword" },
    'isSchool': { type: Boolean, es_type: "boolean" },
    'income': {
      'latest': {
        'date': Date,
        'total': Number,
      },
      annual: [{
        '_id': { type: mongoose.Schema.Types.ObjectId, es_type: 'text' },
        'financialYear' : {
          'begin' : Date,
          'end' : Date,
        },
        'income' : Number,
        'expend' : Number,
      }],
    },
    'fyend': { type: String, es_type: "text" },
    'companiesHouseNumber': { type: String, es_type: "keyword" },
    'areasOfOperation': [{
      '_id': { type: mongoose.Schema.Types.ObjectId, es_type: 'keyword' },
      'id' : { type: String, es_type: 'keyword' },
      'parentId' : { type: String, es_type: 'keyword' },
      'name' : { type: String, es_type: 'text' },
      'alternativeName' : { type: String, es_type: 'text' },
      'locationType' : { type: String, es_type: 'text' },
      'isWelsh' : { type: Boolean, es_type: 'boolean' },
    }],
    'causes': [{
      '_id': { type: mongoose.Schema.Types.ObjectId, es_type: 'keyword' },
      'id' : Number,
      'name' : { type: String, es_type: "text" },
    }],
    'beneficiaries': [{
      '_id': { type: mongoose.Schema.Types.ObjectId, es_type: 'keyword' },
      'id' : Number,
      'name' : { type: String, es_type: "text" },
    }],
    'operations': [{
      '_id': { type: mongoose.Schema.Types.ObjectId, es_type: 'keyword' },
      'id' : Number,
      'name' : { type: String, es_type: "text" },
    }],
    'activities': { type: String, es_type: "text" },
    'subsidiaries': [{
      '_id': { type: mongoose.Schema.Types.ObjectId, es_type: 'keyword' },
      'name': { type: String, es_type: "text" },
      'isRegistered': { type: Boolean, es_type: "boolean" },
      'governingDoc': { type: String, es_type: "text" },
      'areaOfBenefit': { type: String, es_type: "text" },
      'contact': {
        'email': { type: String, es_type: "keyword" },
        'person': { type: String, es_type: "text" },
        'phone': { type: String, es_type: "keyword" },
        'postcode': { type: String, es_type: "keyword" },
        'address': [{ type: String, es_type: "text" }],
      },
    }],
    'alternativeNames': [{ type: String, es_type: "text" }],
  }, {
    collection : 'charities',
    strict : true,
    timestamps : true,
  })

  charitySchema.index( { 'ids.charityId' : 1 }, { unique : true } )
  charitySchema.index( { 'ids.GB-CHC' : 1 }, { unique : true } )
  charitySchema.plugin(mongoosastic)

  return charitySchema
}

const Charity = mongoose.model('Charity', createSchema())

module.exports = Charity
