# open-charities/data

## Contents
- [Introduction] (#introduction)
- [Downloading the Register] (#downloading-the-register)
- [Converting to CSV] (#converting-to-csv)
- [Loading to MongoDB] (#loading-to-mongodb)
- [Creating/Updating open-charities DB] (#creatingupdating-open-charities-db)
- [Scraping Supplementary Data] (#scraping-supplementary-data)

## Introduction
This directory contains several scripts for constructing the OpenCharities database on your own computer.

## Downloading the Register
The script `download-register.js` will download the register of charities (~122MB) from the [Charity Commission](http://data.charitycommission.gov.uk/) (generally updated monthly).  It takes ~1 minute to download the register which should be a zipped directory of .bcp files (it's not necessary to manually unzip this - see [Converting to CSV] (#converting-to-csv)).
The data download contains public sector information licensed under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

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

## Converting to CSV
The script `zip-to-csvs.js` will read the downloaded .zip and write a directory of .csv files - one for each of the 15 tables in the [Commission's schema] (http://data.charitycommission.gov.uk/data-definition.aspx).
This script requires you have [Perl](https://www.perl.org/get.html) (which usually comes installed on Mac OSX and Linux computers).

Optional flags:

Option     |    Default                | Description
---        | ---                       | ---
`--in`     |    `./cc-register.zip`    | Path to .zip file downloaded from charity commission.
`--out`    |    `./cc-register-csvs`   | Path to new (non-existent) directory to write to.

e.g. to read the file ./cc-register.zip and write CSVs to ./cc-register-csvs

```bash
$ node zip-to-csvs.js
```

## Loading to MongoDB
The script `csvs-to-mongo.js` will load a directory of CSV files into MongoDB with one collection per file, sticking to the [Commission's schema] (http://data.charitycommission.gov.uk/data-definition.aspx).  Makes use of the models defined in `open-charities/data/models/cc-extract.js`.

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

## Creating/Updating open-charities DB
The script `merge-extracts.js` will read the 15 collections in database 'cc-register' and upsert into a single-collection database, adopting the open-charities schema defined in `open-charities/data/models/charity.js`.  Makes use of the schema conversion defined in `utils/schema-conversion.js`.

**_What does upsert mean?_** The first time you run this script it will create the open-charities database from scratch.  Subsequent calls will update the existing records instead of inserting duplicates.  It will still insert any new charities if the cc-register database has been udpated since the last call.

Optional flags:

Option              |    Default            | Description
---                 | ---                   | ---
`--ccExtractDb`     |    `cc-register`      | Name of database containing cc extract collections.
`--openCharitiesDb` |    `open-charities`   | Name of new database to write to.
`--batchSize`       |    `10000`            | Sets limit of object size to prevent memory issues.

e.g. to limit bulk upserts to batches of 5000

```bash
$ node merge-extracts.js --batchSize 5000
```

## Scraping Supplementary Data
The script `supplement.js` makes use of `utils/stream-scrape-update.js` to read through the open-charities database, visit webpages unique to each record, scrape specified content from each and persist it to the database.

Before running you must customise the `dbOptions` object in `supplement.js` to specify which records to consider and how to persist new content.  You must also customise the `scrapingOptions` object to specifiy the target URLs (e.g. a function of charity number) and a jQuery-like method for extracting the desired content from the HTML.

Optional flags:

Option              |    Default          | Description
---                 | ---                 | ---
`--openCharitiesDb` |    `open-charities` | Name of OpenCharities database.
`--scrapeBatchSize` |    `80`             | Number of pages to visit at once.
`--bulkBatchSize`   |    `800`            | Batch size of bulk DB updates.

e.g. to limit the number of parallel HTTP requests to 5:

```bash
$ node supplement.js --scrapeBatchSize 5
```
