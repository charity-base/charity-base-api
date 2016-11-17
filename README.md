# open-charities

----

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:

* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).

## Downloading open-charities
The best way to get open-charities is with Git, which usually comes installed on Mac OSX and Linux computers.  On the command-line, navigate to the directory you want open-charities to live in and run:
```bash
$ git clone https://github.com/tithebarn/open-charities.git open-charities
```
If that doesn't work you might need to [download & install Git](https://git-scm.com/downloads).

## Installation
Once you've downloaded the code and installed the prerequisites, you're just a few steps away from running your own version of open-charities.

To install the dependencies, navigate to the open-charities directory and run:
```bash
$ npm install
```

----

## open-charities/data
The data directory contains several scripts for constructing a database of charities registered in England & Wales.  To run these scripts, navigate to the open-charities/data directory on the command line.

### download-register.js
Downloads the register of charities from the [Charity Commission](http://data.charitycommission.gov.uk/) (generally updated monthly).  It takes ~1 minute to download the register which should be a zipped directory of .bcp files (it's not necessary to unzip this - see `zip-to-csvs.js`).

Optional flags:

Option       |    Default              | Description
---          | ---                     | ---
`--year`     |    `2016`               | Four digit year of register.
`--month`    |    `11`                 | Two digit numbered month of register.
`--url`      |    *no default*         | Specify file to download (overrides year & month options).
`--out`      |    `./cc-register.zip`  | Path of file to write to.

e.g. to download the register from September 2016

```bash
$ node download-register.js --month 09
```

### zip-to-csvs.js
Converts the .bcp files in the downloaded .zip to .csv files.
This script requires you have [Perl](https://www.perl.org/get.html) - it usually comes installed on Mac OSX and Linux computers.

Optional flags:

Option     |    Default                | Description
---        | ---                       | ---
`--in`     |    `./cc-register.zip`    | Path to .zip file downloaded from charity commission.
`--out`    |    `./cc-register-csvs`   | Path to new (non-existent) directory to write to.

e.g. to read the file ./cc-register.zip and write CSVs to ./cc-register-csvs

```bash
$ node zip-to-csvs.js
```

### csvs-to-mongo.js
Loads a directory of CSV files into MongoDB (one collection per file).  Makes use of the models defined in `open-charities/data/models`

Optional flags:

Option          |    Default                | Description
---             | ---                       | ---
`--in`          |    `./cc-register-csvs`   | Path to directory of .csv files.
`--dbName`      |    `cc-register`          | Name of new database to write to.
`--batchSize`   |    `10000`                | Sets limit of object size to prevent memory issues.

e.g. to write to a new database called 'my-new-database'

```bash
$ node csvs-to-mongo.js --dbName my-new-database
```

### merge-extracts.js
Merges the 15 collections in database 'cc-register' into a single collection in a new database 'open-charities'.  Makes use of the models and schema conversion defined in `open-charities/data/models`.

Optional flags:

Option              |    Default            | Description
---                 | ---                   | ---
`--ccExtractDb`     |    `cc-register`      | Name of database containing cc extract collections.
`--openCharitiesDb` |    `open-charities`   | Name of new database to write to.
`--batchSize`       |    `10000`            | Sets limit of object size to prevent memory issues.

e.g.

```bash
$ node merge-extracts.js
```

----

## open-charities/api
Documentation coming soon...
