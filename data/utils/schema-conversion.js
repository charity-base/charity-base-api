var tF = require('./formatting.js');

function findQuery (ccExtractObj) {
  var query = {};
  query.charityNumber = tF.parseNumber(ccExtractObj.regno);
  query.subNumber = 0;
  if (ccExtractObj.hasOwnProperty('subno')) {
    query.subNumber = tF.parseNumber(ccExtractObj.subno);
  }
  return query;
}

var schemaConversion = {};

schemaConversion.extract_charity = function (ccCharityObj, openCharitiesModel) {
  var charity = {
    charityNumber : tF.parseNumber(ccCharityObj.regno),
    subNumber : tF.parseNumber(ccCharityObj.subno),
    name : tF.titleCase(ccCharityObj.name),
    registered : {'R': true, 'RM': false}[ccCharityObj.orgtype],
    govDoc : ccCharityObj.gd,
    areaOfBenefit : ccCharityObj.aob,
    contact : {
      correspondant : ccCharityObj.corr,
      phone : ccCharityObj.phone,
      fax : ccCharityObj.fax,
      address : [],
      postcode : ccCharityObj.postcode
    }
  };
  var addressKeys = ['add1', 'add2', 'add3', 'add4', 'add5'];
  for (var i=0; i<addressKeys.length; i++) {
    if (ccCharityObj[addressKeys[i]]) {
      charity.contact.address.push(ccCharityObj[addressKeys[i]]);
    }
  }
  var updateQuery = { '$set' : charity };
  return openCharitiesModel.find(findQuery(ccCharityObj)).upsert().updateOne(updateQuery); // use replaceOne for clean update
};

