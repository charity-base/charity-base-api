

// Using th schemas defined at http://data.charitycommission.gov.uk/data-definition.aspx
// Comments are taken from the same webpage but are not very accurate
var schemas = { "v0.1": {} };

schemas["v0.1"].extract_acct_submit = {
  "regno"       : String,
  // integer null  registered number of a charity
  "submit_date" : String,
  // smalldatetime null  date submitted
  "arno"        : String,
  // char(4) not null  annual return mailing cycle code
  "fyend"       : String,
  // varchar(4)  null  Charity’s financial year end date (may be blank)
};

schemas["v0.1"].extract_aoo_ref = {
  // aootype varchar(10) not null  A (wide), B (LA), C (GLA/met county), D (country), E (continent)
  "aootype" : String,
  // aookey integer not null  Values if aootype=A are: 1 England/Wales; 2 England; 3 Wales; 4 London.
  "aookey"  : String,
  // aooname varchar(255)  not null  name of an area of operation
  "aooname" : String,
  // aoosort varchar(100)  not null  for searches, “City of” removed from aooname
  "aoosort" : String,
  // welsh varchar(1)  not null  Flag: “Y” or blank
  "welsh"   : String,
  // master integer null  may be blank. If aootype=D then holds continent; if aootype=B then holds GLA/met county
  "master"  : String
};

schemas["v0.1"].extract_ar_submit = {
  // regno integer null  registered number of a charity
  "regno"       : String,
  // arno char(4) not null  annual return mailing cycle code
  "arno"        : String,
  // submit_date smalldatetime null  date submitted
  "submit_date" : String
};

schemas["v0.1"].extract_charity = {
  // regno integer null  registered number of a charity
  "regno"       : String,
  // subno integer null  subsidiary number of a charity (may be 0 for main/group charity)
  "subno"       : String,
  // name varchar(150)  null  main name of the charity
  "name"        : String,
  // orgtype varchar(10) null  R (registered) or RM (removed)
  "orgtype"     : String,
  // gd nvarchar(max) null  Description of Governing Document
  "gd"          : String,
  // aob varchar(max)  null  area of benefit – may not be defined
  "aob"         : String,
  // aob_defined interger  null  area of benefit defined by Governing Document (T/F)
  "aob_defined" : String,
  // nhs varchar(1)  not null  NHS charity (T/F)
  "nhs"         : String,
  // ha_no integer null  Housing Association number
  "ha_no"       : String,
  // corr varchar(255)  null  Charity correspondent name. NULL if charity status is “Removed”
  "corr"        : String,
  // add1 varchar(35) null  address line of charity’s correspondent. NULL if charity status is “Removed”
  "add1"        : String,
  // add2 varchar(35) null  address line of charity’s correspondent. NULL if charity status is “Removed”
  "add2"        : String,
  // add3 varchar(35) null  address line of charity’s correspondent. NULL if charity status is “Removed”
  "add3"        : String,
  // add4 varchar(35) null  address line of charity’s correspondent. NULL if charity status is “Removed”
  "add4"        : String,
  // add5 varchar(35) null  address line of charity’s correspondent. NULL if charity status is “Removed”
  "add5"        : String,
  // postcode varchar(8)  null  postcode of charity’s correspondent. NULL if charity status is “Removed”
  "postcode"    : String,
  // phone varchar(400)  null  telephone of charity’s correspondent. NULL if charity status is “Removed”
  "phone"       : String,
  // fax integer null  fax of charity’s correspondent. NULL if charity status is “Removed”
  "fax"         : String
};

schemas["v0.1"].extract_charity_aoo = {
  // regno integer null  registered number of a charity
  "regno" : String,
  // aootype varchar(10) not null  A B or D
  "aootype" : String,
  // aookey  integer not null  up to three digits
  "aookey" : String,
  // welsh varchar(1)  not null  Flag: “Y” or blank
  "welsh" : String,
  // master  integer null  may be blank. If aootype=D then holds continent; if aootype=B then holds GLA/met county
  "master" : String
};

