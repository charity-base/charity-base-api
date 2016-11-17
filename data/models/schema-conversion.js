function capitalize (text) {
  return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
}

function titleCase (text) {
  return text.replace(/\w\S*/g, capitalize);
}

function parseDate (dateString) {
  if (!dateString) {
    return null;
  }
  var d = new Date(dateString);
  if (Object.prototype.toString.call(d) === "[object Date]") {
    if (isNaN(d.getTime())) {
      return null;
    }
    return d;
  }
  return null;
}

function parseNumber (numberString) {
  numberString = numberString.replace(/ /g, '');
  if (numberString==null || numberString=='') {
    return null;
  }
  var number = Number(numberString);
  if (isNaN(number)) {
    return null;
  }
  return number;
}

function parseNegative (numberString) {
  var n = parseNumber(numberString);
  if (n==null) {
    return null;
  }
  return -Math.abs(n)
}

function findQuery (ccExtractObj) {
  var query = {};
  query.charityNumber = parseNumber(ccExtractObj.regno);
  query.subNumber = 0;
  if (ccExtractObj.hasOwnProperty('subno')) {
    query.subNumber = parseNumber(ccExtractObj.subno);
  }
  return query;
}


var schemaConversion = {
  extract_charity : function (ccCharityObj, openCharitiesModel) {
    var charity = {
      charityNumber : parseNumber(ccCharityObj.regno),
      subNumber : parseNumber(ccCharityObj.subno),
      name : titleCase(ccCharityObj.name),
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
  },
  extract_main_charity : function (ccExtractObj, openCharitiesModel) {
    var main = {
      companyNumber: ccExtractObj.coyno,
      trustees: {'T': true, 'F': false}[ccExtractObj.trustees],
      fyEnd : ccExtractObj.fyend,
      welsh : {'T': true, 'F': false}[ccExtractObj.welsh],
      incomeDate : parseDate(ccExtractObj.incomedate),
      income : parseNumber(ccExtractObj.income),
      groupType : ccExtractObj.grouptype,
      email : ccExtractObj.email,
      website : ccExtractObj.web
    };
    var updateQuery = { '$set' : { mainCharity : main } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  },
  extract_acct_submit : function (ccExtractObj, openCharitiesModel) {
    var submission = {
      submitDate : parseDate(ccExtractObj.submit_date),
      arno : ccExtractObj.arno,
      fyEnd : ccExtractObj.fyend
    };
    var updateQuery = { '$push' : { accountSubmission : submission } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  },
  extract_ar_submit : function (ccExtractObj, openCharitiesModel) {
    var submission = {
      submitDate : parseDate(ccExtractObj.submit_date),
      arno : ccExtractObj.arno
    };
    var updateQuery = { '$push' : { returnSubmission : submission } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  },
  extract_charity_aoo : function (ccExtractObj, openCharitiesModel) {
    var a = {
      aooType : ccExtractObj.aootype,
      aooKey : parseNumber(ccExtractObj.aookey),
      welsh : {'Y': true, 'N': false}[ccExtractObj.welsh],
      master : parseNumber(ccExtractObj.master)
    };
    var updateQuery = { '$push' : { areaOfOperation : a } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  },
  extract_class : function (ccExtractObj, openCharitiesModel) {
    var c = parseNumber(ccExtractObj.class);
    var updateQuery = { '$push' : { class : c } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  },
  extract_financial : function (ccExtractObj, openCharitiesModel) {
    var f = {
      fyStart : parseDate(ccExtractObj.fystart),
      fyEnd : parseDate(ccExtractObj.fyend),
      income : parseNumber(ccExtractObj.income),
      spending : parseNumber(ccExtractObj.expend)
    };
    var updateQuery = { '$push' : { financial : f } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  },
  extract_name : function (ccExtractObj, openCharitiesModel) {
    var n = {
      name : titleCase(ccExtractObj.name),
      nameId : parseNumber(ccExtractObj.nameno)
    };
    var updateQuery = { '$push' : { otherNames : n } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  },
  extract_objects : function (ccExtractObj, openCharitiesModel) {
    var o = ccExtractObj.object;
    var updateQuery = { '$push' : { objects : o } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  },
  extract_partb : function (ccExtractObj, openCharitiesModel) {

    var b = {
      arno : ccExtractObj.artype,
      fyStart : parseDate(ccExtractObj.fystart),
      fyEnd : parseDate(ccExtractObj.fyend),
      income : {
        voluntary : parseNumber(ccExtractObj.inc_vol),
        trading : parseNumber(ccExtractObj.inc_fr),
        investment : parseNumber(ccExtractObj.inc_invest),
        activities : parseNumber(ccExtractObj.inc_char),
        other : parseNumber(ccExtractObj.inc_other),
        total : parseNumber(ccExtractObj.inc_total),
        unknown : {
          inc_leg : parseNumber(ccExtractObj.inc_leg),
          inc_end : parseNumber(ccExtractObj.inc_end)
        }
      },
      spending : {
        voluntary : parseNumber(ccExtractObj.exp_vol),
        trading : parseNumber(ccExtractObj.exp_trade),
        activities : parseNumber(ccExtractObj.exp_charble),
        governance : parseNumber(ccExtractObj.exp_gov),
        invManagement : parseNumber(ccExtractObj.exp_invest),
        other : parseNumber(ccExtractObj.exp_other),
        total : parseNumber(ccExtractObj.exp_total),
        unknown : {
          exp_grant : parseNumber(ccExtractObj.exp_grant),
          exp_support : parseNumber(ccExtractObj.exp_support),
          exp_dep : parseNumber(ccExtractObj.exp_dep)
        }
      },
      assets : {
        fixed : {
          investment : parseNumber(ccExtractObj.fixed_assets),
          total : parseNumber(ccExtractObj.asset_close)
        },
        current : {
          cash : parseNumber(ccExtractObj.cash_assets),
          investment : parseNumber(ccExtractObj.invest_assets),
          total : parseNumber(ccExtractObj.current_assets)
        },
        pension : {
          total : parseNumber(ccExtractObj.pension_assets) // Can be +ve (asset) or -ve (liability)
        },
        credit : {
          oneYear : parseNegative(ccExtractObj.credit_1), // I think these should always be -ve (liability)
          longTerm : parseNegative(ccExtractObj.credit_long),
          total : null
        },
        net : parseNumber(ccExtractObj.total_assets),
        unknown : {
          invest_gain : parseNumber(ccExtractObj.invest_gain),
          asset_gain : parseNumber(ccExtractObj.asset_gain),
          pension_gain : parseNumber(ccExtractObj.pension_gain),
          reserves : parseNumber(ccExtractObj.reserves)
        }
      },
      funds : {
        endowment : parseNumber(ccExtractObj.funds_end),
        restricted : parseNumber(ccExtractObj.funds_restrict),
        unrestricted : parseNumber(ccExtractObj.funds_unrestrict),
        total : parseNumber(ccExtractObj.funds_total)
      },
      people : {
        employees : parseNumber(ccExtractObj.employees),
        volunteers : parseNumber(ccExtractObj.volunteers)
      },
      consolidated : ['T', 'YES', 'ConsolidatedAccounts', 'CONSOLIDATEDACCOUNTS'].indexOf(ccExtractObj.cons_acc) > -1 || false,
      charityOnly : ['T', 'TRUE', 'YES', 'CharityOnlyAccounts'].indexOf(ccExtractObj.charity_acc) > -1 || false
    };

    b.assets.credit.total = b.assets.credit.oneYear + b.assets.credit.longTerm;

    var updateQuery = { '$push' : { partB : b } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  },
  extract_registration : function (ccExtractObj, openCharitiesModel) {
    var r = {
      regDate : parseDate(ccExtractObj.regdate),
      remDate : parseDate(ccExtractObj.remdate),
      remCode : ccExtractObj.remcode || null
    };
    var updateQuery = { '$push' : { registration : r } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  },
  extract_trustee : function (ccExtractObj, openCharitiesModel) {
    var t = ccExtractObj.trustee;
    var updateQuery = { '$push' : { trustees : t } };
    return openCharitiesModel.find(findQuery(ccExtractObj)).updateOne(updateQuery);
  }

};

module.exports = schemaConversion;