schemaConversion.extract_main_charity = function (ccExtractObj, openCharitiesModel) {
  var main = {
    companyNumber: ccExtractObj.coyno,
    trustees: {'T': true, 'F': false}[ccExtractObj.trustees],
    fyEnd : ccExtractObj.fyend,
    welsh : {'T': true, 'F': false}[ccExtractObj.welsh],
    incomeDate : tF.parseDate(ccExtractObj.incomedate),
    income : tF.parseNumber(ccExtractObj.income),
    groupType : ccExtractObj.grouptype,
    email : ccExtractObj.email,
    website : ccExtractObj.web
  };
  var updateQuery = { '$set' : { mainCharity : main } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_acct_submit = function (ccExtractObj, openCharitiesModel) {
  var submission = {
    submitDate : tF.parseDate(ccExtractObj.submit_date),
    arno : ccExtractObj.arno,
    fyEnd : ccExtractObj.fyend
  };
  var updateQuery = { '$push' : { accountSubmission : submission } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_ar_submit = function (ccExtractObj, openCharitiesModel) {
  var submission = {
    submitDate : tF.parseDate(ccExtractObj.submit_date),
    arno : ccExtractObj.arno
  };
  var updateQuery = { '$push' : { returnSubmission : submission } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_charity_aoo = function (ccExtractObj, openCharitiesModel) {
  var a = {
    aooType : ccExtractObj.aootype,
    aooKey : tF.parseNumber(ccExtractObj.aookey),
    welsh : {'Y': true, 'N': false}[ccExtractObj.welsh],
    master : tF.parseNumber(ccExtractObj.master)
  };
  var updateQuery = { '$push' : { areaOfOperation : a } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_class = function (ccExtractObj, openCharitiesModel) {
  var c = tF.parseNumber(ccExtractObj.class);
  var updateQuery = { '$push' : { class : c } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_financial = function (ccExtractObj, openCharitiesModel) {
  var f = {
    fyStart : tF.parseDate(ccExtractObj.fystart),
    fyEnd : tF.parseDate(ccExtractObj.fyend),
    income : tF.parseNumber(ccExtractObj.income),
    spending : tF.parseNumber(ccExtractObj.expend)
  };
  var updateQuery = { '$push' : { financial : f } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_name = function (ccExtractObj, openCharitiesModel) {
  var n = {
    name : tF.titleCase(ccExtractObj.name),
    nameId : tF.parseNumber(ccExtractObj.nameno)
  };
  var updateQuery = { '$push' : { otherNames : n } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_objects = function (ccExtractObj, openCharitiesModel) {
  var o = ccExtractObj.object;
  var updateQuery = { '$push' : { objects : o } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_partb = function (ccExtractObj, openCharitiesModel) {
  var b = {
    arno : ccExtractObj.artype,
    fyStart : tF.parseDate(ccExtractObj.fystart),
    fyEnd : tF.parseDate(ccExtractObj.fyend),
    income : {
      voluntary : tF.parseNumber(ccExtractObj.inc_vol),
      trading : tF.parseNumber(ccExtractObj.inc_fr),
      investment : tF.parseNumber(ccExtractObj.inc_invest),
      activities : tF.parseNumber(ccExtractObj.inc_char),
      other : tF.parseNumber(ccExtractObj.inc_other),
      total : tF.parseNumber(ccExtractObj.inc_total),
      unknown : {
        inc_leg : tF.parseNumber(ccExtractObj.inc_leg),
        inc_end : tF.parseNumber(ccExtractObj.inc_end)
      }
    },
    spending : {
      voluntary : tF.parseNumber(ccExtractObj.exp_vol),
      trading : tF.parseNumber(ccExtractObj.exp_trade),
      activities : tF.parseNumber(ccExtractObj.exp_charble),
      governance : tF.parseNumber(ccExtractObj.exp_gov),
      invManagement : tF.parseNumber(ccExtractObj.exp_invest),
      other : tF.parseNumber(ccExtractObj.exp_other),
      total : tF.parseNumber(ccExtractObj.exp_total),
      unknown : {
        exp_grant : tF.parseNumber(ccExtractObj.exp_grant),
        exp_support : tF.parseNumber(ccExtractObj.exp_support),
        exp_dep : tF.parseNumber(ccExtractObj.exp_dep)
      }
    },
    assets : {
      fixed : {
        investment : tF.parseNumber(ccExtractObj.fixed_assets),
        total : tF.parseNumber(ccExtractObj.asset_close)
      },
      current : {
        cash : tF.parseNumber(ccExtractObj.cash_assets),
        investment : tF.parseNumber(ccExtractObj.invest_assets),
        total : tF.parseNumber(ccExtractObj.current_assets)
      },
      pension : {
        total : tF.parseNumber(ccExtractObj.pension_assets) // Can be +ve (asset) or -ve (liability)
      },
      credit : {
        oneYear : tF.parseNegative(ccExtractObj.credit_1), // I think these should always be -ve (liability)
        longTerm : tF.parseNegative(ccExtractObj.credit_long),
        total : null
      },
      net : tF.parseNumber(ccExtractObj.total_assets),
      unknown : {
        invest_gain : tF.parseNumber(ccExtractObj.invest_gain),
        asset_gain : tF.parseNumber(ccExtractObj.asset_gain),
        pension_gain : tF.parseNumber(ccExtractObj.pension_gain),
        reserves : tF.parseNumber(ccExtractObj.reserves)
      }
    },
    funds : {
      endowment : tF.parseNumber(ccExtractObj.funds_end),
      restricted : tF.parseNumber(ccExtractObj.funds_restrict),
      unrestricted : tF.parseNumber(ccExtractObj.funds_unrestrict),
      total : tF.parseNumber(ccExtractObj.funds_total)
    },
    people : {
      employees : tF.parseNumber(ccExtractObj.employees),
      volunteers : tF.parseNumber(ccExtractObj.volunteers)
    },
    consolidated : ['T', 'YES', 'ConsolidatedAccounts', 'CONSOLIDATEDACCOUNTS'].indexOf(ccExtractObj.cons_acc) > -1 || false,
    charityOnly : ['T', 'TRUE', 'YES', 'CharityOnlyAccounts'].indexOf(ccExtractObj.charity_acc) > -1 || false
  };

  b.assets.credit.total = b.assets.credit.oneYear + b.assets.credit.longTerm;

  var updateQuery = { '$push' : { partB : b } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_registration = function (ccExtractObj, openCharitiesModel) {
  var r = {
    regDate : tF.parseDate(ccExtractObj.regdate),
    remDate : tF.parseDate(ccExtractObj.remdate),
    remCode : ccExtractObj.remcode || null
  };
  var updateQuery = { '$push' : { registration : r } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_trustee = function (ccExtractObj, openCharitiesModel) {
  var t = ccExtractObj.trustee;
  var updateQuery = { '$push' : { trustees : t } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};


module.exports = schemaConversion;
