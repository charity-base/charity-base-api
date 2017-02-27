

// Using th schema from the CSV download available at http://www.oscr.org.uk/charities/search-scottish-charity-register/charity-register-download
var schemas = { "v0.1": {} };

schemas["v0.1"].oscr_register = {
  // registered number of a charity
  "Charity Number": String,
  // regsitered name of charity
  "Charity Name": String,
  "Registered Date": String,
  "Known As": String,
  "Charity Status": String,
  "Postcode": String,
  "Constitutional Form": String,
  "Previous Constitutional Form 1": String,
  "Geographical Spread": String,
  "Main Operating Location": String,
  "Purposes": String,
  "Beneficiaries": String,
  "Activities": String,
  "Objectives": String,
  "Principal Office/Trustees Address": String,
  "Website": String,
  "Most recent year income": String,
  "Most recent year expenditure": String,
  "Mailing cycle": String,
  "Year End": String,
  "Parent charity name": String,
  "Parent charity number": String,
  "Parent charity country of registration": String,
  "Designated religious body": String,
  "Regulatory Type": String
}
/*
schemas["v0.1"].financial = {
  charityNumber: {type: String, index: true},
  financial: [{
    fye: {type: Date, index: true, unique: true},
    income: Number,
    expend: Number
  }]
}

schemas["v0.1"].oscr_ccew_match = {
  charityNumberOSCR: String,
  charityNumberCCEW: String
}
*/
function getModels (mongoose, connection) {
  var modelCreator = (typeof connection !== 'undefined') ? connection : mongoose;
  var ccModels = {};
  for (var version in schemas) {
    if (schemas.hasOwnProperty(version)) {
      ccModels[version] = {};
      for (var collectionName in schemas[version]) {
        if (schemas[version].hasOwnProperty(collectionName)) {
          var Schema = new mongoose.Schema(schemas[version][collectionName], {
            timestamps: true,
            collection: collectionName
          });
          if (Schema.obj.hasOwnProperty('regno')) {
            var index = { regno : 1 };
            if (Schema.obj.hasOwnProperty('subno')) {
              index.subno = 1;
            }
            Schema.index(index);
          }
          ccModels[version][collectionName] = modelCreator.model(collectionName, Schema);
        }
      }
    }
  }
  return ccModels;
}


module.exports = getModels;
