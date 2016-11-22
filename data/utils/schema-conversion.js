var textFormatting = require('./formatting.js');

function findQuery (ccExtractObj) {
  var query = {};
  query.charityNumber = textFormatting.parseNumber(ccExtractObj.regno);
  query.subNumber = 0;
  if (ccExtractObj.hasOwnProperty('subno')) {
    query.subNumber = textFormatting.parseNumber(ccExtractObj.subno);
  }
  return query;
}

var schemaConversion = {};

schemaConversion.extract_charity = function (ccCharityObj, openCharitiesModel) {
  var charity = {
    charityNumber : textFormatting.parseNumber(ccCharityObj.regno),
    subNumber : textFormatting.parseNumber(ccCharityObj.subno),
    name : textFormatting.titleCase(ccCharityObj.name),
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
  return openCharitiesModel.insert(charity);
};

schemaConversion.extract_main_charity = function (ccExtractObj, openCharitiesModel) {
  var main = {
    companyNumber: ccExtractObj.coyno,
    trustees: {'T': true, 'F': false}[ccExtractObj.trustees],
    fyEnd : ccExtractObj.fyend,
    welsh : {'T': true, 'F': false}[ccExtractObj.welsh],
    incomeDate : textFormatting.parseDate(ccExtractObj.incomedate),
    income : textFormatting.parseNumber(ccExtractObj.income),
    groupType : ccExtractObj.grouptype,
    email : ccExtractObj.email,
    website : ccExtractObj.web
  };
  var updateQuery = { '$set' : { mainCharity : main } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_acct_submit = function (ccExtractObj, openCharitiesModel) {
  var submission = {
    submitDate : textFormatting.parseDate(ccExtractObj.submit_date),
    arno : ccExtractObj.arno,
    fyEnd : ccExtractObj.fyend
  };
  var updateQuery = { '$push' : { accountSubmission : submission } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_ar_submit = function (ccExtractObj, openCharitiesModel) {
  var submission = {
    submitDate : textFormatting.parseDate(ccExtractObj.submit_date),
    arno : ccExtractObj.arno
  };
  var updateQuery = { '$push' : { returnSubmission : submission } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_charity_aoo = function (ccExtractObj, openCharitiesModel) {
  var a = {
    aooType : ccExtractObj.aootype,
    aooKey : textFormatting.parseNumber(ccExtractObj.aookey),
    welsh : {'Y': true, 'N': false}[ccExtractObj.welsh],
    master : textFormatting.parseNumber(ccExtractObj.master)
  };
  var updateQuery = { '$push' : { areaOfOperation : a } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_class = function (ccExtractObj, openCharitiesModel) {
  var c = textFormatting.parseNumber(ccExtractObj.class);
  var updateQuery = { '$push' : { class : c } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_financial = function (ccExtractObj, openCharitiesModel) {
  var f = {
    fyStart : textFormatting.parseDate(ccExtractObj.fystart),
    fyEnd : textFormatting.parseDate(ccExtractObj.fyend),
    income : textFormatting.parseNumber(ccExtractObj.income),
    spending : textFormatting.parseNumber(ccExtractObj.expend)
  };
  var updateQuery = { '$push' : { financial : f } };
  return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
};

schemaConversion.extract_name = function (ccExtractObj, openCharitiesModel) {
  var n = {
    name : textFormatting.titleCase(ccExtractObj.name),
    nameId : textFormatting.parseNumber(ccExtractObj.nameno)
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
    fyStart : textFormatting.parseDate(ccExtractObj.fystart),
    fyEnd : textFormatting.parseDate(ccExtractObj.fyend),
    income : {
      voluntary : textFormatting.parseNumber(ccExtractObj.inc_vol),
      trading : textFormatting.parseNumber(ccExtractObj.inc_fr),
      investment : textFormatting.parseNumber(ccExtractObj.inc_invest),
      activities : textFormatting.parseNumber(ccExtractObj.inc_char),
      other : textFormatting.parseNumber(ccExtractObj.inc_other),
      total : textFormatting.parseNumber(ccExtractObj.inc_total),
      unknown : {
        inc_leg : textFormatting.parseNumber(ccExtractObj.inc_leg),
        inc_end : textFormatting.parseNumber(ccExtractObj.inc_end)
      }
    },
    spending : {
      voluntary : textFormatting.parseNumber(ccExtractObj.exp_vol),
      trading : textFormatting.parseNumber(ccExtractObj.exp_trade),
      activities : textFormatting.parseNumber(ccExtractObj.exp_charble),
      governance : textFormatting.parseNumber(ccExtractObj.exp_gov),
      invManagement : textFormatting.parseNumber(ccExtractObj.exp_invest),
      other : textFormatting.parseNumber(ccExtractObj.exp_other),
      total : textFormatting.parseNumber(ccExtractObj.exp_total),
      unknown : {
        exp_grant : textFormatting.parseNumber(ccExtractObj.exp_grant),
        exp_support : textFormatting.parseNumber(ccExtractObj.exp_support),
        exp_dep : textFormatting.parseNumber(ccExtractObj.exp_dep)
      }
    },
    assets : {
      fixed : {
        investment : textFormatting.parseNumber(ccExtractObj.fixed_assets),
        total : textFormatting.parseNumber(ccExtractObj.asset_close)
      },
      current : {
        cash : textFormatting.parseNumber(ccExtractObj.cash_assets),
        investment : textFormatting.parseNumber(ccExtractObj.invest_assets),
        total : textFormatting.parseNumber(ccExtractObj.current_assets)
      },
      pension : {
        total : textFormatting.parseNumber(ccExtractObj.pension_assets) // Can be +ve (asset) or -ve (liability)
      },
      credit : {
        oneYear : textFormatting.parseNegative(ccExtractObj.credit_1), // I think these should always be -ve (liability)
        longTerm : textFormatting.parseNegative(ccExtractObj.credit_long),
        total : null
      },
      net : textFormatting.parseNumber(ccExtractObj.total_assets),
      unknown : {
        invest_gain : textFormatting.parseNumber(ccExtractObj.invest_gain),
        asset_gain : textFormatting.parseNumber(ccExtractObj.asset_gain),
        pension_gain : textFormatting.parseNumber(ccExtractObj.pension_gain),
        reserves : textFormatting.parseNumber(ccExtractObj.reserves)
      }
    },
    funds : {
      endowment : textFormatting.parseNumber(ccExtractObj.funds_end),
      restricted : textFormatting.parseNumber(ccExtractObj.funds_restrict),
      unrestricted : textFormatting.parseNumber(ccExtractObj.funds_unrestrict),
      total : textFormatting.parseNumber(ccExtractObj.funds_total)
    },
    people : {
      employees : textFormatting.parseNumber(ccExtractObj.employees),
      volunteers : textFormatting.parseNumber(ccExtractObj.volunteers)
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
    regDate : textFormatting.parseDate(ccExtractObj.regdate),
    remDate : textFormatting.parseDate(ccExtractObj.remdate),
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