schemas["v0.1"].extract_class = {
  // regno integer null  registered number of a charity
  "regno" : String,
  // class varchar(10) not null  classification code for a charity (multiple occurrences possible)
  "class" : String
};

schemas["v0.1"].extract_class_ref = {
  // classno varchar(10) not null  classification code
  "classno" : String,
  // classtext varchar(65) null  description of a classification code
  "classtext" : String
};

schemas["v0.1"].extract_financial = {
  // regno integer null  registered number of a charity
  "regno" : String,
  // fystart smalldatetime null  Charity’s financial year start date
  "fystart" : String,
  // fyend smalldatetime null  Charity’s financial year end date
  "fyend" : String,
  // income  numeric(12,0) null  
  "income" : String,
  // expend  numeric(12,0) null  
  "expend" : String
};

schemas["v0.1"].extract_main_charity = {
  // regno integer null  registered number of a charity
  "regno" : String, //{ "type" : String, "index" : true, "unique" : true },
  // coyno varchar(50) null  company registration number
  "coyno" : String,
  // trustees  varchar(1)  not null  trustees incorporated (T/F)
  "trustees" : String,
  // fyend varchar(4)  null  Financial year end
  "fyend" : String,
  // welsh varchar(1)  not null  requires correspondence in both Welsh & English (T/F)
  "welsh" : String,
  // incomedate  smalldatetime null  date for latest gross income (blank if income is an estimate)
  "incomedate" : String,
  // income  numeric(12,0) null  
  "income" : String,
  // grouptype varchar(3)  null  may be blank
  "grouptype" : String,
  // email varchar(400)  null  email address
  "email" : String,
  // web varchar(400)  null  website address
  "web" : String
};

schemas["v0.1"].extract_name = {
  // regno integer null  registered number of a charity
  "regno" : String,
  // subno integer null  subsidiary number of a charity (may be 0 for main/group charity)
  "subno" : String,
  // nameno  integer not null  number identifying a charity name
  "nameno" : String,
  // name  varchar(255)  null  name of a charity (multiple occurrences possible)
  "name" : String
};

schemas["v0.1"].extract_objects = {
  // regno integer null  registered number of a charity
  "regno" : String,
  // subno integer null  subsidiary number of a charity (may be 0 for main/group charity)
  "subno" : String,
  // seqno varchar(4)  null  Sequence number (in practice 0-20)
  "seqno" : String,
  // object  varchar(max)  null  Description of objects of a charity
  "object" : String
};

