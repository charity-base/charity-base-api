
const createSchema = mongoose => {
  const charitySchema = new mongoose.Schema({
    'regulator': { type : String, enum : ['GB-CHC', 'GB-SC', 'GB-NIC'] },
    'ids': {
      'charityId': String,
      'GB-CHC': Number,
    },
    'name': String,
    'isRegistered': Boolean,
    'governingDoc': String,
    'areaOfBenefit': String,
    'contact': {
      'email': String,
      'person': String,
      'phone': String,
      'postcode': String,
      'address': [String],
    },
    'isWelsh': Boolean,
    'trustees': {
      'incorporated': Boolean,
      'names': [String],
    },
    'website': String,
    'isSchool': Boolean,
    'income': {
      'latest': {
        'date': Date,
        'total': Number,
      },
      annual: [{
        'financialYear' : {
          'begin' : Date,
          'end' : Date,
        },
        'income' : Number,
        'expend' : Number,
      }],
    },
    'fyend': String,
    'companiesHouseNumber': Number,
    'areasOfOperation': [{
      'id' : String,
      'parentId' : String,
      'name' : String,
      'alternativeName' : String,
      'locationType' : String,
      'isWelsh' : Boolean,
    }],
    'categories': [{
      'id' : Number,
      'name' : String,
    }],
    'beneficiaries': [{
      'id' : Number,
      'name' : String,
    }],
    'operations': [{
      'id' : Number,
      'name' : String,
    }],
    'activities': String,
  }, {
    collection : 'charitiesMar10',
    strict : true,
    timestamps : true
  })

  charitySchema.index( { 'ids.charityId' : 1 }, { unique : true } );
  charitySchema.index( { 'ids.GB-CHC' : 1 }, { unique : true } );
  charitySchema.index( { 'income.latest.total': 1 } );
  charitySchema.index( { '$**': 'text' } );
  // charitySchema.index( { 'geo.address': '2dsphere' } );

  return charitySchema;
}


const getModel = (mongoose, connection) => {
  var modelCreator = (typeof connection !== 'undefined') ? connection : mongoose;
  var charitySchema = createSchema(mongoose);
  var Charity = modelCreator.model('Charity', charitySchema);
  return Charity
}

module.exports = getModel;
