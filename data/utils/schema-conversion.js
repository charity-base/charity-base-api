var tF = require('./formatting.js');

function findQuery (ccExtractObj) {
  var query = {};
  query.charityNumber = tF.parseCharityNumber(ccExtractObj.regno);
  query.subNumber = 0;
  if (ccExtractObj.hasOwnProperty('subno')) {
    query.subNumber = tF.parseNumber(ccExtractObj.subno);
  }
  return query;
}

function unsetQuery (query, unsetFields) {
  if (unsetFields.length>0) {
    query['$unset'] = {};
    for (var i=0; i<unsetFields.length; i++) {
      query['$unset'][unsetFields[i]] = true;
    }
  }
}

var schemaConversion = {};

schemaConversion.extract_charity = function (ccExtractObj, charityBaseModel) {
  var charity = {
    charityNumber : tF.parseCharityNumber(ccExtractObj.regno),
    subNumber : tF.parseNumber(ccExtractObj.subno),
    name : tF.titleCase(ccExtractObj.name),
    registered : {'R': true, 'RM': false}[ccExtractObj.orgtype],
    govDoc : ccExtractObj.gd,
    areaOfBenefit : ccExtractObj.aob,
    contact : {
      correspondant : ccExtractObj.corr,
      phone : ccExtractObj.phone,
      fax : ccExtractObj.fax,
      address : [],
      postcode : ccExtractObj.postcode
    }
  };
  var addressKeys = ['add1', 'add2', 'add3', 'add4', 'add5'];
  for (var i=0; i<addressKeys.length; i++) {
    if (ccExtractObj[addressKeys[i]]) {
      charity.contact.address.push(ccExtractObj[addressKeys[i]]);
    }
  }
  var updateQuery = { '$set' : charity };
  var unsetFields = [];
  unsetQuery(updateQuery, unsetFields);
  return charityBaseModel.find(findQuery(ccExtractObj)).upsert().updateOne(updateQuery);
};

schemaConversion.extract_main_charity = function (ccExtractObj, charityBaseModel) {
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
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_acct_submit = function (ccExtractObj, charityBaseModel) {
  var submission = {
    submitDate : tF.parseDate(ccExtractObj.submit_date),
    arno : ccExtractObj.arno,
    fyEnd : ccExtractObj.fyend
  };
  var updateQuery = { '$addToSet' : { accountSubmission : submission } };
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_ar_submit = function (ccExtractObj, charityBaseModel) {
  var submission = {
    submitDate : tF.parseDate(ccExtractObj.submit_date),
    arno : ccExtractObj.arno
  };
  var updateQuery = { '$addToSet' : { returnSubmission : submission } };
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_charity_aoo = function (ccExtractObj, charityBaseModel) {
  var a = {
    aooType : ccExtractObj.aootype,
    aooKey : tF.parseNumber(ccExtractObj.aookey),
    welsh : {'Y': true, 'N': false}[ccExtractObj.welsh],
    master : tF.parseNumber(ccExtractObj.master)
  };
  var updateQuery = { '$addToSet' : { areaOfOperation : a } };
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_class = function (ccExtractObj, charityBaseModel) {
  var c = tF.parseNumber(ccExtractObj.class);
  var updateQuery = { '$addToSet' : { class : c } };
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_financial = function (ccExtractObj, charityBaseModel) {
  var f = {
    fyStart : tF.parseDate(ccExtractObj.fystart),
    fyEnd : tF.parseDate(ccExtractObj.fyend),
    income : tF.parseNumber(ccExtractObj.income),
    spending : tF.parseNumber(ccExtractObj.expend)
  };
  var updateQuery = { '$addToSet' : { financial : f } };
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_name = function (ccExtractObj, charityBaseModel) {
  var n = {
    name : tF.titleCase(ccExtractObj.name),
    nameId : tF.parseNumber(ccExtractObj.nameno)
  };
  var updateQuery = { '$addToSet' : { otherNames : n } };
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_objects = function (ccExtractObj, charityBaseModel) {
  var o = ccExtractObj.object;
  var updateQuery = { '$addToSet' : { objects : o } };
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_partb = function (ccExtractObj, charityBaseModel) {
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

  var updateQuery = { '$addToSet' : { partB : b } };
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_registration = function (ccExtractObj, charityBaseModel) {
  var r = {
    regDate : tF.parseDate(ccExtractObj.regdate),
    remDate : tF.parseDate(ccExtractObj.remdate),
    remCode : ccExtractObj.remcode || null
  };
  var updateQuery = { '$addToSet' : { registration : r } };
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_trustee = function (ccExtractObj, charityBaseModel) {
  var t = ccExtractObj.trustee;
  var updateQuery = { '$addToSet' : { trustees : t } };
  return charityBaseModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};


module.exports = schemaConversion;
