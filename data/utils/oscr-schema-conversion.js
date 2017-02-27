var tF = require('./formatting.js');

function findQuery (oscrRegisterObj) {
  var query = {};
  query.charityNumber = tF.parseCharityNumber(oscrRegisterObj["Charity Number"]);
  query.subNumber = 0;
  return query;
}

var schemaConversion = {};

// @todo: mark existing Scottish charities as inactive first

schemaConversion.charity = function (oscrRegisterObj, charityBaseModel) {
  var charity = {
    charityNumber : tF.parseCharityNumber(oscrRegisterObj["Charity Number"]),
    subNumber : 0,
    name : oscrRegisterObj["Charity Name"],
    registered : {'Active': true, 'Inactive': false}[oscrRegisterObj["Charity Status"]],
    govDoc : oscrRegisterObj["Constitutional Form"],
    areaOfBenefit : oscrRegisterObj["Main Operating Location"],
    contact : {
      correspondant : null,
      phone : null,
      fax : null,
      address : oscrRegisterObj["Principal Office/Trustees Address"].split(", ", 5),
      postcode : oscrRegisterObj["Postcode"]
    },
    mainCharity : {
      companyNumber: null,
      trustees: null,
      fyEnd : null,
      welsh : 'F',
      incomeDate : tF.parseDate(oscrRegisterObj["Year End"]),
      income : tF.parseNumber(oscrRegisterObj["Most recent year income"]),
      groupType : null,
      email : null,
      website : oscrRegisterObj["Website"]
    },
    objects : [
      oscrRegisterObj["Objectives"]
    ],
    otherNames: [
      {
        name: oscrRegisterObj["Charity Name"],
        nameId: 0
      }
    ],
    registration: [
      {
        regDate : oscrRegisterObj["Registered Date"],
        remDate : null,
        remCode : null
      }
    ]
  };

  if (oscrRegisterObj["Known As"]!=""){
    charity.otherNames.push({
      name: oscrRegisterObj["Known As"],
      nameId: 1
    })
  }

  var updateQuery = { '$set' : charity };
  return charityBaseModel.find(findQuery(oscrRegisterObj)).upsert().updateOne(updateQuery);
};

schemaConversion.financial = function( oscrRegisterObj, charityBaseModel ){
  var f = {
    //fyStart : tF.parseDate(ccExtractObj.fystart),
    fyEnd : tF.parseDate(oscrRegisterObj["Year End"]),
    income : tF.parseNumber(oscrRegisterObj["Most recent year income"]),
    spending : tF.parseNumber(oscrRegisterObj["Most recent year expenditure"])
  };
  var updateQuery = { '$addToSet' : { financial : f } };
  return charityBaseModel.find(findQuery(oscrRegisterObj)).updateOne(updateQuery);
}

module.exports = schemaConversion;
