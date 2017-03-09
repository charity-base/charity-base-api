
// Using th schema from the CSV download available at http://www.oscr.org.uk/charities/search-scottish-charity-register/charity-register-download
var schemas = { "v0.1": {} };

schemas["v0.1"].oscr_register = {
  "Charity_Number": String,
  "Charity_Name": String,
  "Registered_Date": String,
  "Known_As": String,
  "Charity_Status": String,
  "Postcode": String,
  "Constitutional_Form": String,
  "Previous_Constitutional_Form_1": String,
  "Geographical_Spread": String,
  "Main_Operating_Location": String,
  "Purposes": String,
  "Beneficiaries": String,
  "Activities": String,
  "Objectives": String,
  "Principal_Office/Trustees_Address": String,
  "Website": String,
  "Most_recent_year_income": String,
  "Most_recent_year_expenditure": String,
  "Mailing_cycle": String,
  "Year_End": String,
  "Parent_charity_name": String,
  "Parent_charity_number": String,
  "Parent_charity_country_of_registration": String,
  "Designated_religious_body": String,
  "Regulatory_Type": String
}


function getModels (mongoose, connection) {
  var modelCreator = (typeof connection !== 'undefined') ? connection : mongoose;
  var models = {};
  for (var version in schemas) {
    if (schemas.hasOwnProperty(version)) {
      models[version] = {};
      for (var collectionName in schemas[version]) {
        if (schemas[version].hasOwnProperty(collectionName)) {
          var Schema = new mongoose.Schema(schemas[version][collectionName], {
            timestamps: true,
            collection: collectionName
          });
          Schema.index( { "Charity_Number": 1 }, { unique : true } );
          models[version][collectionName] = modelCreator.model(collectionName, Schema);
        }
      }
    }
  }
  return models;
}


module.exports = getModels;
