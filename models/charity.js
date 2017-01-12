  
function createSchema (mongoose) {
  var charitySchema = new mongoose.Schema({
    charityNumber : Number,
    subNumber : Number,
    name : String,
    registered : Boolean,
    govDoc : String,
    areaOfBenefit : String,
    contact : {
      correspondant : String,
      phone : String,
      fax : String,
      address : [String],
      postcode : String
    },
    mainCharity : {
      companyNumber : String,
      trustees : Boolean,
      fyEnd : String,
      welsh : Boolean,
      incomeDate : Date,
      income : Number,
      groupType : String,
      email : String,
      website : String
    },
    accountSubmission : [{
      submitDate : Date,
      arno : String,
      fyEnd : String 
    }],
    returnSubmission : [{
      submitDate : String,
      arno : String
    }],
    areaOfOperation : [{
      aooType : { type : String, enum : ['A', 'B', 'D'] },
      aooKey : Number,
      welsh : Boolean,
      master : Number
    }],
    class : [Number],
    financial : [{
      fyStart : Date,
      fyEnd : Date,
      income : Number,
      spending : Number
    }],
    otherNames : [{
      name : String,
      nameId : Number,
    }],
    objects : [String],
    partB : [{
      arno : String,
      fyStart : Date,
      fyEnd : Date,
      income : {
        voluntary : Number,
        trading : Number,
        investment : Number,
        activities : Number,
        other : Number,
        total : Number,
        unknown : {
          inc_leg : Number,
          inc_end : Number
        }
      },
      spending : {
        voluntary : Number,
        trading : Number,
        activities : Number,
        governance : Number,
        invManagement : Number,
        other : Number,
        total : Number,
        unknown : {
          exp_grant : Number,
          exp_support : Number,
          exp_dep : Number
        }
      },
      assets : {
        fixed : {
          investment : Number,
          total : Number
        },
        current : {
          cash : Number,
          investment : Number,
          total : Number
        },
        pension : {
          total : Number
        },
        credit : {
          oneYear : Number,
          longTerm : Number,
          total : Number
        },
        net : Number,
        unknown : {
          invest_gain : Number,
          asset_gain : Number,
          pension_gain : Number,
          reserves : Number
        }
      },
      funds : {
        endowment : Number,
        restricted : Number,
        unrestricted : Number,
        total : Number
      },
      people : {
        employees : Number,
        volunteers : Number
      },
      consolidated : Boolean,
      charityOnly : Boolean
    }],
    registration : [{
      regDate : Date,
      remDate : Date,
      remCode : String
    }],
    trustees : [String],
    beta : {
      activities : String,
      people : {
        trustees : Number,
        employees : Number,
        volunteers : Number
      }
    }
    // redundant:
    // aob_defined : String,
    // nhs : Boolean,
    // ha_no : String,
    // extract_objects.seqno
    // lastYearFixedAssets : {
    //   investment : parseNumber(ccExtractObj.open_assets),
    //   total : parseNumber(ccExtractObj.asset_open)
    // },

  }, {
    collection : 'charities',
    strict : true,
    timestamps : true
  });

  charitySchema.index( { 'charityNumber' : 1, 'subNumber' : 1 }, { unique : true } );
  charitySchema.index( { 'subNumber' : 1, 'registered' : 1 } );
  charitySchema.index( { 'registered' : 1 } );
  charitySchema.index( { 'mainCharity.income': 1 } );
  charitySchema.index( { 'otherNames.name': 'text' } );

  return charitySchema;
}


function getModel (mongoose, connection) {
  var modelCreator = (typeof connection !== 'undefined') ? connection : mongoose;
  var charitySchema = createSchema(mongoose);
  var Charity = modelCreator.model('Charity', charitySchema);
  return Charity
}

module.exports = getModel;
