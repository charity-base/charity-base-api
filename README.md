# charity-base-api

CharityBase is an API which provides data on the activities, history, areas of operation and finances of 350,000 charities and their subsidiaries.

## Endpoint
The API has one endpoint:
```bash
GET https://charitybase.uk/api/v0.3.0/charities
```

## API docs
See [https://charitybase.uk](https://charitybase.uk).

## Data
See [charity-base-data](https://github.com/tythe-org/charity-base-data).

## Prerequisites
To run your own version of the API, make sure you've installed the following prerequisites on your development machine:

* Node.js v6.9 - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB v3.2 - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).

You must also import the CharityBase database before running the API - see [charity-base-data](https://github.com/tythe-org/charity-base-data).