schemas["v0.1"].extract_partb = {
  // regno integer null  registered number of a charity
  "regno" : String,
  // artype  char(4) not null  annual return mailing cycle code
  "artype" : String,
  // fystart datetime  not null  Charity’s financial year start date
  "fystart" : String,
  // fyend datetime  not null  Charity’s financial year end date
  "fyend" : String,
  // inc_leg varchar(max)  null  Legacies
  "inc_leg" : String,
  // inc_end varchar(max)  null  Endowments
  "inc_end" : String,
  // inc_vol varchar(max)  null  Voluntary Income
  "inc_vol" : String,
  // inc_fr  varchar(max)  null  Activities generating funds
  "inc_fr" : String,
  // inc_char  varchar(max)  null  Charitable activities
  "inc_char" : String,
  // inc_invest  varchar(max)  null  Investment income
  "inc_invest" : String,
  // inc_other varchar(max)  null  Other Income
  "inc_other" : String,
  // inc_total varchar(max)  null  Total Incoming resources
  "inc_total" : String,
  // invest_gain varchar(max)  null  Gains/loss on investments
  "invest_gain" : String,
  // asset_gain  varchar(max)  null  Revaluations of fixed assets
  "asset_gain" : String,
  // pension_gain  varchar(max)  null  Gains/loss on Pension Fund
  "pension_gain" : String,
  // exp_vol varchar(max)  null  Voluntary income costs
  "exp_vol" : String,
  // exp_trade varchar(max)  null  Fundraising Trading costs
  "exp_trade" : String,
  // exp_invest  varchar(max)  null  Investment Management costs
  "exp_invest" : String,
  // exp_grant varchar(max)  null  Grants to institutions
  "exp_grant" : String,
  // exp_charble varchar(max)  null  Charitable Activities costs
  "exp_charble" : String,
  // exp_gov varchar(max)  null  Governance costs
  "exp_gov" : String,
  // exp_other varchar(max)  null  Other resources expended
  "exp_other" : String,
  // exp_total varchar(max)  null  Total Resources expended
  "exp_total" : String,
  // exp_support varchar(max)  null  Support costs
  "exp_support" : String,
  // exp_dep varchar(max)  null  Depreciation
  "exp_dep" : String,
  // reserves  varchar(max)  null  Reserves
  "reserves" : String,
  // asset_open  varchar(max)  null  Total fixed assets (at start of year)
  "asset_open" : String,
  // asset_close varchar(max)  null  Total fixed assets
  "asset_close" : String,
  // fixed_assets  varchar(max)  null  Fixed Investments Assets
  "fixed_assets" : String,
  // open_assets varchar(max)  null  Fixed Investments Assets (start of year)
  "open_assets" : String,
  // invest_assets varchar(max)  null  Current Investment Assets
  "invest_assets" : String,
  // cash_assets varchar(max)  null  Cash
  "cash_assets" : String,
  // current_assets  varchar(max)  null  Total Current Assets
  "current_assets" : String,
  // credit_1  varchar(max)  null  Creditors – within one year
  "credit_1" : String,
  // credit_long varchar(max)  null  Creditors – Long Term/Provision
  "credit_long" : String,
  // pension_assets  varchar(max)  null  Pension Assets/Liabilities
  "pension_assets" : String,
  // total_assets  varchar(max)  null  Total Net Assets/Liabilities
  "total_assets" : String,
  // funds_end varchar(max)  null  Endowment funds
  "funds_end" : String,
  // funds_restrict  varchar(max)  null  Restricted funds
  "funds_restrict" : String,
  // funds_unrestrict  varchar(max)  null  Unrestricted funds
  "funds_unrestrict" : String,
  // funds_total varchar(max)  null  Total funds
  "funds_total" : String,
  // employees varchar(max)  null  Employees
  "employees" : String,
  // volunteers  varchar(max)  null  Volunteers
  "volunteers" : String,
  // cons_acc  varchar(max)  null  Consolidated accounts (True/False)
  "cons_acc" : String,
  // charity_acc varchar(max)  null  Charity only accounts (True/False)
  "charity_acc" : String
};

schemas["v0.1"].extract_registration = {
  // regno integer null  registered number of a charity
  "regno" : String,
  // subno integer null  subsidiary number of a charity (may be 0 for main/group charity)
  "subno" : String,
  // regdate smalldatetime null  date of registration for a charity
  "regdate" : String,
  // remdate smalldatetime null  Removal date of a charity – Blank for Registered Charities
  "remdate" : String,
  // remcode char(3) null  Register removal reason code
  "remcode" : String
};

schemas["v0.1"].extract_remove_ref = {
  // code  char(3) null  Register removal reason code
  "code" : String,
  // text  char(25)  null  Removal reason description
  "text" : String
};

schemas["v0.1"].extract_trustee = {
  // regno integer null  registered number of a charity
  "regno" : String,
  // trustee varchar(255)  null  Name of a charity trustee
  "trustee" : String
};


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
          ccModels[version][collectionName] = modelCreator.model(collectionName, Schema);
        }
      }
    }
  }
  return ccModels;
}


module.exports = getModels;
